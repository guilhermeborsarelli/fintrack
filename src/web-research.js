import {researchName} from './merchant-research.js';
export function publicEvidenceUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/i.test(u.hostname)&&!/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(u.hostname)&&!u.hostname.endsWith('.local')?u.href:null;}catch{return null;}}
const base=()=>import.meta.env?.VITE_RESEARCH_API_URL||'';
export async function webResearchHealth(fetcher=fetch){try{const response=await fetcher(base()+'/api/research/health',{credentials:'include',signal:AbortSignal.timeout(5000)});if(!response.ok)return false;const data=await response.json();return data.service==='merchant-research'&&data.configured===true;}catch{return false;}}
export async function webResearch(name,{city='São Paulo SP',fetcher=fetch}={}){
 const merchant=researchName(name);if(!merchant)throw new Error('Descrição não elegível para pesquisa.');
 const response=await fetcher(base()+'/api/research',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({merchant,city}),signal:AbortSignal.timeout(60000)});
 if(!response.ok){let error;try{error=(await response.json()).error;}catch{}throw new Error(error||'Pesquisa ampliada indisponível. O serviço de busca precisa estar conectado.');}
 const data=await response.json();if(data.merchant!==merchant||!Array.isArray(data.candidates))throw new Error('Resposta inválida do serviço de busca.');
 const candidates=data.candidates.slice(0,3).flatMap(c=>{
  if(typeof c.category!=='string'||typeof c.subcategory!=='string')return [];
  const evidence=(c.evidence||[]).flatMap(s=>{const url=publicEvidenceUrl(s.url);return url?[{title:String(s.title||'Fonte').slice(0,200),url,content:String(s.content||'').slice(0,800)}]:[];});
  return evidence.length?[{category:c.category,subcategory:c.subcategory,evidence,rationale:String(c.rationale||'Hipótese baseada nas fontes.').slice(0,400),automatic:c.automatic===true,confidence:String(c.confidence||'suggestion')}]:[];
 });
 return {...data,candidates};
}
export function candidateClassification(candidate,{accepted=false}={}){return {category:candidate.category,subcategory:candidate.subcategory,classificationSource:accepted?'Pesquisa web confirmada por você':'Pesquisa web corroborada',classificationConfidence:accepted?'user_accepted':'supported',evidenceUrl:candidate.evidence[0].url,evidenceTitle:candidate.evidence[0].title,evidenceText:candidate.evidence[0].content};}
