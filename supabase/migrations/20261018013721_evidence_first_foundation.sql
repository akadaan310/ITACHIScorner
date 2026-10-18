-- Evidence first: no content seed, no public transcript API, no automatic staff.
create schema if not exists research;
revoke all on schema research from public, anon;
grant usage on schema research to authenticated, service_role;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (length(nickname) between 1 and 80),
  created_at timestamptz not null default now()
);
create table public.member_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  languages text[] not null default array['en'],
  reduced_motion boolean not null default false,
  email_updates boolean not null default false
);
create table public.consents (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  scope text not null check (length(scope) between 1 and 100), granted boolean not null,
  recorded_at timestamptz not null default now()
);
create table public.account_links (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check(platform in ('youtube','tiktok')),
  handle text not null check(length(handle) between 1 and 100),
  verification text not null default 'self-entered' check(verification in ('self-entered','oauth-verified')),
  created_at timestamptz not null default now(), unique(user_id,platform)
);
create table public.privacy_requests (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check(kind in ('export','delete')), status text not null default 'pending' check(status in ('pending','completed','failed')),
  created_at timestamptz not null default now()
);
create table public.creator_staff (
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check(role in ('reviewer','creator','admin')), primary key(user_id,role)
);
create function research.has_role(roles text[]) returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists(
    select 1 from public.creator_staff s where s.user_id=(select auth.uid()) and s.role=any(roles)
  )
$$;

-- External identifiers are opaque text; transcript versions and provenance are immutable.
create table research.sources (
  id text primary key, platform text not null, canonical_url text not null check(canonical_url ~ '^https://'),
  acquired_at timestamptz not null default now()
);
create table research.recordings (
  id text primary key, independence_reference text not null check(length(trim(independence_reference))>0)
);
create table research.videos (
  id text primary key, source_id text not null references research.sources(id), title text not null,
  source_url text not null check(source_url ~ '^https://'), published_at timestamptz,
  duration_ms bigint check(duration_ms>=0), is_synthetic boolean not null default true,
  recording_id text references research.recordings(id), independence_verified boolean not null default false,
  discovered_at timestamptz not null default now(), content_type text not null default 'unknown' check(content_type in ('video','short','livestream','unknown')),
  status text not null default 'discovered' check(status in ('discovered','inventoried','archived','excluded','blocked')),
  check(not independence_verified or recording_id is not null),
  availability text not null default 'unknown' check(availability in ('available','private','deleted','unavailable','unknown'))
);
create table research.source_checksums (
  video_id text not null references research.videos(id), source_sha256 text not null check(source_sha256 ~ '^[0-9a-f]{64}$'),
  archive_pointer text, recorded_at timestamptz not null default now(), primary key(video_id,source_sha256)
);
create table research.video_caption_tracks (
  video_id text not null references research.videos(id), track_id text not null, language text not null,
  track_type text not null check(track_type in ('manual','automatic','authorized-export','asr-draft')),
  primary key(video_id,track_id)
);
create table research.transcript_versions (
  video_id text not null, track_id text not null, transcript_version text not null,
  source_sha256 text not null, created_at timestamptz not null default now(),
  imported_sequence bigint generated always as identity unique,
  primary key(video_id,track_id,transcript_version),
  unique(video_id,track_id,transcript_version,source_sha256),
  foreign key(video_id,track_id) references research.video_caption_tracks(video_id,track_id),
  foreign key(video_id,source_sha256) references research.source_checksums(video_id,source_sha256)
);
create table research.transcript_segments (
  video_id text not null, track_id text not null, transcript_version text not null, segment_id text not null,
  start_ms bigint not null check(start_ms>=0), end_ms bigint not null, text text not null,
  speaker_id text not null, speaker_role text not null check(speaker_role in ('creator','guest','moderator','unknown')),
  primary key(video_id,track_id,transcript_version,segment_id), check(end_ms>start_ms),
  foreign key(video_id,track_id,transcript_version) references research.transcript_versions(video_id,track_id,transcript_version)
);
create index transcript_interval_lookup on research.transcript_segments(video_id,start_ms,end_ms);
create table research.video_intervals (
  id text primary key, video_id text not null, track_id text not null, transcript_version text not null, segment_id text not null,
  start_ms bigint not null check(start_ms>=0), end_ms bigint not null check(end_ms>start_ms),
  source_sha256 text not null, speaker_id text not null, speaker_role text not null check(speaker_role in ('creator','guest','moderator','unknown')),
  speaker_confidence numeric check(speaker_confidence between 0 and 1),
  evidence_confidence numeric check(evidence_confidence between 0 and 1),
  evidence_confidence_status text not null default 'unassessed' check(evidence_confidence_status in ('unassessed','reviewed')),
  source_url text not null check(source_url ~ '^https://'),
  check((evidence_confidence is null)=(evidence_confidence_status='unassessed')),
  instantaneous boolean not null default false, check(not instantaneous or end_ms-start_ms=1),
  foreign key(video_id,track_id,transcript_version,segment_id) references research.transcript_segments(video_id,track_id,transcript_version,segment_id),
  foreign key(video_id,source_sha256) references research.source_checksums(video_id,source_sha256)
);
create index evidence_interval_lookup on research.video_intervals(video_id,start_ms,end_ms);
create table research.speaker_turns (
  id text primary key, interval_id text not null references research.video_intervals(id), speaker_id text not null,
  reply_to text references research.speaker_turns(id), diarizer_version text not null, confidence numeric not null check(confidence between 0 and 1)
);
create table research.coverage_audits (
  id text primary key, video_id text references research.videos(id), status text not null check(status in ('covered','missing','partial','unavailable','rights-blocked','unknown')),
  reason text not null, audited_at timestamptz not null default now(), manifest_sha256 text not null check(manifest_sha256 ~ '^[0-9a-f]{64}$')
);
create table research.source_permissions (
  video_id text not null references research.videos(id), scope text not null check(scope in ('private-research','public-excerpt','method-attribution')),
  approved_by uuid references auth.users(id) on delete set null, approved_at timestamptz not null default now(),
  authorization_reference text not null check(length(trim(authorization_reference))>0), primary key(video_id,scope)
);
create table research.claims (
  id text primary key, interval_id text not null references research.video_intervals(id), statement text not null,
  attribution text not null, status text not null default 'proposed' check(status in ('proposed','reviewed','rejected'))
);
create table research.questions (
  id text primary key, title text not null, interval_id text references research.video_intervals(id), created_at timestamptz not null default now()
);
create table research.argument_steps (
  id text primary key, interval_id text not null references research.video_intervals(id), claim_id text references research.claims(id),
  kind text not null check(kind in ('premise','objection','rebuttal','support','contradiction','scope-change','unanswered-question')),
  parent_step_id text references research.argument_steps(id)
);
create table research.evidence_items (
  id text primary key, interval_id text not null references research.video_intervals(id), excerpt text not null check(length(excerpt)>0),
  extraction_method text not null check(length(trim(extraction_method))>0),
  extraction_version text not null check(length(trim(extraction_version))>0), confidence numeric check(confidence>0 and confidence<=1),
  confidence_status text not null default 'unassessed' check(confidence_status in ('unassessed','reviewed')),
  check((confidence is null)=(confidence_status='unassessed'))
);
create table research.citation_links (
  id text primary key, evidence_id text not null references research.evidence_items(id), claim_id text references research.claims(id),
  source_type text not null check(source_type in ('quran','primary','quotation','paraphrase','other')),
  source_locator text not null, edition text, verification text not null default 'unverified' check(verification in ('unverified','verified','disputed'))
);
create table research.speech_acts (
  id text primary key, turn_id text not null references research.speaker_turns(id),
  label text not null check(label in ('question','clarification','claim','evidence-request','challenge','rebuttal','concession','return-to-claim','summary','citation','uncertainty','refusal')),
  method_version text not null, confidence numeric not null check(confidence between 0 and 1), human_reviewed boolean not null default false
);
create table research.discovery_runs (
  id text primary key, code_commit text not null, config_hash text not null check(config_hash ~ '^[0-9a-f]{64}$'),
  data_manifest_hash text not null check(data_manifest_hash ~ '^[0-9a-f]{64}$'), corpus_snapshot text not null,
  algorithm text not null, is_synthetic boolean not null default true, created_at timestamptz not null default now()
);
create table research.discovery_run_sources (
  run_id text not null references research.discovery_runs(id), video_id text not null, track_id text not null,
  transcript_version text not null, source_sha256 text not null,
  source_role text not null check(source_role in ('corpus','contrast','control')),
  primary key(run_id,video_id,track_id,transcript_version,source_role),
  foreign key(video_id,track_id,transcript_version,source_sha256) references research.transcript_versions(video_id,track_id,transcript_version,source_sha256)
);
create table research.extraction_jobs (
  id text primary key, run_id text references research.discovery_runs(id), video_id text not null, track_id text not null,
  transcript_version text not null, job_kind text not null check(job_kind in ('normalize','diarize','annotate','mine','validate')),
  status text not null default 'queued' check(status in ('queued','running','succeeded','failed')),
  code_version text not null, config_hash text not null check(config_hash ~ '^[0-9a-f]{64}$'),
  started_at timestamptz, completed_at timestamptz, cost_usd numeric not null default 0 check(cost_usd>=0), failure_reason text,
  foreign key(video_id,track_id,transcript_version) references research.transcript_versions(video_id,track_id,transcript_version),
  check(completed_at is null or started_at is not null and completed_at>=started_at)
);
create table research.motif_candidates (
  id text primary key, run_id text not null references research.discovery_runs(id), label_internal text not null,
  definition text not null, hypothesis text not null, uncertainty text not null, confounders text not null,
  stale boolean not null default false, requires_scholarly_review boolean not null default false,
  created_at timestamptz not null default now()
);
create table research.candidate_evidence (
  candidate_id text not null references research.motif_candidates(id), evidence_id text not null references research.evidence_items(id),
  kind text not null check(kind in ('support','counterexample')), primary key(candidate_id,evidence_id)
);
create table research.hypotheses (
  id text primary key, candidate_id text not null references research.motif_candidates(id), statement text not null,
  alternative_explanations text not null
);
create table research.hypothesis_tests (
  id text primary key, hypothesis_id text not null references research.hypotheses(id),
  test_kind text not null check(test_kind in ('falsification','matched-contrast','robustness','replication')),
  method text not null check(length(method)>0), passed boolean not null default false,
  report_checksum text not null check(report_checksum ~ '^[0-9a-f]{64}$'), executed_at timestamptz not null default now()
);
create table research.scholar_qualifications (
  user_id uuid primary key references auth.users(id) on delete cascade, qualification_reference text not null,
  verified_at timestamptz not null default now()
);
create table research.review_decisions (
  id uuid primary key default gen_random_uuid(), candidate_id text not null references research.motif_candidates(id),
  review_kind text not null check(review_kind in ('evidence','falsification','contrast','theology')),
  decision text not null check(decision in ('pending','accepted','rejected')),
  reviewer_id uuid references auth.users(id) on delete set null, reviewed_at timestamptz not null default now(),
  rationale text not null default '', input_sha256 text not null, unique(candidate_id,review_kind)
);
create table research.creator_approvals (
  candidate_id text primary key references research.motif_candidates(id), creator_id uuid references auth.users(id) on delete set null,
  approved_at timestamptz not null default now(), authorization_reference text not null check(length(trim(authorization_reference))>0), input_sha256 text not null
);
create table research.graph_versions (
  id text primary key, run_id text not null references research.discovery_runs(id), graph_kind text not null check(graph_kind in ('provenance','dialogue','argument','evidence','motif','learning-dependency','causal-hypothesis')),
  schema_version text not null, checksum text not null check(checksum ~ '^[0-9a-f]{64}$')
);
create table research.graph_nodes (
  graph_version_id text not null references research.graph_versions(id), id text not null, node_type text not null,
  interval_id text references research.video_intervals(id), candidate_id text references research.motif_candidates(id),
  primary key(graph_version_id,id)
);
create table research.graph_edges (
  graph_version_id text not null, id text not null, from_node_id text not null, to_node_id text not null,
  relation text not null, interval_id text references research.video_intervals(id),
  epistemic_status text not null check(epistemic_status in ('observed','hypothesis','curated')),
  primary key(graph_version_id,id), check(epistemic_status<>'observed' or interval_id is not null),
  foreign key(graph_version_id,from_node_id) references research.graph_nodes(graph_version_id,id),
  foreign key(graph_version_id,to_node_id) references research.graph_nodes(graph_version_id,id)
);
create table research.candidate_lineage (
  parent_id text not null references research.motif_candidates(id), child_id text not null references research.motif_candidates(id),
  primary key(parent_id,child_id), check(parent_id<>child_id)
);
create table research.learning_objectives (
  id text primary key, candidate_id text not null references research.motif_candidates(id), objective text not null,
  assessment_rubric text not null
);
create table research.draft_curriculum_units (
  id text primary key, objective_id text not null references research.learning_objectives(id), title text not null,
  body text not null, public_summary text not null, exercise text not null, uncertainty_statement text not null, created_at timestamptz not null default now()
);
create table research.source_unit_links (
  unit_id text not null references research.draft_curriculum_units(id), evidence_id text not null references research.evidence_items(id),
  primary key(unit_id,evidence_id)
);
create table research.editorial_reviews (
  id uuid primary key default gen_random_uuid(), unit_id text not null references research.draft_curriculum_units(id),
  reviewer_id uuid references auth.users(id) on delete set null, decision text not null check(decision in ('pending','accepted','rejected')),
  reviewed_at timestamptz not null default now(), rationale text not null, input_sha256 text not null, unique(unit_id,reviewer_id)
);
create table research.unit_creator_approvals (
  unit_id text primary key references research.draft_curriculum_units(id), creator_id uuid references auth.users(id) on delete set null,
  approved_at timestamptz not null default now(), authorization_reference text not null check(length(trim(authorization_reference))>0), input_sha256 text not null
);

-- Decisions bind the exact semantic input pack, never just a mutable candidate ID.
create function research.candidate_snapshot(candidate text) returns text
language plpgsql stable security definer set search_path = '' as $$
begin
  return (
  select encode(sha256(convert_to(jsonb_build_object(
    'candidate',to_jsonb(c), 'run',to_jsonb(r),
    'inputs',(select jsonb_agg(jsonb_build_object('mapping',to_jsonb(rs),'version',to_jsonb(v),'video',to_jsonb(video),'recording',to_jsonb(recording)) order by rs.video_id,rs.track_id,rs.transcript_version,rs.source_role)
      from research.discovery_run_sources rs join research.transcript_versions v using(video_id,track_id,transcript_version)
      join research.videos video on video.id=rs.video_id left join research.recordings recording on recording.id=video.recording_id where rs.run_id=r.id),
    'evidence',(select jsonb_agg(jsonb_build_object('link',to_jsonb(ce),'item',to_jsonb(e),'interval',to_jsonb(i),'segment',to_jsonb(s)) order by ce.evidence_id)
      from research.candidate_evidence ce join research.evidence_items e on e.id=ce.evidence_id
      join research.video_intervals i on i.id=e.interval_id join research.transcript_segments s using(video_id,track_id,transcript_version,segment_id) where ce.candidate_id=c.id),
    'hypotheses',(select jsonb_agg(to_jsonb(h) order by h.id) from research.hypotheses h where h.candidate_id=c.id),
    'tests',(select jsonb_agg(to_jsonb(t) order by t.id) from research.hypothesis_tests t join research.hypotheses h on h.id=t.hypothesis_id where h.candidate_id=c.id),
    'parents',(select jsonb_agg(jsonb_build_object('candidate',to_jsonb(p),'snapshot_sha256',research.candidate_snapshot(p.id)) order by p.id) from research.candidate_lineage l join research.motif_candidates p on p.id=l.parent_id where l.child_id=c.id)
  )::text,'UTF8')),'hex') from research.motif_candidates c join research.discovery_runs r on r.id=c.run_id where c.id=candidate
  );
end $$;
create function research.unit_snapshot(unit text) returns text
language sql stable security definer set search_path = '' as $$
  select encode(sha256(convert_to(jsonb_build_object('draft',to_jsonb(u),'objective',to_jsonb(o),
    'candidate_sha256',research.candidate_snapshot(o.candidate_id),
    'sources',(select jsonb_agg(to_jsonb(l) order by l.evidence_id) from research.source_unit_links l where l.unit_id=u.id)
  )::text,'UTF8')),'hex') from research.draft_curriculum_units u join research.learning_objectives o on o.id=u.objective_id where u.id=unit
$$;
create function research.bind_review_snapshot() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_table_name in ('review_decisions','creator_approvals') then new.input_sha256=research.candidate_snapshot(new.candidate_id);
  else new.input_sha256=research.unit_snapshot(new.unit_id); end if;
  if tg_table_name in ('review_decisions','editorial_reviews') then new.reviewed_at=clock_timestamp();
  else new.approved_at=clock_timestamp(); end if;
  return new;
end $$;
create trigger decision_snapshot before insert or update on research.review_decisions for each row execute function research.bind_review_snapshot();
create trigger creator_snapshot before insert or update on research.creator_approvals for each row execute function research.bind_review_snapshot();
create trigger unit_review_snapshot before insert or update on research.editorial_reviews for each row execute function research.bind_review_snapshot();
create trigger unit_creator_snapshot before insert or update on research.unit_creator_approvals for each row execute function research.bind_review_snapshot();

create table research.question_publication_drafts (
  id text primary key, question_id text not null references research.questions(id), candidate_id text not null references research.motif_candidates(id),
  title text not null, summary text not null, source_url text not null, video_id text not null references research.videos(id),
  start_ms bigint not null check(start_ms>=0), end_ms bigint not null check(end_ms>start_ms), speaker text not null,
  confidence numeric not null check(confidence>0 and confidence<=1)
);
create table research.question_publication_reviews (
  publication_id text primary key references research.question_publication_drafts(id), reviewer_id uuid references auth.users(id) on delete set null,
  decision text not null check(decision in ('pending','accepted','rejected')), reviewed_at timestamptz not null default now(), input_sha256 text not null
);
create table research.question_creator_approvals (
  publication_id text primary key references research.question_publication_drafts(id), creator_id uuid references auth.users(id) on delete set null,
  authorization_reference text not null check(length(trim(authorization_reference))>0), approved_at timestamptz not null default now(), input_sha256 text not null
);
create function research.question_snapshot(publication text) returns text
language sql stable security definer set search_path = '' as $$
  select encode(sha256(convert_to(jsonb_build_object('draft',to_jsonb(d),'candidate_sha256',research.candidate_snapshot(d.candidate_id))::text,'UTF8')),'hex')
  from research.question_publication_drafts d where d.id=publication
$$;
create function research.question_publication_digest(publication text) returns text
language sql stable security definer set search_path = '' as $$
  select encode(sha256(convert_to(jsonb_build_object('content',research.question_snapshot(d.id),'review',to_jsonb(r),'creator',to_jsonb(a))::text,'UTF8')),'hex')
  from research.question_publication_drafts d join research.question_publication_reviews r on r.publication_id=d.id
  join research.question_creator_approvals a on a.publication_id=d.id where d.id=publication
$$;
create function research.unit_publication_digest(unit text) returns text
language sql stable security definer set search_path = '' as $$
  select encode(sha256(convert_to(jsonb_build_object('content',research.unit_snapshot(u.id),'creator',to_jsonb(a),
    'reviews',(select jsonb_agg(to_jsonb(r) order by r.id) from research.editorial_reviews r where r.unit_id=u.id))::text,'UTF8')),'hex')
  from research.draft_curriculum_units u join research.unit_creator_approvals a on a.unit_id=u.id where u.id=unit
$$;
create function research.publication_matches(kind text,publication text,expected text) returns boolean
language sql stable security definer set search_path = '' as $$
  select case kind when 'question' then expected=research.question_publication_digest(publication)
    when 'unit' then expected=research.unit_publication_digest(publication) else false end
$$;
create function research.bind_question_snapshot() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.input_sha256=research.question_snapshot(new.publication_id);
  if tg_table_name='question_publication_reviews' then new.reviewed_at=clock_timestamp(); else new.approved_at=clock_timestamp(); end if;
  return new;
end $$;
create trigger question_review_snapshot before insert or update on research.question_publication_reviews for each row execute function research.bind_question_snapshot();
create trigger question_creator_snapshot before insert or update on research.question_creator_approvals for each row execute function research.bind_question_snapshot();

-- Gate reads are booleans only; unexposed definer functions never return source text.
create function research.can_publish(candidate text) returns boolean
language plpgsql stable security definer set search_path = '' as $$
begin
  return (
  select exists (
    select 1 from research.motif_candidates c
    join research.discovery_runs r on r.id=c.run_id
    join research.creator_approvals a on a.candidate_id=c.id
    where c.id=candidate and not c.stale and not r.is_synthetic and a.input_sha256=research.candidate_snapshot(c.id)
      and not exists(select 1 from research.candidate_lineage parent where parent.child_id=c.id and not research.can_publish(parent.parent_id))
      and exists(select 1 from research.discovery_run_sources rs where rs.run_id=r.id)
      and not exists(select 1 from research.discovery_run_sources rs
        join research.transcript_versions original using(video_id,track_id,transcript_version)
        where rs.run_id=r.id and exists(select 1 from research.transcript_versions newer
          where newer.video_id=rs.video_id and newer.track_id=rs.track_id and newer.imported_sequence>original.imported_sequence
            and newer.source_sha256<>rs.source_sha256))
      and exists(select 1 from public.creator_staff s where s.user_id=a.creator_id and s.role in('creator','admin'))
      and (select count(distinct v.recording_id) from research.candidate_evidence ce
        join research.evidence_items e on e.id=ce.evidence_id
        join research.video_intervals i on i.id=e.interval_id
        join research.videos v on v.id=i.video_id
        where ce.candidate_id=c.id and ce.kind='support' and not v.is_synthetic and v.independence_verified
          and exists(select 1 from research.source_permissions p join public.creator_staff s on s.user_id=p.approved_by
            where p.video_id=v.id and p.scope='public-excerpt' and s.role in('creator','admin'))) >= 2
      and not exists(select 1 from research.candidate_evidence ce
        join research.evidence_items e on e.id=ce.evidence_id join research.video_intervals i on i.id=e.interval_id
        join research.videos v on v.id=i.video_id where ce.candidate_id=c.id and (
          v.is_synthetic or e.confidence is null or e.confidence_status<>'reviewed'
          or not exists(select 1 from research.source_permissions p join public.creator_staff s on s.user_id=p.approved_by
            where p.video_id=v.id and p.scope='public-excerpt' and s.role in('creator','admin'))
          or not exists(select 1 from research.discovery_run_sources rs where rs.run_id=r.id
            and rs.video_id=i.video_id and rs.track_id=i.track_id and rs.transcript_version=i.transcript_version and rs.source_sha256=i.source_sha256)))
      and exists(select 1 from research.candidate_evidence ce join research.evidence_items e on e.id=ce.evidence_id
        join research.video_intervals i on i.id=e.interval_id join research.videos v on v.id=i.video_id
        where ce.candidate_id=c.id and ce.kind='counterexample' and not v.is_synthetic)
      and not exists(select 1 from (values('evidence'),('falsification'),('contrast')) needed(kind)
        where not exists(select 1 from research.review_decisions d join public.creator_staff s on s.user_id=d.reviewer_id
          where d.candidate_id=c.id and d.review_kind=needed.kind and d.decision='accepted' and d.input_sha256=research.candidate_snapshot(c.id)
            and s.role in('reviewer','admin') and d.reviewer_id<>a.creator_id))
      and not exists(select 1 from (values('falsification'),('matched-contrast')) needed(kind)
        where not exists(select 1 from research.hypotheses h join research.hypothesis_tests t on t.hypothesis_id=h.id
          where h.candidate_id=c.id and t.test_kind=needed.kind and t.passed))
      and (not c.requires_scholarly_review or exists(select 1 from research.review_decisions d
        join research.scholar_qualifications q on q.user_id=d.reviewer_id
        where d.candidate_id=c.id and d.review_kind='theology' and d.decision='accepted' and d.input_sha256=research.candidate_snapshot(c.id) and d.reviewer_id<>a.creator_id))
  )
  );
end $$;
create function research.can_publish_unit(unit text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from research.draft_curriculum_units u
    join research.learning_objectives o on o.id=u.objective_id
    join research.unit_creator_approvals a on a.unit_id=u.id
    where u.id=unit and research.can_publish(o.candidate_id) and a.input_sha256=research.unit_snapshot(u.id)
      and exists(select 1 from public.creator_staff s where s.user_id=a.creator_id and s.role in('creator','admin'))
      and exists(select 1 from research.editorial_reviews r join public.creator_staff s on s.user_id=r.reviewer_id
        where r.unit_id=u.id and r.decision='accepted' and r.input_sha256=research.unit_snapshot(u.id) and s.role in('reviewer','admin') and r.reviewer_id<>a.creator_id)
      and not exists(select 1 from research.editorial_reviews r where r.unit_id=u.id and r.decision='rejected' and r.input_sha256=research.unit_snapshot(u.id))
      and (select count(distinct v.recording_id) from research.source_unit_links l
        join research.evidence_items e on e.id=l.evidence_id join research.video_intervals i on i.id=e.interval_id
        join research.candidate_evidence ce on ce.evidence_id=e.id and ce.candidate_id=o.candidate_id and ce.kind='support'
        join research.videos v on v.id=i.video_id where l.unit_id=u.id and v.independence_verified and not v.is_synthetic)>=2)
$$;

create table public.published_questions (
  id text primary key references research.question_publication_drafts(id), question_id text not null references research.questions(id), candidate_id text not null references research.motif_candidates(id),
  title text not null check(length(title) between 1 and 240), summary text not null check(length(summary) between 1 and 1600),
  source_url text not null, video_id text not null references research.videos(id) check(video_id ~ '^[A-Za-z0-9_-]{11}$'),
  start_ms bigint not null check(start_ms>=0), end_ms bigint not null check(end_ms>start_ms), speaker text not null,
  confidence numeric not null check(confidence between 0 and 1), reviewed_at timestamptz not null, creator_approved_at timestamptz not null,
  approval_sha256 text not null check(approval_sha256 ~ '^[0-9a-f]{64}$'),
  search_document tsvector generated always as (to_tsvector('simple',title || ' ' || summary || ' ' || speaker)) stored,
  check(source_url='https://www.youtube.com/watch?v='||video_id||'&t='||(start_ms/1000)::text)
);
create index published_question_search on public.published_questions using gin(search_document);
create table public.approved_curriculum_units (
  id text primary key references research.draft_curriculum_units(id), title text not null,
  summary text not null check(length(summary) between 1 and 1600), objective text not null,
  published_at timestamptz not null default now(), approval_sha256 text not null check(approval_sha256 ~ '^[0-9a-f]{64}$')
);
create table public.saved_questions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null references public.published_questions(id) on delete cascade, created_at timestamptz not null default now(), unique(user_id,question_id)
);
create table public.learning_notes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  unit_id text references public.approved_curriculum_units(id) on delete set null, body text not null check(length(body) between 1 and 10000), created_at timestamptz not null default now()
);
create table public.learning_progress (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  unit_id text references public.approved_curriculum_units(id) on delete set null, progress numeric not null default 0 check(progress between 0 and 1), updated_at timestamptz not null default now()
);
create table public.practice_attempts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  scenario_reference text not null, response text, score numeric check(score between 0 and 1), created_at timestamptz not null default now()
);
create table public.community_questions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check(length(body) between 1 and 5000), publication_consent boolean not null default false,
  status text not null default 'pending' check(status in ('pending','reviewed','rejected')), created_at timestamptz not null default now()
);
create table public.events (
  id uuid primary key default gen_random_uuid(), title text not null, starts_at timestamptz not null,
  source_url text check(source_url ~ '^https://'), publication_approved boolean not null default false,
  creator_id uuid references auth.users(id) on delete set null
);
create table public.participation_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid references public.events(id) on delete set null, kind text not null check(kind in ('manual-check-in','in-app-trivia','question')),
  verified boolean not null default false, recorded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create table public.quest_ledger (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  points integer not null, reason text not null, participation_id uuid references public.participation_events(id) on delete set null,
  created_at timestamptz not null default now()
);
create table public.wallet_ledger (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  amount_minor bigint not null, currency text not null check(currency ~ '^[A-Z]{3}$'), reason text not null, provider_event_id text unique,
  created_at timestamptz not null default now()
);
create table research.moderation_actions (
  id uuid primary key default gen_random_uuid(), question_id uuid not null references public.community_questions(id) on delete cascade,
  moderator_id uuid references auth.users(id) on delete set null, action text not null check(action in ('approve','reject','remove','restore')),
  rationale text not null, created_at timestamptz not null default now()
);
create table research.session_notes (
  id uuid primary key default gen_random_uuid(), event_id uuid references public.events(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null, body text not null, created_at timestamptz not null default now()
);
create table research.creator_settings (
  creator_id uuid primary key references auth.users(id) on delete cascade,
  allow_method_attribution boolean not null default false, allow_portrait boolean not null default false,
  permission_reference text, updated_at timestamptz not null default now()
);

-- A private check protects exact span/hash provenance, including overlap and 1 ms instants.
create function research.check_interval() returns trigger language plpgsql set search_path = '' as $$
begin
  if not exists(select 1 from research.transcript_segments s
    join research.transcript_versions v using(video_id,track_id,transcript_version)
    where s.video_id=new.video_id and s.track_id=new.track_id and s.transcript_version=new.transcript_version and s.segment_id=new.segment_id
      and new.start_ms>=s.start_ms and new.end_ms<=s.end_ms and new.source_sha256=v.source_sha256
      and new.speaker_id=s.speaker_id and new.speaker_role=s.speaker_role) then
    raise check_violation using message='interval must retain source bounds, speaker and version checksum';
  end if;
  return new;
end $$;
create trigger exact_interval before insert or update on research.video_intervals for each row execute function research.check_interval();
create function research.check_excerpt() returns trigger language plpgsql set search_path = '' as $$
begin
  if not exists(select 1 from research.video_intervals i join research.transcript_segments s
    using(video_id,track_id,transcript_version,segment_id)
    where i.id=new.interval_id and position(new.excerpt in s.text)>0) then
    raise check_violation using message='evidence excerpt must be exact text in its referenced source segment';
  end if;
  return new;
end $$;
create trigger exact_excerpt before insert or update on research.evidence_items for each row execute function research.check_excerpt();
create function research.check_lineage_dag() returns trigger language plpgsql set search_path = '' as $$
begin
  -- Serialize edge checks so concurrent inserts cannot create a recursion cycle.
  perform pg_catalog.pg_advisory_xact_lock(716526085::bigint);
  if exists(with recursive descendants(id) as (
    select new.child_id union select l.child_id from research.candidate_lineage l join descendants d on l.parent_id=d.id
  ) select 1 from descendants where id=new.parent_id) then
    raise check_violation using message='candidate lineage must remain an acyclic directed graph';
  end if;
  return new;
end $$;
create trigger lineage_dag before insert or update on research.candidate_lineage for each row execute function research.check_lineage_dag();
create function research.immutable_source() returns trigger language plpgsql set search_path = '' as $$
begin raise check_violation using message='source provenance is immutable; import a new transcript version'; end $$;
create trigger immutable_transcript_version before update on research.transcript_versions for each row execute function research.immutable_source();
create trigger immutable_transcript_segment before update on research.transcript_segments for each row execute function research.immutable_source();
create function research.mark_corrected_sources_stale() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if exists(select 1 from research.transcript_versions v where v.video_id=new.video_id and v.track_id=new.track_id and v.source_sha256<>new.source_sha256) then
    with recursive affected(id) as (
      select c.id from research.motif_candidates c join research.discovery_run_sources s on s.run_id=c.run_id
        where s.video_id=new.video_id and s.track_id=new.track_id and s.source_sha256<>new.source_sha256
      union select ce.candidate_id from research.candidate_evidence ce join research.evidence_items e on e.id=ce.evidence_id
        join research.video_intervals i on i.id=e.interval_id where i.video_id=new.video_id and i.track_id=new.track_id and i.source_sha256<>new.source_sha256
      union select l.child_id from research.candidate_lineage l join affected a on a.id=l.parent_id
    ) update research.motif_candidates set stale=true where id in(select id from affected);
  end if;
  return new;
end $$;
create trigger source_correction after insert on research.transcript_versions for each row execute function research.mark_corrected_sources_stale();

-- Public publication metadata must point to an actual supporting source interval.
create function research.valid_question_publication(candidate text,video text,start_at bigint,end_at bigint,who text) returns boolean
language sql stable security definer set search_path = '' as $$
  select research.can_publish(candidate) and exists(select 1 from research.candidate_evidence ce
    join research.evidence_items e on e.id=ce.evidence_id join research.video_intervals i on i.id=e.interval_id
    where ce.candidate_id=candidate and ce.kind='support' and i.video_id=video and i.start_ms=start_at and i.end_ms=end_at and i.speaker_id=who)
$$;
create function research.can_publish_question(publication text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from research.question_publication_drafts d
    join research.question_publication_reviews r on r.publication_id=d.id
    join research.question_creator_approvals a on a.publication_id=d.id
    where d.id=publication and research.valid_question_publication(d.candidate_id,d.video_id,d.start_ms,d.end_ms,d.speaker)
      and r.decision='accepted' and r.input_sha256=research.question_snapshot(d.id) and a.input_sha256=r.input_sha256
      and r.reviewer_id<>a.creator_id
      and exists(select 1 from public.creator_staff s where s.user_id=r.reviewer_id and s.role in('reviewer','admin'))
      and exists(select 1 from public.creator_staff s where s.user_id=a.creator_id and s.role in('creator','admin'))
      and d.source_url='https://www.youtube.com/watch?v='||d.video_id||'&t='||(d.start_ms/1000)::text
      and exists(select 1 from research.candidate_evidence ce join research.evidence_items e on e.id=ce.evidence_id
        join research.video_intervals i on i.id=e.interval_id where ce.candidate_id=d.candidate_id and ce.kind='support'
          and i.video_id=d.video_id and i.start_ms=d.start_ms and i.end_ms=d.end_ms and d.confidence<=e.confidence))
$$;
create function research.check_question_payload() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not research.can_publish_question(new.id) or not exists(select 1 from research.question_publication_drafts d
    join research.question_publication_reviews r on r.publication_id=d.id
    join research.question_creator_approvals a on a.publication_id=d.id where d.id=new.id
      and row(d.question_id,d.candidate_id,d.title,d.summary,d.source_url,d.video_id,d.start_ms,d.end_ms,d.speaker,d.confidence,r.reviewed_at,a.approved_at)
        =row(new.question_id,new.candidate_id,new.title,new.summary,new.source_url,new.video_id,new.start_ms,new.end_ms,new.speaker,new.confidence,new.reviewed_at,new.creator_approved_at)) then
    raise check_violation using message='publication payload must match the exact editorial and creator-approved snapshot';
  end if;
  new.approval_sha256=research.question_publication_digest(new.id);
  return new;
end $$;
create trigger approved_question_payload before insert or update on public.published_questions for each row execute function research.check_question_payload();
create function research.check_unit_payload() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not research.can_publish_unit(new.id) or not exists(select 1 from research.draft_curriculum_units d
    join research.learning_objectives o on o.id=d.objective_id where d.id=new.id
      and row(d.title,d.public_summary,o.objective)=row(new.title,new.summary,new.objective)) then
    raise check_violation using message='curriculum payload must match the exact editorial and creator-approved snapshot';
  end if;
  if tg_op='UPDATE' and new.published_at<>old.published_at then
    raise check_violation using message='publication time is server authoritative';
  end if;
  if tg_op='INSERT' then new.published_at=clock_timestamp(); end if;
  new.approval_sha256=research.unit_publication_digest(new.id);
  return new;
end $$;
create trigger approved_unit_payload before insert or update on public.approved_curriculum_units for each row execute function research.check_unit_payload();

-- Schema-wide default denial; grants and RLS are independent barriers.
do $$ declare t record; begin
  for t in select tablename from pg_tables where schemaname='research' loop
    execute format('alter table research.%I enable row level security',t.tablename);
    execute format('grant select,insert,update,delete on research.%I to authenticated',t.tablename);
    execute format('create policy staff_read on research.%I for select to authenticated using ((select research.has_role(array[''reviewer'',''creator'',''admin''])))',t.tablename);
    if t.tablename not in ('review_decisions','editorial_reviews','creator_approvals','unit_creator_approvals','source_permissions','question_publication_reviews','question_creator_approvals') then
      execute format('create policy operator_write on research.%I for all to authenticated using ((select research.has_role(array[''admin'']))) with check ((select research.has_role(array[''admin''])))',t.tablename);
    end if;
  end loop;
  for t in select tablename from pg_tables where schemaname='public' loop
    execute format('alter table public.%I enable row level security',t.tablename);
    execute format('revoke all on public.%I from anon,authenticated',t.tablename);
  end loop;
end $$;
-- Independent review and creator authorization have separate capabilities.
create policy reviewer_decision on research.review_decisions for insert to authenticated
  with check(reviewer_id=(select auth.uid()) and (select research.has_role(array['reviewer','admin'])));
create policy reviewer_decision_update on research.review_decisions for update to authenticated
  using(reviewer_id=(select auth.uid()) and (select research.has_role(array['reviewer','admin'])))
  with check(reviewer_id=(select auth.uid()) and (select research.has_role(array['reviewer','admin'])));
create policy unit_review on research.editorial_reviews for insert to authenticated
  with check(reviewer_id=(select auth.uid()) and (select research.has_role(array['reviewer','admin'])));
create policy question_review on research.question_publication_reviews for insert to authenticated
  with check(reviewer_id=(select auth.uid()) and (select research.has_role(array['reviewer','admin'])));
create policy question_creator on research.question_creator_approvals for insert to authenticated
  with check(creator_id=(select auth.uid()) and (select research.has_role(array['creator','admin'])));
create policy creator_approval on research.creator_approvals for insert to authenticated
  with check(creator_id=(select auth.uid()) and (select research.has_role(array['creator','admin'])));
create policy creator_unit_approval on research.unit_creator_approvals for insert to authenticated
  with check(creator_id=(select auth.uid()) and (select research.has_role(array['creator','admin'])));
create policy creator_rights on research.source_permissions for insert to authenticated
  with check(approved_by=(select auth.uid()) and (select research.has_role(array['creator','admin'])));
create policy creator_rights_delete on research.source_permissions for delete to authenticated
  using(approved_by=(select auth.uid()) and (select research.has_role(array['creator','admin'])));
do $$ declare t text; begin
  foreach t in array array['creator_approvals','unit_creator_approvals','question_creator_approvals'] loop
    execute format('create policy creator_renew on research.%I for update to authenticated using(creator_id=(select auth.uid()) and (select research.has_role(array[''creator'',''admin'']))) with check(creator_id=(select auth.uid()) and (select research.has_role(array[''creator'',''admin''])))',t);
    execute format('create policy creator_revoke on research.%I for delete to authenticated using(creator_id=(select auth.uid()) and (select research.has_role(array[''creator'',''admin''])))',t);
  end loop;
  foreach t in array array['editorial_reviews','question_publication_reviews'] loop
    execute format('create policy reviewer_renew on research.%I for update to authenticated using(reviewer_id=(select auth.uid()) and (select research.has_role(array[''reviewer'',''admin'']))) with check(reviewer_id=(select auth.uid()) and (select research.has_role(array[''reviewer'',''admin''])))',t);
  end loop;
end $$;
create policy creator_own_settings on research.creator_settings for all to authenticated
  using(creator_id=(select auth.uid()) and (select research.has_role(array['creator','admin'])))
  with check(creator_id=(select auth.uid()) and (select research.has_role(array['creator','admin'])));

grant select on public.creator_staff to authenticated;
create policy own_roles on public.creator_staff for select to authenticated using(user_id=(select auth.uid()));
grant select,insert,update,delete on public.profiles to authenticated;
create policy own_profile on public.profiles for all to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
do $$ declare t text; begin
  foreach t in array array['member_preferences','consents','privacy_requests','community_questions'] loop
    execute format('grant select,insert,update,delete on public.%I to authenticated',t);
    execute format('create policy owner_access on public.%I for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()))',t);
    if t<>'member_preferences' then execute format('create index on public.%I(user_id)',t); end if;
  end loop;
end $$;
grant select,insert,update,delete on public.saved_questions,public.learning_notes,public.learning_progress to authenticated;
create policy own_saved on public.saved_questions for all to authenticated using(user_id=(select auth.uid()))
  with check(user_id=(select auth.uid()) and exists(select 1 from public.published_questions q where q.id=saved_questions.question_id));
create policy own_notes on public.learning_notes for all to authenticated using(user_id=(select auth.uid()))
  with check(user_id=(select auth.uid()) and (unit_id is null or exists(select 1 from public.approved_curriculum_units u where u.id=unit_id)));
create policy own_progress on public.learning_progress for all to authenticated using(user_id=(select auth.uid()))
  with check(user_id=(select auth.uid()) and (unit_id is null or exists(select 1 from public.approved_curriculum_units u where u.id=unit_id)));
create index on public.learning_notes(user_id);
create index on public.learning_progress(user_id);
-- Verification and authoritative ledgers cannot be manufactured by a member.
grant select,insert,update,delete on public.account_links to authenticated;
create policy own_link_read on public.account_links for select to authenticated using(user_id=(select auth.uid()));
create policy own_link_insert on public.account_links for insert to authenticated with check(user_id=(select auth.uid()) and verification='self-entered');
create policy own_link_update on public.account_links for update to authenticated
  using(user_id=(select auth.uid()) and verification='self-entered') with check(user_id=(select auth.uid()) and verification='self-entered');
create policy own_link_delete on public.account_links for delete to authenticated using(user_id=(select auth.uid()));
grant select,delete on public.practice_attempts to authenticated;
grant insert(user_id,scenario_reference,response) on public.practice_attempts to authenticated;
create policy own_attempt on public.practice_attempts for all to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
do $$ declare t text; begin
  foreach t in array array['participation_events','quest_ledger','wallet_ledger'] loop
    execute format('grant select on public.%I to authenticated',t);
    execute format('create policy owner_read on public.%I for select to authenticated using(user_id=(select auth.uid()))',t);
    execute format('create index on public.%I(user_id)',t);
  end loop;
end $$;
-- Members may request privacy actions; only the server/operator records completion.
revoke update on public.privacy_requests from authenticated;
revoke insert on public.privacy_requests from authenticated;
grant insert(user_id,kind) on public.privacy_requests to authenticated;
-- Moderation state remains authoritative.
revoke insert,update on public.community_questions from authenticated;
grant insert(user_id,body,publication_consent) on public.community_questions to authenticated;
grant update(body,publication_consent) on public.community_questions to authenticated;

grant select on public.published_questions,public.approved_curriculum_units,public.events to anon,authenticated;
grant insert,update,delete on public.published_questions,public.approved_curriculum_units,public.events to authenticated;
create policy approved_question_read on public.published_questions for select to anon,authenticated
  using(research.can_publish_question(id) and research.publication_matches('question',id,approval_sha256));
create policy approved_question_insert on public.published_questions for insert to authenticated
  with check((select research.has_role(array['reviewer','admin'])) and research.can_publish_question(id));
create policy approved_question_update on public.published_questions for update to authenticated
  using((select research.has_role(array['reviewer','admin'])) and research.can_publish_question(id))
  with check((select research.has_role(array['reviewer','admin'])) and research.can_publish_question(id));
create policy approved_question_delete on public.published_questions for delete to authenticated using((select research.has_role(array['reviewer','admin'])));
create policy approved_unit_read on public.approved_curriculum_units for select to anon,authenticated using(research.can_publish_unit(id) and research.publication_matches('unit',id,approval_sha256));
create policy approved_unit_insert on public.approved_curriculum_units for insert to authenticated
  with check((select research.has_role(array['reviewer','admin'])) and research.can_publish_unit(id));
create policy approved_unit_update on public.approved_curriculum_units for update to authenticated
  using((select research.has_role(array['reviewer','admin'])) and research.can_publish_unit(id))
  with check((select research.has_role(array['reviewer','admin'])) and research.can_publish_unit(id));
create policy approved_unit_delete on public.approved_curriculum_units for delete to authenticated using((select research.has_role(array['reviewer','admin'])));
create policy event_read on public.events for select to anon,authenticated using(publication_approved);
create policy event_write on public.events for all to authenticated
  using((select research.has_role(array['creator','admin'])))
  with check((select research.has_role(array['creator','admin'])) and creator_id=(select auth.uid()));

create function research.editorial_queue() returns table(kind text,id text,title text,status text,video_id text,created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select 'gap'::text,a.id,'Source coverage gap'::text,a.status,a.video_id,a.audited_at
    from research.coverage_audits a where research.has_role(array['reviewer','creator','admin']) and a.status<>'covered'
  union all
  select 'review'::text,c.id,c.label_internal,case when c.stale then 'stale' else 'pending-review' end,null::text,c.created_at
    from research.motif_candidates c where research.has_role(array['reviewer','creator','admin'])
$$;
create function public.get_editorial_queue() returns table(kind text,id text,title text,status text,video_id text,created_at timestamptz)
language sql stable security invoker set search_path = '' as $$ select * from research.editorial_queue() $$;
revoke all on function public.get_editorial_queue() from public,anon;
grant execute on function public.get_editorial_queue() to authenticated;

revoke all on all tables in schema research from anon;
revoke all on all functions in schema research from public,anon;
grant execute on function research.has_role(text[]),research.editorial_queue(),research.can_publish(text),research.can_publish_unit(text),research.valid_question_publication(text,text,bigint,bigint,text) to authenticated;
grant execute on function research.can_publish(text),research.can_publish_unit(text),research.valid_question_publication(text,text,bigint,bigint,text) to anon;
grant execute on function research.can_publish_question(text) to anon,authenticated;
grant execute on function research.publication_matches(text,text,text) to anon,authenticated;
-- The test and service adapter retain least-privilege member grants; server admin is deliberate.
grant all on all tables in schema public,research to service_role;
grant execute on all functions in schema research to service_role;
alter default privileges in schema research revoke execute on functions from public;

insert into storage.buckets(id,name,public) values('private-corpus','private-corpus',false) on conflict(id) do update set public=false;
create policy corpus_staff_read on storage.objects for select to authenticated
  using(bucket_id='private-corpus' and (select research.has_role(array['reviewer','creator','admin'])));
create policy corpus_operator_write on storage.objects for all to authenticated
  using(bucket_id='private-corpus' and (select research.has_role(array['admin'])))
  with check(bucket_id='private-corpus' and (select research.has_role(array['admin'])));
