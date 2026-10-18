-- Every fixture here is synthetic and exists only in an ephemeral test database.
select tests.assert(to_regclass('public.published_questions') is not null,
  'publication read model exists before exercising role policies');
select tests.assert(to_regclass('research.transcript_segments') is not null,
  'private exact-interval research schema exists');

insert into auth.users(id) values
('00000000-0000-0000-0000-000000000001'),('00000000-0000-0000-0000-000000000002'),
('00000000-0000-0000-0000-000000000003'),('00000000-0000-0000-0000-000000000004'),
('00000000-0000-0000-0000-000000000005'),('00000000-0000-0000-0000-000000000006');
insert into public.creator_staff(user_id,role) values
('00000000-0000-0000-0000-000000000003','reviewer'),
('00000000-0000-0000-0000-000000000004','creator'),
('00000000-0000-0000-0000-000000000005','admin'),('00000000-0000-0000-0000-000000000006','reviewer');
insert into public.profiles(id,nickname) values
('00000000-0000-0000-0000-000000000001','Member A'),
('00000000-0000-0000-0000-000000000002','Member B');
insert into research.sources(id,platform,canonical_url) values('test-source','youtube','https://example.invalid/test');
insert into research.recordings(id,independence_reference) values('recording-a','TEST ONLY original A'),('recording-b','TEST ONLY original B');
insert into research.videos(id,source_id,title,source_url,is_synthetic,recording_id,independence_verified) values
('AAAAAAAAAAA','test-source','TEST ONLY A','https://www.youtube.com/watch?v=AAAAAAAAAAA&t=0',false,'recording-a',true),
('BBBBBBBBBBB','test-source','TEST ONLY B','https://www.youtube.com/watch?v=BBBBBBBBBBB&t=0',false,'recording-b',true);
insert into research.source_checksums(video_id,source_sha256) values('AAAAAAAAAAA',repeat('a',64)),('BBBBBBBBBBB',repeat('b',64));
insert into research.video_caption_tracks(video_id,track_id,language,track_type) values
('AAAAAAAAAAA','track','en','manual'),('BBBBBBBBBBB','track','en','manual');
insert into research.transcript_versions(video_id,track_id,transcript_version,source_sha256) values
('AAAAAAAAAAA','track','v1',repeat('a',64)),('BBBBBBBBBBB','track','v1',repeat('b',64));
insert into research.transcript_segments(video_id,track_id,transcript_version,segment_id,start_ms,end_ms,text,speaker_id,speaker_role) values
('AAAAAAAAAAA','track','v1','short',10,11,'PRIVATE TEST TRANSCRIPT','speaker','creator'),
('AAAAAAAAAAA','track','v1','overlap',10,200,'PRIVATE OVERLAP','speaker','creator'),
('BBBBBBBBBBB','track','v1','s1',0,100,'PRIVATE SECOND VIDEO','speaker','creator');
insert into research.video_intervals(id,video_id,track_id,transcript_version,segment_id,start_ms,end_ms,source_sha256,speaker_id,speaker_role,evidence_confidence,evidence_confidence_status,source_url,instantaneous) values
('interval-a','AAAAAAAAAAA','track','v1','short',10,11,repeat('a',64),'speaker','creator',0.9,'reviewed','https://www.youtube.com/watch?v=AAAAAAAAAAA&t=0',true),
('interval-b','BBBBBBBBBBB','track','v1','s1',0,99,repeat('b',64),'speaker','creator',0.8,'reviewed','https://www.youtube.com/watch?v=BBBBBBBBBBB&t=0',false),
('interval-counter','AAAAAAAAAAA','track','v1','overlap',12,100,repeat('a',64),'speaker','creator',0.7,'reviewed','https://www.youtube.com/watch?v=AAAAAAAAAAA&t=0',false);
insert into research.discovery_runs(id,code_commit,config_hash,data_manifest_hash,corpus_snapshot,algorithm,is_synthetic) values
('run',repeat('1',40),repeat('c',64),repeat('d',64),'test-only','finite-state',false);
insert into research.discovery_run_sources(run_id,video_id,track_id,transcript_version,source_sha256,source_role) values
('run','AAAAAAAAAAA','track','v1',repeat('a',64),'corpus'),('run','BBBBBBBBBBB','track','v1',repeat('b',64),'control');
insert into research.motif_candidates(id,run_id,label_internal,definition,hypothesis,uncertainty,confounders) values
('candidate','run','TEST ONLY','Test recurrent transition','Falsifiable test hypothesis','Synthetic test fixture only','test');
insert into research.evidence_items(id,interval_id,excerpt,extraction_method,extraction_version,confidence,confidence_status) values
('evidence-a','interval-a','PRIVATE TEST TRANSCRIPT','rule','v1',0.9,'reviewed'),
('evidence-b','interval-b','PRIVATE SECOND VIDEO','rule','v1',0.8,'reviewed'),
('counter','interval-counter','PRIVATE OVERLAP','rule','v1',0.7,'reviewed');
select tests.denied($$insert into research.evidence_items(id,interval_id,excerpt,extraction_method,extraction_version,confidence,confidence_status) values('fabricated-excerpt','interval-a','INVENTED TEXT','rule','v1',0.9,'reviewed')$$,'evidence excerpt must occur exactly in its referenced transcript segment');
insert into research.candidate_evidence(candidate_id,evidence_id,kind) values
('candidate','evidence-a','support'),('candidate','evidence-b','support'),('candidate','counter','counterexample');
insert into research.hypotheses(id,candidate_id,statement,alternative_explanations) values('hypothesis','candidate','test','test alternatives');
insert into research.hypothesis_tests(id,hypothesis_id,test_kind,method,passed,report_checksum) values
('null','hypothesis','falsification','seeded-shuffle',true,repeat('e',64)),
('contrast','hypothesis','matched-contrast','matched video topic and duration',true,repeat('f',64));
insert into research.motif_candidates(id,run_id,label_internal,definition,hypothesis,uncertainty,confounders) values('lineage-child','run','TEST ONLY lineage child','Test derived finding','Test child hypothesis','Test uncertainty','Test confounders');
insert into research.candidate_lineage(parent_id,child_id) values('candidate','lineage-child');
insert into research.evidence_items(id,interval_id,excerpt,extraction_method,extraction_version,confidence,confidence_status) values('child-evidence-a','interval-a','PRIVATE TEST','rule','v1',0.9,'reviewed');
insert into research.candidate_evidence(candidate_id,evidence_id,kind) values('lineage-child','child-evidence-a','support'),('lineage-child','evidence-b','support'),('lineage-child','counter','counterexample');
insert into research.hypotheses(id,candidate_id,statement,alternative_explanations) values('child-hypothesis','lineage-child','Test child','Test child alternatives');
insert into research.hypothesis_tests(id,hypothesis_id,test_kind,method,passed,report_checksum) values('child-null','child-hypothesis','falsification','child-shuffle',true,repeat('e',64)),('child-contrast','child-hypothesis','matched-contrast','child matched contrast',true,repeat('f',64));
insert into research.questions(id,title) values('question','A safe reviewed question');
insert into research.learning_objectives(id,candidate_id,objective,assessment_rubric) values('objective','candidate','TEST ONLY objective','TEST ONLY rubric');
insert into research.draft_curriculum_units(id,objective_id,title,body,public_summary,exercise,uncertainty_statement) values('unit','objective','TEST ONLY unit','TEST ONLY','Test summary','TEST ONLY','Synthetic test fixture');
insert into research.source_unit_links(unit_id,evidence_id) values('unit','evidence-a'),('unit','evidence-b');
insert into research.question_publication_drafts(id,question_id,candidate_id,title,summary,source_url,video_id,start_ms,end_ms,speaker,confidence) values('published','question','candidate','A safe reviewed question','Safe summary without transcript text','https://www.youtube.com/watch?v=AAAAAAAAAAA&t=0','AAAAAAAAAAA',10,11,'speaker',0.9);
select tests.assert(not research.can_publish('candidate'),'metadata alone cannot publish without creator and independent reviews');

set role anon;
select set_config('request.jwt.claim.sub','',false);
select tests.assert((select count(*) from public.published_questions)=0,'anonymous public collection starts empty');
select tests.denied('select * from public.profiles','anonymous cannot read profiles');
select tests.denied('select text from research.transcript_segments','anonymous cannot read private transcripts');
select tests.denied('select * from public.get_editorial_queue()','anonymous cannot invoke editorial queue');
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
select tests.assert((select count(*) from public.profiles)=1,'member A sees only own profile');
select tests.assert((select count(*) from public.creator_staff)=0,'member has no trusted staff roles');
select tests.assert((select count(*) from research.transcript_segments)=0,'member cannot read transcripts even using SQL role');
select tests.assert((select count(*) from public.get_editorial_queue())=0,'member receives no editorial queue rows');
select tests.denied($$insert into public.creator_staff values(auth.uid(),'admin')$$,'member cannot self-provision staff');
select tests.denied($$insert into public.account_links(user_id,platform,handle,verification) values(auth.uid(),'tiktok','forged','oauth-verified')$$,'member cannot forge OAuth verification');
insert into public.account_links(user_id,platform,handle) values(auth.uid(),'tiktok','self-entered');
select tests.denied($$update public.account_links set verification='oauth-verified'$$,'member cannot upgrade own verification');
select tests.denied($$update public.profiles set id='00000000-0000-0000-0000-000000000002' where id=auth.uid()$$,'member cannot reassign profile ownership');
select tests.denied($$insert into public.member_preferences(user_id) values('00000000-0000-0000-0000-000000000002')$$,'member cannot insert another owner preferences');
insert into public.member_preferences(user_id,languages) values(auth.uid(),array['en']);
insert into public.consents(user_id,scope,granted) values(auth.uid(),'email',false);
select tests.denied($$insert into public.saved_questions(user_id,question_id) values(auth.uid(),'question')$$,'member cannot save an unpublished private research question');
insert into public.learning_notes(user_id,body) values(auth.uid(),'private note');
insert into public.community_questions(user_id,body) values(auth.uid(),'private question');
insert into public.privacy_requests(user_id,kind) values(auth.uid(),'export');
select tests.denied($$insert into public.quest_ledger(user_id,points,reason) values(auth.uid(),999,'forged')$$,'member cannot mint points');
select tests.denied($$insert into public.wallet_ledger(user_id,amount_minor,currency,reason) values(auth.uid(),999,'USD','forged')$$,'member cannot mint wallet credits');
with changed as (update public.profiles set nickname='forged' where id='00000000-0000-0000-0000-000000000002' returning id)
select tests.assert((select count(*) from changed)=0,'member cannot update another profile');
select tests.denied($$insert into public.published_questions(id,question_id,candidate_id,title,summary,source_url,video_id,start_ms,end_ms,speaker,confidence,reviewed_at,creator_approved_at) values('forged','question','candidate','Title','Summary','https://www.youtube.com/watch?v=AAAAAAAAAAA&t=0','AAAAAAAAAAA',10,11,'speaker',0.9,now(),now())$$,'member cannot fabricate a publication');
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',false);
select tests.assert((select count(*) from public.account_links)=0,'member B cannot see member A account links');
select tests.assert((select count(*) from public.learning_notes)=0,'member B cannot see member A notes');
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
select tests.assert((select count(*) from research.transcript_segments)=3,'reviewer can inspect source evidence');
select tests.assert((select count(*) from public.creator_staff)=1,'reviewer sees only own role');
select tests.assert((select count(*) from public.get_editorial_queue())=2,'reviewer safe queue returns research status without transcript text');
select tests.denied($$insert into research.creator_approvals(candidate_id,creator_id) values('candidate',auth.uid())$$,'reviewer cannot impersonate creator approval');
select tests.denied($$insert into research.review_decisions(candidate_id,review_kind,decision,reviewer_id) values('candidate','evidence','accepted','00000000-0000-0000-0000-000000000004')$$,'reviewer cannot attribute decision to another identity');
insert into research.review_decisions(candidate_id,review_kind,decision,reviewer_id) values
('candidate','evidence','accepted',auth.uid()),('candidate','falsification','accepted',auth.uid()),('candidate','contrast','accepted',auth.uid());
insert into research.review_decisions(candidate_id,review_kind,decision,reviewer_id) values('lineage-child','evidence','accepted',auth.uid()),('lineage-child','falsification','accepted',auth.uid()),('lineage-child','contrast','accepted',auth.uid());
insert into research.editorial_reviews(unit_id,reviewer_id,decision,rationale) values('unit',auth.uid(),'accepted','Test fixture review only');
insert into research.question_publication_reviews(publication_id,reviewer_id,decision) values('published',auth.uid(),'accepted');
select tests.denied($$insert into research.source_permissions(video_id,scope,approved_by) values('AAAAAAAAAAA','public-excerpt',auth.uid())$$,'reviewer cannot grant creator source permission');
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000004',false);
select tests.denied($$insert into research.review_decisions(candidate_id,review_kind,decision,reviewer_id) values('candidate','evidence','accepted',auth.uid())$$,'creator cannot supply independent editorial review');
insert into research.creator_approvals(candidate_id,creator_id,authorization_reference) values('candidate',auth.uid(),'TEST ONLY authorization');
insert into research.creator_approvals(candidate_id,creator_id,authorization_reference) values('lineage-child',auth.uid(),'TEST ONLY authorization');
insert into research.unit_creator_approvals(unit_id,creator_id,authorization_reference) values('unit',auth.uid(),'TEST ONLY authorization');
insert into research.question_creator_approvals(publication_id,creator_id,authorization_reference) values('published',auth.uid(),'TEST ONLY authorization');
select tests.denied($$insert into research.source_permissions(video_id,scope,approved_by,authorization_reference) values('AAAAAAAAAAA','private-research',auth.uid(),'')$$,'source permission requires a written authorization reference');
insert into research.source_permissions(video_id,scope,approved_by,authorization_reference) values
('AAAAAAAAAAA','public-excerpt',auth.uid(),'TEST ONLY authorization'),('BBBBBBBBBBB','public-excerpt',auth.uid(),'TEST ONLY authorization');
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000005',false);
select tests.assert((select count(*) from research.transcript_segments)=3,'admin can inspect source evidence');
select tests.denied($$insert into research.review_decisions(candidate_id,review_kind,decision,reviewer_id) values('candidate','theology','accepted','00000000-0000-0000-0000-000000000004')$$,'admin cannot impersonate another review actor');
select tests.denied($$insert into research.video_intervals(id,video_id,track_id,transcript_version,segment_id,start_ms,end_ms,source_sha256,speaker_id,speaker_role,evidence_confidence,evidence_confidence_status,source_url,instantaneous) values('bad','AAAAAAAAAAA','track','v1','short',10,12,repeat('a',64),'speaker','creator',0.9,'reviewed','https://www.youtube.com/watch?v=AAAAAAAAAAA&t=0',true)$$,'instantaneous intervals must be exactly 1 ms and within segment');
select tests.assert(research.can_publish('candidate'),'relational real two-video reviewed contrast/falsification pack becomes eligible');
select tests.assert(research.can_publish('lineage-child'),'derived candidate is eligible while parent input pack remains approved');
delete from research.source_unit_links where unit_id='unit';
select tests.assert(not research.can_publish_unit('unit'),'unit without two linked evidence sources stays blocked');
insert into research.source_unit_links(unit_id,evidence_id) values('unit','evidence-a'),('unit','evidence-b');
select tests.assert(research.can_publish_unit('unit'),'separately reviewed and creator-approved two-source curriculum unit passes gate');
insert into public.published_questions(id,question_id,candidate_id,title,summary,source_url,video_id,start_ms,end_ms,speaker,confidence,reviewed_at,creator_approved_at) values
('published','question','candidate','A safe reviewed question','Safe summary without transcript text','https://www.youtube.com/watch?v=AAAAAAAAAAA&t=0','AAAAAAAAAAA',10,11,'speaker',0.9,(select reviewed_at from research.question_publication_reviews where publication_id='published'),(select approved_at from research.question_creator_approvals where publication_id='published'));
insert into public.approved_curriculum_units(id,title,summary,objective) values('unit','TEST ONLY unit','Test summary','TEST ONLY objective');
select tests.denied($$update public.published_questions set source_url='https://evil.invalid/' where id='published'$$,'public source URL must match canonical YouTube video and timestamp');
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
select tests.denied($$update public.published_questions set summary='PRIVATE TEST TRANSCRIPT',confidence=1,reviewed_at='2099-01-01' where id='published'$$,'reviewer cannot replace creator-approved publication payload');
select tests.denied($$update public.approved_curriculum_units set objective='Entirely unreviewed method' where id='unit'$$,'reviewer cannot replace creator-approved curriculum wording');
reset role;
update research.draft_curriculum_units set body='Edited after approval' where id='unit';
select tests.assert(not research.can_publish_unit('unit'),'changing reviewed unit draft invalidates content snapshot');
update research.draft_curriculum_units set body='TEST ONLY' where id='unit';
update research.learning_objectives set objective='Edited after approval' where id='objective';
select tests.assert(not research.can_publish_unit('unit'),'changing reviewed learning objective invalidates content snapshot');
update research.learning_objectives set objective='TEST ONLY objective' where id='objective';
insert into research.editorial_reviews(unit_id,reviewer_id,decision,rationale) values('unit','00000000-0000-0000-0000-000000000006','rejected','TEST ONLY blocking second review');
select tests.assert(not research.can_publish_unit('unit'),'current rejecting unit review blocks older accepted review');
delete from research.editorial_reviews where rationale='TEST ONLY blocking second review';
update research.evidence_items set excerpt='PRIVATE TEST' where id='evidence-a';
select tests.assert(not research.can_publish('candidate'),'changing evidence excerpt invalidates existing reviewer and creator snapshots');
select tests.assert(not research.can_publish('lineage-child'),'changing parent-only evidence invalidates derived candidate snapshots');
update research.evidence_items set excerpt='PRIVATE TEST TRANSCRIPT' where id='evidence-a';
update research.hypothesis_tests set method='Unreviewed replacement control' where id='null';
select tests.assert(not research.can_publish('candidate'),'changing hypothesis control invalidates existing reviewer and creator snapshots');
select tests.assert(not research.can_publish('lineage-child'),'changing parent-only hypothesis control invalidates derived candidates');
update research.hypothesis_tests set method='seeded-shuffle' where id='null';
update research.question_publication_drafts set summary='New separately reviewed safe wording' where id='published';
update research.question_publication_reviews set decision='accepted' where publication_id='published';
update research.question_creator_approvals set authorization_reference='TEST ONLY reapproval' where publication_id='published';
set role anon;
select tests.assert((select count(*) from public.published_questions)=0,'reapproving changed draft cannot expose an older unmatched public payload');
reset role;
update research.question_publication_drafts set summary='Safe summary without transcript text' where id='published';
update research.question_publication_reviews set decision='accepted' where publication_id='published';
update research.question_creator_approvals set authorization_reference='TEST ONLY authorization' where publication_id='published';
update public.published_questions set reviewed_at=(select reviewed_at from research.question_publication_reviews where publication_id='published'),creator_approved_at=(select approved_at from research.question_creator_approvals where publication_id='published') where id='published';
update research.draft_curriculum_units set public_summary='Separately reviewed replacement summary' where id='unit';
update research.editorial_reviews set rationale='TEST ONLY new review' where unit_id='unit';
update research.unit_creator_approvals set authorization_reference='TEST ONLY reapproval' where unit_id='unit';
set role anon;
select tests.assert((select count(*) from public.approved_curriculum_units)=0,'unit reapproval cannot expose an older unmatched public unit');
reset role;
update research.draft_curriculum_units set public_summary='Test summary' where id='unit';
update research.editorial_reviews set rationale='Test fixture review only' where unit_id='unit';
update research.unit_creator_approvals set authorization_reference='TEST ONLY authorization' where unit_id='unit';
update public.approved_curriculum_units set summary='Test summary' where id='unit';

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000004',false);
update research.question_creator_approvals set authorization_reference='TEST ONLY creator renewal' where publication_id='published';
delete from research.question_creator_approvals where publication_id='published';
select tests.assert(not research.can_publish_question('published'),'creator can revoke own public wording approval');
insert into research.question_creator_approvals(publication_id,creator_id,authorization_reference) values('published',auth.uid(),'TEST ONLY renewed consent');
select tests.assert(research.can_publish_question('published'),'creator can renew own wording approval after fresh review');
select tests.assert((select count(*) from public.published_questions)=0,'renewed creator authorization requires exact republish before public visibility');
delete from research.creator_approvals where candidate_id='candidate';
select tests.assert(not research.can_publish('candidate'),'creator can revoke own candidate approval');
select tests.assert(not research.can_publish('lineage-child'),'parent creator withdrawal blocks derived candidate without changing its input snapshot');
insert into research.creator_approvals(candidate_id,creator_id,authorization_reference) values('candidate',auth.uid(),'TEST ONLY authorization');
delete from research.unit_creator_approvals where unit_id='unit';
select tests.assert(not research.can_publish_unit('unit'),'creator can revoke own curriculum approval');
insert into research.unit_creator_approvals(unit_id,creator_id,authorization_reference) values('unit',auth.uid(),'TEST ONLY authorization');
reset role;
update public.published_questions set reviewed_at=(select reviewed_at from research.question_publication_reviews where publication_id='published'),creator_approved_at=(select approved_at from research.question_creator_approvals where publication_id='published') where id='published';
update public.approved_curriculum_units set summary='Test summary' where id='unit';
update research.review_decisions set decision='rejected' where candidate_id='candidate' and review_kind='evidence';
select tests.assert(not research.can_publish('lineage-child'),'parent review rejection blocks derived candidate without changing input snapshot');
update research.review_decisions set decision='accepted' where candidate_id='candidate' and review_kind='evidence';

set role anon;
select set_config('request.jwt.claim.sub','',false);
select tests.assert((select count(*) from public.published_questions)=1,'anonymous sees approved safe publication');
select tests.assert((select count(*) from public.approved_curriculum_units)=1,'anonymous sees independently approved curriculum unit');
select tests.assert((select count(*) from public.published_questions where search_document @@ websearch_to_tsquery('simple','reviewed'))=1,'database full-text search finds approved result');
select tests.denied('select excerpt from research.evidence_items','public publication never opens transcript evidence');
reset role;

set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',false);
insert into public.saved_questions(user_id,question_id) values(auth.uid(),'published');
update public.learning_notes set unit_id='unit' where user_id=auth.uid();
reset role;

update research.motif_candidates set stale=true where id='candidate';
set role anon;
select tests.assert((select count(*) from public.published_questions)=0,'stale source lineage immediately hides publication');
select tests.assert((select count(*) from public.approved_curriculum_units)=0,'stale source lineage immediately hides curriculum');
reset role;
set role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000003',false);
select tests.assert((select count(*) from public.published_questions)=0,'reviewer SELECT cannot bypass live publication gate');
reset role;
update research.motif_candidates set stale=false where id='candidate';
update research.videos set is_synthetic=true where id='BBBBBBBBBBB';
select tests.assert(not research.can_publish('candidate'),'synthetic evidence cannot satisfy cross-video support');
update research.videos set is_synthetic=false where id='BBBBBBBBBBB';
delete from research.source_permissions where video_id='BBBBBBBBBBB';
select tests.assert(not research.can_publish('candidate'),'rights revocation invalidates publication');
insert into research.source_permissions(video_id,scope,approved_by,authorization_reference) values('BBBBBBBBBBB','public-excerpt','00000000-0000-0000-0000-000000000004','TEST ONLY authorization');
update research.videos set recording_id='recording-a' where id='BBBBBBBBBBB';
select tests.assert(not research.can_publish('candidate'),'two clips of one original recording do not count as independent corroboration');
update research.videos set recording_id='recording-b',independence_verified=false where id='BBBBBBBBBBB';
select tests.assert(not research.can_publish('candidate'),'unverified recording independence blocks corroboration');
update research.videos set independence_verified=true where id='BBBBBBBBBBB';
update research.hypothesis_tests set passed=false where id='null';
select tests.assert(not research.can_publish('candidate'),'failed falsification blocks publication despite review flags');
update research.hypothesis_tests set passed=true where id='null';
update research.evidence_items set confidence=null,confidence_status='unassessed' where id='evidence-a';
select tests.assert(not research.can_publish('candidate'),'unassessed evidence confidence cannot be replaced by speaker confidence');
update research.evidence_items set confidence=0.9,confidence_status='reviewed' where id='evidence-a';
delete from research.candidate_evidence where kind='counterexample';
select tests.assert(not research.can_publish('candidate'),'missing counterexample blocks publication');
insert into research.candidate_evidence values('candidate','counter','counterexample');
update research.motif_candidates set requires_scholarly_review=true where id='candidate';
select tests.assert(not research.can_publish('candidate'),'theological candidate requires qualified scholarly review');
update research.motif_candidates set requires_scholarly_review=false where id='candidate';
select tests.denied($$update research.transcript_segments set text='rewritten' where segment_id='short'$$,'source segments require new versions instead of in-place corrections');
insert into research.motif_candidates(id,run_id,label_internal,definition,hypothesis,uncertainty,confounders) values('child','run','TEST ONLY child','Test','Test','Test','Test');
insert into research.candidate_lineage(parent_id,child_id) values('candidate','child');
select tests.denied($$insert into research.candidate_lineage(parent_id,child_id) values('child','candidate')$$,'candidate lineage cannot contain a cycle');
insert into research.source_checksums(video_id,source_sha256) values('AAAAAAAAAAA',repeat('0',64));
insert into research.transcript_versions(video_id,track_id,transcript_version,source_sha256) values('AAAAAAAAAAA','track','v2',repeat('0',64));
select tests.assert((select stale from research.motif_candidates where id='candidate'),'new source checksum makes direct candidate stale');
select tests.assert((select stale from research.motif_candidates where id='child'),'source correction propagates staleness through lineage DAG');
update research.motif_candidates set stale=false;
select tests.assert(not research.can_publish('candidate'),'clearing stale flag cannot resurrect superseded source hash approvals');
delete from research.candidate_evidence where evidence_id='evidence-b';
insert into research.source_checksums(video_id,source_sha256) values('BBBBBBBBBBB',repeat('9',64));
insert into research.transcript_versions(video_id,track_id,transcript_version,source_sha256) values('BBBBBBBBBBB','track','v2',repeat('9',64));
select tests.assert((select stale from research.motif_candidates where id='candidate'),'correction of run control input marks candidate stale without selected evidence link');

insert into public.learning_progress(user_id,unit_id) values('00000000-0000-0000-0000-000000000001',null);
insert into public.practice_attempts(user_id,scenario_reference) values('00000000-0000-0000-0000-000000000001','test-only');
insert into public.participation_events(user_id,kind) values('00000000-0000-0000-0000-000000000001','manual-check-in');
insert into public.quest_ledger(user_id,points,reason) values('00000000-0000-0000-0000-000000000001',5,'test-only');
insert into public.wallet_ledger(user_id,amount_minor,currency,reason) values('00000000-0000-0000-0000-000000000001',1,'USD','test-only');
delete from public.published_questions where id='published';
select tests.assert((select count(*) from public.saved_questions)=0,'withdrawing publication removes saved-question references');
delete from public.approved_curriculum_units where id='unit';
select tests.assert((select count(*) from public.learning_notes where unit_id is not null)=0,'withdrawing curriculum preserves notes without blocking deletion');
delete from auth.users where id='00000000-0000-0000-0000-000000000001';
do $$ declare t text; n bigint; begin
  foreach t in array array['profiles','member_preferences','consents','account_links','privacy_requests','saved_questions','learning_notes','learning_progress','practice_attempts','community_questions','participation_events','quest_ledger','wallet_ledger'] loop
    execute format('select count(*) from public.%I where %I=$1',t,case when t='profiles' then 'id' else 'user_id' end) into n using '00000000-0000-0000-0000-000000000001'::uuid;
    perform tests.assert(n=0,'auth deletion cascades to '||t);
  end loop;
end $$;
select tests.assert(not exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname in('public','research') and c.relkind='r' and not c.relrowsecurity),'all public and research tables enable RLS');
select tests.assert((select count(*) from storage.buckets where public)=0,'research storage buckets stay private');
