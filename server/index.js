import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {timingSafeEqual} from 'node:crypto';
import {createResearchService} from './research.js';
const same=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);};
export function createApp({service=createResearchService({apiKey:process.env.RESEARCH_SEARCH_KEY,aiKey:process.env.RESEARCH_AI_KEY,aiModel:process.env.RESEARCH_AI_MODEL||'gpt-4.1-mini'}),password=process.env.RESEARCH_PASSWORD,origins=(process.env.RESEARCH_ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean),root=resolve('dist'),production=process.env.NODE_ENV==='production',maxHourly=Number(process.env.RESEARCH_MAX_HOURLY||60),now=()=>Date.now()}={}){
 if(!Number.isInteger(maxHourly)||maxHourly<1||maxHourly>1000)throw new Error('RESEARCH_MAX_HOURLY deve ser um inteiro entre 1 e 1000.');
 if(production&&!password)throw new Error('Defina RESEARCH_PASSWORD para proteger o aplicativo e a quota de pesquisa em produção.');
 const counters=new Map();let windowStart=now(),windowCalls=0;
 return http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');
  const origin=req.headers.origin;if(origin){if(!origins.includes(origin)&&origin!==`http://${req.headers.host}`&&origin!==`https://${req.headers.host}`){res.writeHead(403);return res.end('Origem não permitida.');}res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Credentials','true');}
  if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');res.writeHead(204);return res.end();}
  if(req.url==='/healthz'&&req.method==='GET'){res.setHeader('Content-Type','text/plain');res.writeHead(200);return res.end('ok');}
  if(password){const provided=req.headers.authorization||'';const expected='Basic '+Buffer.from('fintrack:'+password).toString('base64');if(!same(provided,expected)){res.setHeader('WWW-Authenticate','Basic realm="Meu Bolso", charset="UTF-8"');res.writeHead(401);return res.end('Autenticação necessária.');}}
  const json=(code,data)=>{res.setHeader('Content-Type','application/json;charset=utf-8');res.setHeader('Cache-Control','no-store');res.writeHead(code);res.end(JSON.stringify(data));};
  let path;try{path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{return json(400,{error:'Caminho inválido.'});}
  if(path==='/api/research/health'&&req.method==='GET')return json(200,{configured:service.configured,service:'merchant-research',version:1});
  if(path==='/api/research'&&req.method==='POST'){
   const current=now();if(current-windowStart>=3600000){windowStart=current;windowCalls=0;counters.clear();}
   const ip=req.socket.remoteAddress||'local';const record=counters.get(ip)||{start:current,count:0};if(current-record.start>=60000){record.start=current;record.count=0;}
   if(record.count>=30||windowCalls>=maxHourly)return json(429,{error:'Limite de consultas atingido. Aguarde antes de continuar.'});record.count++;windowCalls++;counters.set(ip,record);
   let body='';try{
    for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>2048)return json(413,{error:'Envie somente o nome do estabelecimento.'});}
    const input=JSON.parse(body);if(typeof input.merchant!=='string'||input.merchant.length>100||typeof(input.city??'')!=='string'||(input.city||'').length>60)return json(400,{error:'Nome ou cidade inválidos.'});
    return json(200,await service.lookup(input.merchant,input.city||'São Paulo SP'));
   }catch(err){return json(err.status||(err instanceof SyntaxError?400:502),{error:err.status?err.message:'Não foi possível concluir a consulta.'});}
  }
  if(req.method!=='GET'&&req.method!=='HEAD')return json(405,{error:'Método não permitido.'});
  try{
   const file=resolve(root,'.'+(path==='/'?'/index.html':path));if(!file.startsWith(root+sep)&&file!==root)return json(404,{error:'Não encontrado.'});const info=await stat(file);if(!info.isFile())return json(404,{error:'Não encontrado.'});
   const types={'.html':'text/html;charset=utf-8','.js':'application/javascript','.mjs':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
   res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.setHeader('Cache-Control',extname(file)==='.html'?'no-cache':'public,max-age=3600');res.writeHead(200);res.end(req.method==='HEAD'?undefined:await readFile(file));
  }catch{return json(404,{error:'Não encontrado.'});}
 });
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const port=Number(process.env.PORT||8787),host=process.env.HOST||'127.0.0.1';createApp().listen(port,host,()=>process.stdout.write(`Meu Bolso: servidor iniciado na porta ${port}.\n`));
}
