-- Follow-up advisor regressions. Run after the original 96 role/gate checks.
select tests.assert(to_regclass('research.debate_episodes') is not null,'private debate episode grouping schema exists');
update research.videos set duration_ms=200 where id='AAAAAAAAAAA';
insert into research.debate_episodes(id,video_id,track_id,transcript_version,source_sha256,start_ms,end_ms,segmentation_version)
  values('test-episode','AAAAAAAAAAA','track','v1',repeat('a',64),10,11,'test-rule-v1');
select tests.assert((select end_ms-start_ms from research.debate_episodes where id='test-episode')=1,'debate episode accepts an exact one-millisecond interval');
select tests.denied($$insert into research.debate_episodes(id,video_id,track_id,transcript_version,source_sha256,start_ms,end_ms,segmentation_version) values('empty-episode','AAAAAAAAAAA','track','v1',repeat('a',64),10,10,'test-rule-v1')$$,'debate episode rejects an empty interval');
select tests.denied($$insert into research.debate_episodes(id,video_id,track_id,transcript_version,source_sha256,start_ms,end_ms,segmentation_version) values('outside-episode','AAAAAAAAAAA','track','v1',repeat('a',64),10,201,'test-rule-v1')$$,'debate episode rejects bounds beyond known video duration');
select tests.denied($$update research.debate_episodes set end_ms=12 where id='test-episode'$$,'episode provenance and segmentation require a new immutable annotation');
set role anon;
select tests.denied('select * from research.debate_episodes','anonymous cannot read debate episode annotations');
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
select tests.assert((select count(*) from research.debate_episodes)=0,'member cannot read private debate episodes');
reset role;
insert into research.source_checksums(video_id,source_sha256) values('AAAAAAAAAAA',repeat('8',64));
insert into research.transcript_versions(video_id,track_id,transcript_version,source_sha256) values('AAAAAAAAAAA','track','v3',repeat('8',64));
select tests.assert((select source_sha256 from research.debate_episodes where id='test-episode')=repeat('a',64),'source correction preserves episode attribution to its immutable original version');
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
select tests.assert((select count(*) from research.debate_episodes)=0,'corrected-source episodes remain private to staff');
reset role;
select tests.assert(not exists(
  select 1 from pg_constraint c join pg_namespace n on n.oid=c.connamespace
  where c.contype='f' and n.nspname in ('public','research') and not exists(
    select 1 from pg_index i where i.indrelid=c.conrelid and i.indisvalid and i.indpred is null
      and i.indnkeyatts>=cardinality(c.conkey)
      and array(select k.attnum from unnest(i.indkey) with ordinality k(attnum,pos)
        where k.pos<=cardinality(c.conkey) order by k.pos)=c.conkey
  )), 'every public/research foreign key has a valid covering index prefix');
select tests.assert(not exists(
  select 1 from pg_policies p cross join (values('anon'),('authenticated')) roles(role_name)
    cross join (values('SELECT'),('INSERT'),('UPDATE'),('DELETE')) actions(action)
  where p.schemaname in ('public','research') and p.permissive='PERMISSIVE'
    and (roles.role_name=any(p.roles::text[]) or 'public'=any(p.roles::text[]))
    and (p.cmd=actions.action or p.cmd='ALL')
  group by p.schemaname,p.tablename,roles.role_name,actions.action having count(*)>1
), 'each role/action uses one permissive policy per public/research table');

insert into public.events(id,title,starts_at,publication_approved,creator_id) values
('10000000-0000-0000-0000-000000000001','TEST ONLY published',now(),true,'00000000-0000-0000-0000-000000000004'),
('10000000-0000-0000-0000-000000000002','TEST ONLY draft',now(),false,'00000000-0000-0000-0000-000000000004');
insert into research.creator_settings(creator_id) values('00000000-0000-0000-0000-000000000004');
set role anon;
select set_config('request.jwt.claim.sub','',false);
select tests.assert((select count(*) from public.events)=1,'anonymous event visibility remains published only');
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
select tests.assert((select count(*) from public.events)=1,'member event visibility remains published only');
select tests.assert((select count(*) from research.creator_settings)=0,'member cannot read creator settings after policy consolidation');
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
select tests.assert((select count(*) from public.events)=1,'reviewer event visibility remains published only');
select tests.assert((select count(*) from research.creator_settings)=1,'reviewer retains staff settings read access');
with changed as(update research.creator_settings set allow_portrait=true returning creator_id)
select tests.assert((select count(*) from changed)=0,'reviewer cannot mutate creator settings');
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000004',false);
select tests.assert((select count(*) from public.events)=2,'creator retains published and draft event access');
with changed as(update research.creator_settings set allow_portrait=true returning creator_id)
select tests.assert((select count(*) from changed)=1,'creator retains own settings update');
select tests.denied($$insert into research.creator_settings(creator_id) values('00000000-0000-0000-0000-000000000002')$$,'creator cannot write another settings owner');
insert into public.events(title,starts_at,creator_id) values('TEST ONLY creator event',now(),auth.uid());
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select tests.assert((select count(*) from public.events)=3,'admin retains published and draft event access');
with changed as(update research.creator_settings set allow_portrait=false returning creator_id)
select tests.assert((select count(*) from changed)=1,'admin retains settings mutation across owners');
insert into research.creator_settings(creator_id) values('00000000-0000-0000-0000-000000000002');
delete from research.creator_settings where creator_id='00000000-0000-0000-0000-000000000002';
reset role;
