import { chromium } from '@playwright/test';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const baseURL = process.env.CONFIGURED_BASE_URL || 'http://127.0.0.1:4002';
const directory = 'docs/screenshots/v4/configured-fallback';
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PW_CHROMIUM||'/usr/bin/chromium'});
const records=[], files=[];
try {
 for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:900}});
  let intercepted=0;
  await context.route('**/auth/request',route=>{intercepted++;return route.fulfill({status:409,contentType:'text/plain',body:'QA interception: no sign-in email was sent.'});});
  const page=await context.newPage();
  for(const [name,path,expected] of [['home','/',2],['about','/about',1],['learn','/learn',1],['library','/library',1],['studio','/studio/creator',1]]){
   const response=await page.goto(baseURL+path);await page.evaluate(()=>document.fonts.ready);
   const measurements=await page.evaluate(()=>({portraitImages:document.querySelectorAll('main .creator-portrait img').length,fallbacks:document.querySelectorAll('main .portrait-fallback').length,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth)}));
   if(response.status()!==200||measurements.portraitImages!==0||measurements.fallbacks!==expected||measurements.overflow>0)throw new Error(`Unexpected fallback state at ${path} ${width}`);
   const file=`${name}-${width}-full.jpg`;await page.screenshot({path:`${directory}/${file}`,type:'jpeg',quality:78,fullPage:true,animations:'disabled'});files.push(file);
   records.push({width,path,status:response.status(),...measurements});
  }
  await page.goto(baseURL+'/join');await page.getByLabel('Email address',{exact:true}).waitFor();
  const signupFile=`sign-in-${width}.jpg`;await page.screenshot({path:`${directory}/${signupFile}`,type:'jpeg',quality:78,fullPage:true});files.push(signupFile);
  await page.getByLabel('Email address',{exact:true}).fill('qa-never-send@example.invalid');
  await page.getByRole('button',{name:'Send sign-in email',exact:true}).click();
  await page.getByText('QA interception: no sign-in email was sent.',{exact:true}).waitFor();
  if(intercepted!==1)throw new Error('Safe interception did not run exactly once');
  const anonymousExport=await context.request.get(baseURL+'/api/account/export');
  if(anonymousExport.status()!==401||!/private.*no-store|no-store.*private/.test(anonymousExport.headers()['cache-control']||''))throw new Error('Configured anonymous export did not fail closed');
  records.push({width,path:'/join',emailFormRendered:true,submissionIntercepted:true,providerEmailSent:false,anonymousExportStatus:anonymousExport.status(),anonymousExportCache:anonymousExport.headers()['cache-control']});
  await context.close();
 }
 const manifest={capturedAt:new Date().toISOString(),baseURL,mode:'Next development server with isolated .next/dev output; not production or remote lifecycle evidence',projectRef:'frxufmwwbegconolevkw',configuration:'Existing intended-project URL and publishable key only; portraits false; no server secret',methodology:'Real configured signed-out rendering; browser intercepts email submission before the server. No account created, provider email sent, privileged operation or remote member-lifecycle claim.',records,files:[]};
 for(const file of files)manifest.files.push({file,sha256:createHash('sha256').update(await readFile(`${directory}/${file}`)).digest('hex')});
 await writeFile(`${directory}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
 console.log(`${records.length} configured/fallback observations; ${files.length} captures; zero provider sends.`);
}finally{await browser.close();}
