import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// A separate v4 archive. Earlier evidence-first/recovery artifacts stay immutable.
const phase = process.env.CAPTURE_PHASE || 'before';
if (!['before', 'after'].includes(phase)) throw new Error('Invalid phase');
const output = `docs/screenshots/v4/${phase}`;
if (existsSync(join(output, 'manifest.json'))) throw new Error('Archive already exists; choose another phase instead of overwriting evidence');
const baseURL = process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:3600';
const widths = [360, 390, 768, 1280, 1440];
const routes = [
 ['home','/'],['explore','/explore'],['learn','/learn'],['practice','/practice'],['community','/community'],['my-corner','/me'],['about','/about'],['creator','/studio/creator'],['studio','/studio'],['source','/watch'],['archive','/afterglow/vault'],['session-notes','/session-notes'],['join','/join'],['onboarding','/onboarding'],['library','/library'],['book-preview','/library/preview'],['settings','/me/settings'],['journal','/me/journal'],['support','/support'],['faq','/faq'],['privacy','/privacy'],['terms','/terms'],['new-muslims','/reverts'],
];
const legacy = ['/discover','/atlas','/dojo','/dojo/path','/dojo/result','/events','/afterglow','/afterglow/before','/afterglow/live','/afterglow/gallery','/me/quests','/me/afterglow','/me/constellation','/membership','/stories'];
await mkdir(output, {recursive:true});
const artifacts = [], records = [], interactionChecks = [], issues = [];
const browser = await chromium.launch({executablePath:process.env.PW_CHROMIUM || '/usr/bin/chromium'});
const sha = value => createHash('sha256').update(value).digest('hex');
const sourceHashes = {};
async function sourceFiles(directory) { const files=[]; for (const item of await readdir(directory,{withFileTypes:true})) { const path=join(directory,item.name); if(item.isDirectory()) files.push(...await sourceFiles(path)); else files.push(path); } return files; }
const trackedSources = ['package-lock.json','scripts/capture-v4.mjs',...await sourceFiles('src'),...await sourceFiles('public/brand')];
for (const file of trackedSources) sourceHashes[file] = sha(await readFile(file));
const productionBuildId = existsSync('.next/BUILD_ID') ? (await readFile('.next/BUILD_ID','utf8')).trim() : null;
async function screenshot(page, name, fullPage=true) { const file = `${name}.jpg`; await page.screenshot({path:join(output,file),fullPage,type:'jpeg',quality:78,animations:'disabled'}); artifacts.push(file); }
async function settle(page) { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(100); }
try {
 for (const width of widths) {
  const height = width < 768 ? 844 : width < 1280 ? 1024 : 900;
  const context = await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  // Captures never send email, verify a code, mutate an account, or contact an external service.
  await context.route('**/auth/request', route => route.fulfill({status:409,contentType:'text/plain',body:'Browser audit: email delivery intentionally intercepted.'}));
  await context.route('**/auth/verify', route => route.fulfill({status:409,contentType:'text/plain',body:'Browser audit: verification intentionally intercepted.'}));
  const page = await context.newPage();
  page.on('pageerror', error => issues.push({width,type:'pageerror',url:page.url(),message:error.message}));
  page.on('console', message => {if(message.type()==='error') issues.push({width,type:'console',url:page.url(),message:message.text()});});
  for (const [name,route] of routes) {
   const response = await page.goto(baseURL+route); await settle(page);
   // Traverse the full narrative before capture, allowing lazy images to decode.
   await page.evaluate(async()=> {for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight) {scrollTo({top:y,left:0,behavior:'instant'});await new Promise(r=>setTimeout(r,10));} await Promise.all([...document.images].map(image=>image.decode().catch(()=>null)));scrollTo({top:0,left:0,behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
   await screenshot(page,`${name}-${width}-full`);
   await page.evaluate(async()=>{scrollTo({top:0,left:0,behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
   if(await page.evaluate(()=>scrollY)!==0) throw new Error('First-fold scroll did not settle');
   await screenshot(page,`${name}-${width}-fold`,false);
   const audit = await page.evaluate(()=> {
    const norm = value => (value || '').replace(/\s+/g,' ').trim();
    const visible = el => Boolean(el.getClientRects().length) && !el.closest('[aria-hidden="true"]') && getComputedStyle(el).visibility!=='hidden';
    const box = el => {const r=el.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y+scrollY),width:Math.round(r.width),height:Math.round(r.height)};};
    const actions = [...document.querySelectorAll('a,button,summary,input[type=submit],input[type=checkbox],input[type=radio],[role=button]')].filter(visible).map(el=> ({tag:el.tagName.toLowerCase(),label:norm(el.getAttribute('aria-label')||el.innerText||(el.labels ? [...el.labels].map(label=>label.textContent).join(' ') : '')||el.value),href:el.getAttribute('href'),disabled:el.matches(':disabled,[aria-disabled=true]'),kind:el.tagName==='A'?'navigation':el.tagName==='SUMMARY'?'disclosure':el.matches('input[type=checkbox],input[type=radio]')?'selection':el.matches('button[type=submit],input[type=submit]')?'submission':'transient',main:!!el.closest('main'),region:el.closest('nav')?.getAttribute('aria-label')|| (el.closest('footer')?'footer':el.closest('main')?'main':'global'),...box(el)}));
    const summarize = rows => {const targets=new Map();for(const action of rows){const key=action.href||`${action.kind}:${action.label}`;targets.set(key,[...(targets.get(key)||[]),action.label]);}return {instances:rows.length,unique:targets.size,repeated:rows.length-targets.size,disabled:rows.filter(a=>a.disabled).length,transient:rows.filter(a=>['transient','disclosure','selection'].includes(a.kind)).length,repeatedDestinations:[...targets].filter(([,labels])=>labels.length>1).map(([destination,labels])=>({destination,labels}))};};
    return {title:document.title,pageHeight:document.documentElement.scrollHeight,horizontalOverflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),viewport:{width:innerWidth,height:innerHeight},headings:[...document.querySelectorAll('main h1,main h2,main h3')].filter(visible).map(el=>({text:norm(el.innerText),fold:Math.floor((el.getBoundingClientRect().top+scrollY)/innerHeight)+1,...box(el)})),sections:[...document.querySelectorAll('main section')].filter(visible).map(el=>({label:el.getAttribute('aria-labelledby')||norm(el.querySelector('h1,h2,h3')?.textContent),...box(el)})),images:[...document.images].filter(visible).map(el=>({src:el.getAttribute('src'),alt:el.alt,naturalWidth:el.naturalWidth,complete:el.complete,...box(el)})),actions,counts:{main:summarize(actions.filter(a=>a.main)),all:summarize(actions),navigation:summarize(actions.filter(a=>a.main&&a.kind==='navigation')),transient:summarize(actions.filter(a=>a.main&&['transient','disclosure','selection'].includes(a.kind)))},smallTargets:actions.filter(a=>a.width<44||a.height<44)};
   });
   records.push({name,route,finalPath:new URL(page.url()).pathname,status:response?.status(),width,...audit});
   if(name==='home') for(const [i,section] of audit.sections.entries()) {await page.evaluate(async y=>{scrollTo({top:Math.max(0,y-86),left:0,behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},section.y);await screenshot(page,`home-${width}-section-${i+1}`,false);}
  }
  if([390,1440].includes(width)) {
   await page.goto(baseURL+'/'); await settle(page);
   const header = page.locator('header').first();
   if(width<1024){await page.getByRole('button',{name:'Open menu',exact:true}).click();await screenshot(page,`navigation-${width}-open`,false);const links=await page.getByRole('dialog').locator('a').evaluateAll(els=>els.map(a=>({href:a.getAttribute('href'),label:a.textContent.trim()})));await page.keyboard.press('Escape');interactionChecks.push({width,check:'mobile menu Escape',passed:await page.getByRole('dialog').count()===0});for(const link of links){await page.getByRole('button',{name:'Open menu',exact:true}).click();await page.getByRole('dialog').locator(`a[href="${link.href}"]`).first().click();await page.waitForURL(url=>url.pathname===new URL(link.href,baseURL).pathname);await settle(page);interactionChecks.push({width,check:'menu navigation',label:link.label,href:link.href,finalPath:new URL(page.url()).pathname});}}
   else {const links=await header.locator('nav a').evaluateAll(els=>els.map(a=>({href:a.getAttribute('href'),label:a.textContent.trim()})));for(const link of links){await header.locator(`a[href="${link.href}"]`).first().click();await page.waitForURL(url=>url.pathname===new URL(link.href,baseURL).pathname);await settle(page);interactionChecks.push({width,check:'desktop navigation',...link,finalPath:new URL(page.url()).pathname});}}
   await page.goto(baseURL+'/');await settle(page);
   const summaries=page.locator('main summary');for(let i=0;i<await summaries.count();i++){await summaries.nth(i).click();interactionChecks.push({width,check:'source disclosure',index:i,open:await summaries.nth(i).evaluate(el=>el.parentElement.open)});}await screenshot(page,`disclosures-${width}-open`);
   const desk=page.locator('#question-desk');await desk.getByRole('textbox',{name:'Your question',exact:true}).fill('QA visitor draft: How can I listen carefully?');await desk.getByRole('textbox',{name:'Your reflection',exact:true}).fill('QA visitor reflection: Leave a pause before replying.');await screenshot(page,`question-desk-${width}-editing`);
   await desk.getByRole('button',{name:'Review draft',exact:true}).click();interactionChecks.push({width,check:'question review',passed:await desk.getByRole('group',{name:'Your draft'}).innerText().then(t=>t.includes('QA visitor draft: How can I listen carefully?'))});await screenshot(page,`question-desk-${width}-review`);
   await desk.getByRole('button',{name:'Copy draft',exact:true}).click();await desk.getByRole('status').filter({hasText:/Draft copied|Couldn.t copy/}).waitFor();interactionChecks.push({width,check:'question copy status',status:await desk.getByRole('status').innerText()});await desk.getByRole('button',{name:'Clear draft',exact:true}).click();interactionChecks.push({width,check:'question clear',passed:await desk.getByRole('textbox',{name:'Your question',exact:true}).inputValue()===''});await screenshot(page,`question-desk-${width}-cleared`);
   await page.goto(baseURL+'/join');await settle(page);const email=page.locator('#sign-in-email');if(await email.count()){await email.fill('audit@example.invalid');await page.getByRole('button',{name:'Send sign-in email',exact:true}).click();interactionChecks.push({width,check:'safe sign-in submission',intercepted:true,status:'No email sent; intercepted before server.'});}else interactionChecks.push({width,check:'safe sign-in attempt',blocked:true,text:await page.locator('main').innerText()});await screenshot(page,`signup-${width}-attempt`);
   await page.goto(baseURL+'/');await settle(page);const keyboard=[];for(let i=0;i<18;i++){await page.keyboard.press('Tab');keyboard.push(await page.evaluate(()=>({tag:document.activeElement?.tagName,label:document.activeElement?.getAttribute('aria-label')||document.activeElement?.textContent?.trim(),href:document.activeElement?.getAttribute('href')})));if(i===0)await screenshot(page,`keyboard-${width}-skip-focus`,false);}interactionChecks.push({width,check:'keyboard traversal',steps:keyboard});
   await page.emulateMedia({reducedMotion:'reduce'});await page.goto(baseURL+'/');await settle(page);interactionChecks.push({width,check:'reduced motion',media:await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),animations:await page.evaluate(()=>document.getAnimations().map(a=>({duration:a.effect?.getComputedTiming().duration,iterations:a.effect?.getComputedTiming().iterations})))});await screenshot(page,`home-${width}-reduced-motion`);
   if (phase === 'after') {
    await page.emulateMedia({reducedMotion:'no-preference'});
    await context.grantPermissions(['clipboard-read','clipboard-write'], {origin:baseURL});
    const writes=[]; const recordWrite=request=>{if(!['GET','HEAD','OPTIONS'].includes(request.method())) writes.push({method:request.method(),url:request.url()});}; page.on('request',recordWrite);
    const elementShot=async(locator,name)=>{const file=`${name}-${width}.jpg`;await locator.screenshot({path:join(output,file),type:'jpeg',quality:82,animations:'disabled'});artifacts.push(file);};
    await page.goto(baseURL+'/');await settle(page);
    const journey=page.getByTestId('question-journey');
    await journey.getByRole('textbox',{name:'A question to carry with you',exact:true}).fill('QA visitor question: How can I understand another person fairly?');
    for(const [index,label] of ['Question','Source','Related','Notes'].entries()) {
     await journey.locator('.journey-steps button').nth(index).click();
     if(label==='Related') {await journey.getByRole('button',{name:'Dialogue',exact:true}).click();interactionChecks.push({width,check:'journey topic selection',pressed:await journey.getByRole('button',{name:'Dialogue',exact:true}).getAttribute('aria-pressed')});}
     interactionChecks.push({width,check:'journey step',label,pressed:await journey.locator('.journey-steps button').nth(index).getAttribute('aria-pressed'),panel:await journey.locator('#journey-panel').innerText()});
     await elementShot(journey,`journey-${index+1}-${label.toLowerCase()}`);
    }
    interactionChecks.push({width,check:'journey does not silently transfer to desk',empty:await page.locator('#desk-question').inputValue()===''});
    await journey.locator('.journey-steps button').first().click();interactionChecks.push({width,check:'journey question retained across steps',value:await journey.getByRole('textbox',{name:'A question to carry with you',exact:true}).inputValue()});
    await page.reload();await settle(page);interactionChecks.push({width,check:'journey clears on refresh',empty:await page.locator('#journey-question').inputValue()===''});
    await page.goto(baseURL+'/practice');await settle(page);
    const workbench=page.getByTestId('practice-workbench'); const storageBefore=await page.evaluate(()=>Object.keys(localStorage));
    for(const label of ['Listen','Clarify','Rephrase','Reflect']) {await workbench.getByRole('button',{name:label,exact:true}).click();interactionChecks.push({width,check:'practice prompt',label,pressed:await workbench.getByRole('button',{name:label,exact:true}).getAttribute('aria-pressed'),description:await workbench.locator('#practice-prompt-description').innerText()});}
    await workbench.getByRole('textbox',{name:'Your practice draft',exact:true}).fill('QA visitor practice: I can pause, check the context and ask a fair question.');
    for(const checkbox of await workbench.getByRole('checkbox').all()) await checkbox.check();
    await elementShot(workbench,'practice-editing-self-checks');
    await workbench.getByRole('button',{name:'Review my words',exact:true}).click();interactionChecks.push({width,check:'practice review',text:await workbench.locator('.practice-review').innerText(),checked:await workbench.getByRole('checkbox').evaluateAll(els=>els.map(e=>e.checked)),focused:await workbench.locator('.practice-review h3').evaluate(el=>el===document.activeElement)});await elementShot(workbench,'practice-reviewed');
    await workbench.getByRole('button',{name:'Copy my practice',exact:true}).click();await workbench.getByRole('status').filter({hasText:'Practice copied.'}).waitFor();interactionChecks.push({width,check:'practice copy readback',status:await workbench.getByRole('status').innerText(),clipboard:await page.evaluate(()=>navigator.clipboard.readText())});await elementShot(workbench,'practice-copied');
    await page.evaluate(()=>Object.defineProperty(navigator.clipboard,'writeText',{configurable:true,value:async()=>{throw new Error('QA simulated clipboard denial');}}));
    await workbench.getByRole('button',{name:'Copy my practice',exact:true}).click();await workbench.getByRole('status').filter({hasText:"Couldn't copy your practice."}).waitFor();interactionChecks.push({width,check:'practice clipboard failure preserves words',status:await workbench.getByRole('status').innerText(),draft:await workbench.locator('.practice-draft').innerText()});await elementShot(workbench,'practice-copy-denied');
    await workbench.getByRole('button',{name:'Edit my words',exact:true}).click();interactionChecks.push({width,check:'practice edit preserves exact draft',value:await workbench.getByRole('textbox',{name:'Your practice draft',exact:true}).inputValue()});
    await workbench.getByRole('button',{name:'Clear practice',exact:true}).click();interactionChecks.push({width,check:'practice clear',value:await workbench.getByRole('textbox',{name:'Your practice draft',exact:true}).inputValue(),checked:await workbench.getByRole('checkbox').evaluateAll(els=>els.map(e=>e.checked)),status:await workbench.getByRole('status').innerText(),storageBefore,storageAfter:await page.evaluate(()=>Object.keys(localStorage))});await elementShot(workbench,'practice-cleared');
    await workbench.getByRole('textbox',{name:'Your practice draft',exact:true}).fill('QA ephemeral refresh check');await page.reload();await settle(page);interactionChecks.push({width,check:'practice refresh clears draft',empty:await page.locator('#practice-draft').inputValue()===''});
    page.off('request',recordWrite);interactionChecks.push({width,check:'journey/practice network writes',writes});
    await page.goto(baseURL+'/faq');await settle(page);const faq=page.locator('main summary');for(let i=0;i<await faq.count();i++){await faq.nth(i).click();interactionChecks.push({width,check:'FAQ disclosure',label:await faq.nth(i).innerText(),open:await faq.nth(i).evaluate(el=>el.parentElement.open)});}await screenshot(page,`faq-${width}-expanded`);
    if(width===390){await page.goto(baseURL+'/');const quick=page.getByRole('navigation',{name:'Quick navigation',exact:true});const links=await quick.locator('a').evaluateAll(els=>els.map(a=>({href:a.getAttribute('href'),label:a.textContent})));for(const link of links){await quick.locator(`a[href="${link.href}"]`).click();await page.waitForURL(url=>url.pathname===link.href);interactionChecks.push({width,check:'quick navigation settled',...link,finalPath:new URL(page.url()).pathname});}}
    await page.goto(baseURL+'/');await page.keyboard.press('Tab');await page.keyboard.press('Enter');await page.waitForTimeout(100);await page.keyboard.press('Tab');interactionChecks.push({width,check:'skip content next Tab',hash:new URL(page.url()).hash,focus:await page.evaluate(()=>({tag:document.activeElement?.tagName,label:document.activeElement?.getAttribute('aria-label')||document.activeElement?.textContent,href:document.activeElement?.getAttribute('href')}))});
   }

  }
  if(width===390) for(const route of legacy){const response=await page.goto(baseURL+route);interactionChecks.push({width,check:'legacy route',route,finalPath:new URL(page.url()).pathname,status:response?.status()});}
  await context.close();console.log(`Completed full pages and route audit at ${width}px`);
 }
 for (const file of trackedSources) if (sourceHashes[file] !== sha(await readFile(file))) throw new Error(`Source changed during capture: ${file}`);
 const json = {phase,capturedAt:new Date().toISOString(),records,interactionChecks,issues};
 await writeFile(join(output,'rendered-audit.json'),JSON.stringify(json,null,2)+'\n');artifacts.push('rendered-audit.json');
 const manifest={phase,capturedAt:new Date().toISOString(),baseURL,sourceCommit:process.env.CAPTURE_COMMIT||null,sourceState:process.env.CAPTURE_SOURCE_STATE || 'Unspecified; source hashes identify captured tree',productionBuildId,sourceHashes,browser:await browser.version(),widths,routes,methodology:'Fresh browser contexts; actual Chromium production rendering. All core routes captured both full-page and first fold at five widths. Full scroll and image decode before captures. Navigation clicked, source details expanded, question draft review/copy/clear tested, sign-in attempted safely with auth submission interception, keyboard and reduced-motion checked. Generic QA input is visitor-owned test text, never creator material. Local unconfigured auth cannot prove hosted lifecycle.',files:[]};
 for(const file of artifacts)manifest.files.push({file,sha256:sha(await readFile(join(output,file)))});
 await writeFile(join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(`Saved ${artifacts.length} artifacts, ${records.length} route/width records.`);
}finally{await browser.close();}
