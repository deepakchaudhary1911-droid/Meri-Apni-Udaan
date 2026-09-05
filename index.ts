import { withSupabase } from "npm:@supabase/server@^1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

type QuizAnswer = { question_key: string; answer: unknown };
type PathKey = "government" | "private" | "freelancing" | "business" | "content";

const OPTIONS: Record<string,string[]> = {
  education:["10वीं तक / Up to Class 10","12वीं तक / Class 12","Graduation","Post Graduation / Diploma","अन्य / Other"],
  priority:["अपनी कमाई शुरू करना / Start earning","सरकारी नौकरी की तैयारी / Prepare for a government job","Private job पाना / Get a private job","घर से काम करना / Work from home","कुछ अपना शुरू करना / Start something of my own","अभी career explore करना / I'm still exploring"],
  interests:["लोगों से मिलना / बात करना / Meeting / talking to people","Computer / online काम / Computer / online work","Teaching / समझाना / Teaching / explaining","Creative काम / Creative work","Organising / managing","Independent काम / Independent work"],
  goal:["सरकारी नौकरी / Government Jobs","Private Job / Private Jobs","घर से काम / Work From Home","अपना काम / Business / Your Own Business","Freelancing / Content / Freelancing / Content Creation"],
  situation:["Student / अभी पढ़ाई / Student / currently studying","Graduate / job की तलाश / Graduate / looking for a job","काम कर रही हूँ, change चाहती हूँ / Currently working, want a change","शादी / family के बाद restart / Restarting after marriage / family","Break पर हूँ / On a career break","अपना काम करती हूँ / Running my own work / business"],
  time:["1 घंटे से कम / Less than 1 hour","1–2 घंटे / 1–2 hours","2–4 घंटे / 2–4 hours","4+ घंटे / 4+ hours","काम के साथ limited time / Limited time alongside work"],
  setup:["घर से / From home","अपने शहर में office / shop / Office / shop in my city","आसपास के शहरों में भी / Nearby cities are also possible","Remote / online","अभी तय नहीं / Not sure yet"],
  family:["बहुत ज़्यादा / A lot","कुछ हद तक / Somewhat","थोड़ा / A little","बहुत कम / लगभग नहीं / Very little / almost not at all"],
  barrier:["सही direction नहीं पता / I don't know the right direction","Skills की कमी / Lack of skills","Family / parents का pressure / Family / parents' pressure","समय की कमी / Lack of time","Location / opportunities","Confidence","पैसे / resources / Money / resources"]
};

const META: Record<PathKey, any> = {
 government:{key:"government",titleHi:"सरकारी नौकरी",titleEn:"Government Jobs",rolesHi:["SSC और केंद्र सरकार की भर्तियाँ","State government recruitment","Banking / IBPS roles"],rolesEn:["SSC and central government recruitment","State government recruitment","Banking / IBPS roles"],portals:[{name:"SSC",url:"https://ssc.gov.in/"},{name:"IBPS",url:"https://www.ibps.in/"},{name:"National Career Service",url:"https://www.ncs.gov.in/"}]},
 private:{key:"private",titleHi:"प्राइवेट नौकरी",titleEn:"Private Jobs",rolesHi:["Operations / Admin","Customer Support","Sales / Relationship roles","HR / Recruitment"],rolesEn:["Operations / Admin","Customer Support","Sales / Relationship roles","HR / Recruitment"],portals:[{name:"LinkedIn Jobs",url:"https://www.linkedin.com/jobs/"},{name:"Naukri",url:"https://www.naukri.com/"},{name:"Indeed",url:"https://in.indeed.com/"}]},
 freelancing:{key:"freelancing",titleHi:"फ्रीलांसिंग",titleEn:"Freelancing",rolesHi:["Content writing","Social media support","Virtual Assistant","Canva / basic design"],rolesEn:["Content writing","Social media support","Virtual Assistant","Canva / basic design"],portals:[{name:"Upwork",url:"https://www.upwork.com/"},{name:"Fiverr",url:"https://www.fiverr.com/"},{name:"Freelancer",url:"https://www.freelancer.com/"}]},
 business:{key:"business",titleHi:"अपना काम / बिज़नेस",titleEn:"Business / Self-Employment",rolesHi:["Home-based services","Tuition / training","Reselling","Local services"],rolesEn:["Home-based services","Tuition / training","Reselling","Local services"],portals:[{name:"WhatsApp Business",url:"https://www.whatsapp.com/business/"},{name:"Instagram",url:"https://www.instagram.com/"},{name:"Google Business Profile",url:"https://www.google.com/business/"}]},
 content:{key:"content",titleHi:"कंटेंट / क्रिएटर करियर",titleEn:"Content / Creator Career",rolesHi:["Short-form video","Instagram content","YouTube","UGC / brand content"],rolesEn:["Short-form video","Instagram content","YouTube","UGC / brand content"],portals:[{name:"Instagram",url:"https://www.instagram.com/"},{name:"YouTube",url:"https://www.youtube.com/"},{name:"LinkedIn",url:"https://www.linkedin.com/"}]}
};

function out(data:unknown,status=200){return new Response(JSON.stringify(data),{status,headers:corsHeaders});}
function t(v:unknown){return v==null?"":Array.isArray(v)?v.map(t).join(" "):typeof v==="string"?v:String(v);}
function ck(k:string){const a:Record<string,string>={q1:"education",question1:"education",q2:"priority",question2:"priority",q3:"interests",question3:"interests",q4:"interests",question4:"interests",q5:"setup",question5:"setup",q6:"situation",question6:"situation",q7:"time",question7:"time",q8:"priority",question8:"priority",q9:"barrier",question9:"barrier",q10:"goal",question10:"goal"};return a[k.toLowerCase()]??k.toLowerCase();}
function answerText(key:string,v:unknown){const o=OPTIONS[ck(key)];if(!o)return t(v);if(Array.isArray(v))return v.map(x=>{const i=Number(x);return Number.isInteger(i)&&o[i]?o[i]:t(x)}).join(" ");const i=Number(v);return Number.isInteger(i)&&o[i]?o[i]:t(v)}
function q(answers:QuizAnswer[],key:string){return answers.filter(a=>ck(a.question_key)===key).map(a=>answerText(a.question_key,a.answer)).join(" ");}
function has(v:unknown,terms:string[]){const s=t(v).toLowerCase();return terms.some(x=>s.includes(x.toLowerCase()));}
function score(path:PathKey,a:QuizAnswer[]){
 const education=q(a,"education"),priority=q(a,"priority"),interests=q(a,"interests"),goal=q(a,"goal"),situation=q(a,"situation"),time=q(a,"time"),setup=q(a,"setup"),barrier=q(a,"barrier");
 const r:Record<PathKey,Record<string,string[]>>={
  government:{priority:["सरकारी नौकरी","government job","अपनी कमाई शुरू"],goal:["सरकारी नौकरी","government jobs"],interests:["organising","managing","teaching","समझाना"],situation:["student","graduate","job की तलाश","career break"],time:["1–2 घंटे","2–4 घंटे","4+ घंटे"],setup:["अपने शहर","आसपास के शहर"],barrier:["direction","skills"],education:["12वीं","graduation","post graduation","diploma"]},
  private:{priority:["private job","get a private job","अपनी कमाई शुरू"],goal:["private job","private jobs"],interests:["लोगों से मिलना","बात करना","organising","managing","computer","online काम"],situation:["graduate","job की तलाश","currently working"],time:["1–2 घंटे","2–4 घंटे","4+ घंटे"],setup:["अपने शहर","आसपास के शहर","remote"],barrier:["skills","location","opportunities","confidence"],education:["12वीं","graduation","post graduation","diploma"]},
  freelancing:{priority:["घर से काम","work from home","अपनी कमाई शुरू"],goal:["घर से काम","work from home","freelancing","content"],interests:["computer","online काम","creative","independent"],situation:["career break","break पर","शादी","family"],time:["1 घंटे से कम","1–2 घंटे","2–4 घंटे"],setup:["घर से","remote","online"],barrier:["skills","time","confidence"],education:["12वीं","graduation","diploma"]},
  business:{priority:["कुछ अपना शुरू","start something of my own","अपनी कमाई"],goal:["अपना काम","business","your own business"],interests:["independent","organising","managing","लोगों से"],situation:["अपना काम","running my own","business"],time:["1–2 घंटे","2–4 घंटे","4+ घंटे"],setup:["घर से","office","shop"],barrier:["location","opportunities","confidence","money","resources"],education:["12वीं","graduation","diploma"]},
  content:{priority:["घर से काम","work from home","content","अपनी कमाई"],goal:["freelancing","content creation","work from home"],interests:["creative","computer","online काम","independent"],situation:["career break","break पर","student","family"],time:["1 घंटे से कम","1–2 घंटे","2–4 घंटे"],setup:["घर से","remote","online"],barrier:["skills","confidence","time"],education:["12वीं","graduation","diploma"]}
 };
 const x=r[path];let s=0;if(has(priority,x.priority))s+=4;if(has(goal,x.goal))s+=4;if(has(interests,x.interests))s+=3;if(has(situation,x.situation))s+=2;if(has(time,x.time))s+=2;if(has(setup,x.setup))s+=2;if(has(barrier,x.barrier))s+=1;if(has(education,x.education))s+=2;return Math.min(20,s);
}
function band(s:number){return s>=17?{hi:"बहुत अच्छा मेल",en:"Strong Match"}:s>=14?{hi:"अच्छा मेल",en:"Good Match"}:s>=10?{hi:"ज़रूर देखें",en:"Worth Exploring"}:{hi:"अभी प्राथमिकता कम",en:"Low Priority"};}
function reason(path:PathKey,a:QuizAnswer[]){const priority=q(a,"priority"),setup=q(a,"setup");if(path==="private"){const urgent=has(priority,["अपनी कमाई","start earning","private job"]);return {hi:urgent?"आपके answers में जल्दी income शुरू करने और नौकरी पाने की जरूरत दिखती है, इसलिए private roles एक practical starting point हो सकते हैं।":"Private roles आपको relatively जल्दी work experience, income और career momentum दे सकते हैं।",en:urgent?"Your answers suggest a need to start earning sooner, making private roles a practical starting point.":"Private roles can provide relatively quick work experience, income and career momentum."};}if(path==="freelancing"){const flexible=has(setup,["घर से","from home","remote","online"]);return {hi:flexible?"आपकी घर से या flexible काम की preference freelancing के साथ अच्छी तरह align करती है।":"Freelancing आपको skill के आधार पर flexible income build करने का रास्ता दे सकती है।",en:flexible?"Your preference for home-based or flexible work aligns well with freelancing.":"Freelancing can give you a flexible way to build income around a practical skill."};}if(path==="business")return {hi:"आपके answers में independent work और अपना कुछ शुरू करने की दिशा के संकेत हैं, इसलिए self-employment relevant है।",en:"Your answers show signals around independent work and starting something of your own, making self-employment relevant."};if(path==="content")return {hi:"Creative और digital work से जुड़े आपके answers content creation को explore करने लायक बनाते हैं।",en:"Your creative and digital preferences make content creation worth exploring."};return {hi:"आपके answers में stability, structured work और सरकारी नौकरी की दिशा के संकेत मिले हैं।",en:"Your answers show signals around stability, structured work and interest in government employment."};}
function locationText(s:string|null){if(!s)return {city:"",state:""};try{const x=JSON.parse(s);return {city:String(x.city??x.district??""),state:String(x.state??x.region??"")};}catch{return {city:s,state:""};}}

export default {fetch:withSupabase({auth:"none"},async(req:Request,ctx:any)=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:corsHeaders});
 if(req.method!=="POST")return out({success:false,error:"Only POST is supported."},405);
 try{
  const body=await req.json();const sessionId=typeof body?.session_id==="string"?body.session_id.trim():"";
  if(!sessionId)return out({success:false,error:"session_id is required."},400);
  const db=ctx.supabaseAdmin;
  const {data:session,error:sessionError}=await db.from("quiz_sessions").select("id,language,location,status,completed_at").eq("id",sessionId).single();
  if(sessionError||!session)return out({success:false,error:sessionError?.message??"Quiz session not found."},404);
  const {data:payment,error:paymentError}=await db.from("payments").select("id,status").eq("session_id",sessionId).in("status",["verified","captured","paid"]).order("created_at",{ascending:false}).limit(1).maybeSingle();
  if(paymentError)throw new Error(paymentError.message);if(!payment)return out({success:false,error:"No verified payment was found for this quiz session."},402);
  const {data:rows,error:answersError}=await db.from("quiz_answers").select("question_key,answer,created_at").eq("session_id",sessionId).order("created_at",{ascending:true});
  if(answersError)throw new Error(answersError.message);
  const answers:QuizAnswer[]=(rows??[]).map((r:any)=>({question_key:String(r.question_key??""),answer:r.answer}));
  if(!answers.length)return out({success:false,error:"No quiz answers were found for this session."},400);
  const keys:PathKey[]=["government","private","freelancing","business","content"];
  const scored=keys.map(key=>{const rr=reason(key,answers);return {...META[key],score:score(key,answers),reasonHi:rr.hi,reasonEn:rr.en};}).sort((a,b)=>b.score-a.score);
  const topPaths=scored.slice(0,3);
  const {data:rec}=await db.from("recommendations").insert({session_id:sessionId,career_fit_score:topPaths[0]?.score??0,top_paths:topPaths,recommendation_data:{engine_version:"browser-pdf-v1",report_language:session.language??"hi",generated_at:new Date().toISOString(),answer_count:answers.length}}).select("id").single();
  const loc=locationText(session.location);
  return out({success:true,recommendation_id:rec?.id??"",status:"ready",report_language:session.language??"hi",location:loc,top_paths:topPaths.map(p=>({...p,scoreBand:band(p.score)}))});
 }catch(error){console.error(error);return out({success:false,error:error instanceof Error?error.message:String(error)},500);}
})};
