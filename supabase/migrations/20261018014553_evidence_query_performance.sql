-- Cover the 59 foreign keys missing a valid index prefix in the foundation.
-- Existing primary/unique/index prefixes are retained; no production data changes.
create index events_creator_id_idx on public.events (creator_id);
create index learning_notes_unit_id_idx on public.learning_notes (unit_id);
create index learning_progress_unit_id_idx on public.learning_progress (unit_id);
create index participation_events_event_id_idx on public.participation_events (event_id);
create index participation_events_recorded_by_idx on public.participation_events (recorded_by);
create index practice_attempts_user_id_idx on public.practice_attempts (user_id);
create index published_questions_candidate_id_idx on public.published_questions (candidate_id);
create index published_questions_question_id_idx on public.published_questions (question_id);
create index published_questions_video_id_idx on public.published_questions (video_id);
create index quest_ledger_participation_id_idx on public.quest_ledger (participation_id);
create index saved_questions_question_id_idx on public.saved_questions (question_id);
create index argument_steps_claim_id_idx on research.argument_steps (claim_id);
create index argument_steps_interval_id_idx on research.argument_steps (interval_id);
create index argument_steps_parent_step_id_idx on research.argument_steps (parent_step_id);
create index candidate_evidence_evidence_id_idx on research.candidate_evidence (evidence_id);
create index candidate_lineage_child_id_idx on research.candidate_lineage (child_id);
create index citation_links_claim_id_idx on research.citation_links (claim_id);
create index citation_links_evidence_id_idx on research.citation_links (evidence_id);
create index claims_interval_id_idx on research.claims (interval_id);
create index coverage_audits_video_id_idx on research.coverage_audits (video_id);
create index creator_approvals_creator_id_idx on research.creator_approvals (creator_id);
create index discovery_run_sources_video_id_track_id_transcript_version_idx on research.discovery_run_sources (video_id, track_id, transcript_version, source_sha256);
create index draft_curriculum_units_objective_id_idx on research.draft_curriculum_units (objective_id);
create index editorial_reviews_reviewer_id_idx on research.editorial_reviews (reviewer_id);
create index evidence_items_interval_id_idx on research.evidence_items (interval_id);
create index extraction_jobs_run_id_idx on research.extraction_jobs (run_id);
create index extraction_jobs_video_id_track_id_transcript_version_idx on research.extraction_jobs (video_id, track_id, transcript_version);
create index graph_edges_graph_version_id_from_node_id_idx on research.graph_edges (graph_version_id, from_node_id);
create index graph_edges_graph_version_id_to_node_id_idx on research.graph_edges (graph_version_id, to_node_id);
create index graph_edges_interval_id_idx on research.graph_edges (interval_id);
create index graph_nodes_candidate_id_idx on research.graph_nodes (candidate_id);
create index graph_nodes_interval_id_idx on research.graph_nodes (interval_id);
create index graph_versions_run_id_idx on research.graph_versions (run_id);
create index hypotheses_candidate_id_idx on research.hypotheses (candidate_id);
create index hypothesis_tests_hypothesis_id_idx on research.hypothesis_tests (hypothesis_id);
create index learning_objectives_candidate_id_idx on research.learning_objectives (candidate_id);
create index moderation_actions_moderator_id_idx on research.moderation_actions (moderator_id);
create index moderation_actions_question_id_idx on research.moderation_actions (question_id);
create index motif_candidates_run_id_idx on research.motif_candidates (run_id);
create index question_creator_approvals_creator_id_idx on research.question_creator_approvals (creator_id);
create index question_publication_drafts_candidate_id_idx on research.question_publication_drafts (candidate_id);
create index question_publication_drafts_question_id_idx on research.question_publication_drafts (question_id);
create index question_publication_drafts_video_id_idx on research.question_publication_drafts (video_id);
create index question_publication_reviews_reviewer_id_idx on research.question_publication_reviews (reviewer_id);
create index questions_interval_id_idx on research.questions (interval_id);
create index review_decisions_reviewer_id_idx on research.review_decisions (reviewer_id);
create index session_notes_author_id_idx on research.session_notes (author_id);
create index session_notes_event_id_idx on research.session_notes (event_id);
create index source_permissions_approved_by_idx on research.source_permissions (approved_by);
create index source_unit_links_evidence_id_idx on research.source_unit_links (evidence_id);
create index speaker_turns_interval_id_idx on research.speaker_turns (interval_id);
create index speaker_turns_reply_to_idx on research.speaker_turns (reply_to);
create index speech_acts_turn_id_idx on research.speech_acts (turn_id);
create index transcript_versions_video_id_source_sha256_idx on research.transcript_versions (video_id, source_sha256);
create index unit_creator_approvals_creator_id_idx on research.unit_creator_approvals (creator_id);
create index video_intervals_video_id_source_sha256_idx on research.video_intervals (video_id, source_sha256);
create index video_intervals_video_id_track_id_transcript_version_segme_idx on research.video_intervals (video_id, track_id, transcript_version, segment_id);
create index videos_recording_id_idx on research.videos (recording_id);
create index videos_source_id_idx on research.videos (source_id);

-- Staff SELECT already covers admin reads. FOR ALL made PostgreSQL evaluate a
-- second permissive SELECT policy; split writes without changing capabilities.
do $$ declare target_table text; begin
  for target_table in
    select tablename from pg_catalog.pg_policies
    where schemaname='research' and policyname='operator_write' and tablename<>'creator_settings'
    order by tablename
  loop
    execute format('drop policy operator_write on research.%I',target_table);
    execute format('create policy operator_insert on research.%I for insert to authenticated with check ((select research.has_role(array[''admin''])))',target_table);
    execute format('create policy operator_update on research.%I for update to authenticated using ((select research.has_role(array[''admin'']))) with check ((select research.has_role(array[''admin''])))',target_table);
    execute format('create policy operator_delete on research.%I for delete to authenticated using ((select research.has_role(array[''admin''])))',target_table);
  end loop;
end $$;

-- A creator may mutate their own settings; admin retains cross-owner writes.
-- staff_read remains the only SELECT policy, including reviewer read access.
drop policy operator_write on research.creator_settings;
drop policy creator_own_settings on research.creator_settings;
create policy settings_insert on research.creator_settings for insert to authenticated
  with check((select research.has_role(array['admin'])) or
    (creator_id=(select auth.uid()) and (select research.has_role(array['creator']))));
create policy settings_update on research.creator_settings for update to authenticated
  using((select research.has_role(array['admin'])) or
    (creator_id=(select auth.uid()) and (select research.has_role(array['creator']))))
  with check((select research.has_role(array['admin'])) or
    (creator_id=(select auth.uid()) and (select research.has_role(array['creator']))));
create policy settings_delete on research.creator_settings for delete to authenticated
  using((select research.has_role(array['admin'])) or
    (creator_id=(select auth.uid()) and (select research.has_role(array['creator']))));

-- Keep anonymous visibility publication-only and preserve creator/admin draft
-- reads. Separate role targets avoid granting anon the private role helper.
drop policy event_read on public.events;
drop policy event_write on public.events;
create policy event_public_read on public.events for select to anon using(publication_approved);
create policy event_member_read on public.events for select to authenticated
  using(publication_approved or (select research.has_role(array['creator','admin'])));
create policy event_insert on public.events for insert to authenticated
  with check((select research.has_role(array['creator','admin'])) and creator_id=(select auth.uid()));
create policy event_update on public.events for update to authenticated
  using((select research.has_role(array['creator','admin'])))
  with check((select research.has_role(array['creator','admin'])) and creator_id=(select auth.uid()));
create policy event_delete on public.events for delete to authenticated
  using((select research.has_role(array['creator','admin'])));

-- Private segmentation annotations group source moments without adding content.
-- Source identity and segmentation are immutable; corrections use a new ID.
create table research.debate_episodes (
  id text primary key,
  video_id text not null, track_id text not null, transcript_version text not null,
  source_sha256 text not null,
  start_ms bigint not null check(start_ms>=0), end_ms bigint not null check(end_ms>start_ms),
  segmentation_version text not null check(length(trim(segmentation_version))>0),
  review_status text not null default 'pending' check(review_status in ('pending','reviewed','rejected')),
  created_at timestamptz not null default now(),
  foreign key(video_id,track_id,transcript_version,source_sha256)
    references research.transcript_versions(video_id,track_id,transcript_version,source_sha256)
);
create index debate_episodes_source_version_idx on research.debate_episodes(video_id,track_id,transcript_version,source_sha256);
create index debate_episodes_interval_idx on research.debate_episodes(video_id,start_ms,end_ms);
create function research.check_episode_interval() returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op='UPDATE' and row(new.id,new.video_id,new.track_id,new.transcript_version,new.source_sha256,new.start_ms,new.end_ms,new.segmentation_version,new.created_at)
    is distinct from row(old.id,old.video_id,old.track_id,old.transcript_version,old.source_sha256,old.start_ms,old.end_ms,old.segmentation_version,old.created_at) then
    raise check_violation using message='episode source provenance and segmentation are immutable; create a new annotation';
  end if;
  if exists(select 1 from research.videos v where v.id=new.video_id and v.duration_ms is not null and new.end_ms>v.duration_ms) then
    raise check_violation using message='episode interval exceeds known source video duration';
  end if;
  return new;
end $$;
revoke all on function research.check_episode_interval() from public,anon;
create trigger episode_interval before insert or update on research.debate_episodes for each row execute function research.check_episode_interval();
alter table research.debate_episodes enable row level security;
revoke all on research.debate_episodes from public,anon;
grant select,insert,update,delete on research.debate_episodes to authenticated;
grant all on research.debate_episodes to service_role;
create policy staff_read on research.debate_episodes for select to authenticated
  using((select research.has_role(array['reviewer','creator','admin'])));
create policy operator_insert on research.debate_episodes for insert to authenticated
  with check((select research.has_role(array['admin'])));
create policy operator_update on research.debate_episodes for update to authenticated
  using((select research.has_role(array['admin']))) with check((select research.has_role(array['admin'])));
create policy operator_delete on research.debate_episodes for delete to authenticated
  using((select research.has_role(array['admin'])));
