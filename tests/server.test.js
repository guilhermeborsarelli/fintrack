import test from 'node:test';
import assert from 'node:assert/strict';
import {createResearchService,rankSources,searchQueries,safePublicUrl} from '../server/research.js';
import {createApp} from '../server/index.js';
const sources=[{id:1,title:'Loja Exemplo · supermercado',url:'https://loja-exemplo.com.br/sobre',content:'LOJA EXEMPLO é uma empresa de supermercados. São Paulo SP. CNPJ 11.222.333/0001-81.'},{id:2,title:'Loja Exemplo · cadastro',url:'https://cnpj.biz/11222333000181',content:'LOJA EXEMPLO: supermercado varejista. São Paulo SP. CNPJ 11.222.333/0001-81.'}];
test('buscas usam nome/contexto da cobrança e não dados bancários',()=>{
 const q=searchQueries('LOJA EXEMPLO');assert.equal(q.length,2);assert.match(q[0],/cobrança cartão de crédito/);assert.match(q[1],/razão social CNPJ/);assert.throws(()=>searchQueries('PIX JOAO'));assert.equal(safePublicUrl('javascript:alert(1)'),null);assert.equal(safePublicUrl('https://127.0.0.1/test'),null);
});
test('fontes com mesmo CNPJ válido podem corroborar; homônimos e um só domínio não',()=>{
 assert.equal(rankSources('LOJA EXEMPLO',sources)[0].automatic,true);
 assert.equal(rankSources('LOJA EXEMPLO',[sources[0]])[0].automatic,false);
 assert.equal(rankSources('OUTRO NOME',sources).length,0);
 assert.equal(rankSources('LOJA EXEMPLO',sources.map(s=>({...s,content:s.content.replace('11.222.333/0001-81','11.111.111/1111-11')})))[0].automatic,false);
 assert.equal(rankSources('LOJA EXEMPLO',[sources[0],{...sources[1],url:'https://sub.loja-exemplo.com.br/registro'}])[0].automatic,false);
});
test('cache reutiliza resultado e a credencial não aparece no conteúdo enviado ao cliente',async()=>{
 let calls=0;const service=createResearchService({apiKey:'test-provider-secret',fetcher:async(url,options)=>{calls++;assert.equal(url,'https://api.tavily.com/search');assert.equal(options.headers.Authorization,'Bearer test-provider-secret');const body=JSON.parse(options.body);assert.equal(body.include_answer,false);return {ok:true,json:async()=>({results:sources.map(s=>({title:s.title,url:s.url,content:s.content}))})};}});
 const result=await service.lookup('LOJA EXEMPLO');assert.equal(result.candidates[0].automatic,true);assert.equal(calls,2);assert.equal(JSON.stringify(result).includes('test-provider-secret'),false);
 assert.equal((await service.lookup('LOJA EXEMPLO')).cached,true);assert.equal(calls,2);
});
test('falta de provedor e falha externa não produzem classificação inventada',async()=>{
 await assert.rejects(()=>createResearchService({}).lookup('LOJA EXEMPLO'),/não configurado/);
 await assert.rejects(()=>createResearchService({apiKey:'x',fetcher:async()=>({ok:false})}).lookup('LOJA EXEMPLO'),/indisponível/);
});
test('IA não pode fabricar URLs ou citações, e uma hipótese nunca vira certeza sozinha',async()=>{
 const service=createResearchService({apiKey:'search',aiKey:'ai',fetcher:async url=>url.includes('tavily')?{ok:true,json:async()=>({results:[{title:'Loja Exemplo',url:sources[0].url,content:'LOJA EXEMPLO oferece produtos especiais.'}]})}:{ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({candidates:[{category:'Compras',subcategory:'Outros',rationale:'inventado',citations:[{sourceId:999,quote:'Nada disso existe na fonte.'}]}]})}}]})}});
 const result=await service.lookup('LOJA EXEMPLO');assert.deepEqual(result.candidates,[]);
});
async function serve(t,options){const server=createApp(options);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>server.close(resolve)));return `http://127.0.0.1:${server.address().port}`;}
test('API real exige autenticação em produção, limita origem e aceita só payload pequeno',async t=>{
 assert.throws(()=>createApp({production:true,password:''}),/RESEARCH_PASSWORD/);
 const api=await serve(t,{production:true,password:'local-test-password',service:{configured:true,lookup:async(name)=>({merchant:name,candidates:[],sources:[]})}});
 assert.equal((await fetch(api+'/api/research/health')).status,401);assert.equal((await fetch(api+'/healthz')).status,200);
 const headers={Authorization:'Basic '+Buffer.from('fintrack:local-test-password').toString('base64'),'Content-Type':'application/json'};
 assert.equal((await fetch(api+'/api/research/health',{headers})).status,200);
 assert.equal((await fetch(api+'/api/research',{method:'POST',headers:{...headers,Origin:'https://malicious.invalid'},body:JSON.stringify({merchant:'LOJA EXEMPLO'})})).status,403);
 const response=await fetch(api+'/api/research',{method:'POST',headers,body:JSON.stringify({merchant:'LOJA EXEMPLO'})});assert.equal(response.status,200);assert.equal((await response.json()).merchant,'LOJA EXEMPLO');
 assert.equal((await fetch(api+'/api/research',{method:'POST',headers,body:'{' })).status,400);
 assert.equal((await fetch(api+'/api/research',{method:'POST',headers,body:'x'.repeat(3000)})).status,413);
});
test('limite de requisições impede uso ilimitado da chave do provedor',async t=>{
 const api=await serve(t,{service:{configured:true,lookup:async name=>({merchant:name,candidates:[]})}});
 for(let i=0;i<30;i++)assert.equal((await fetch(api+'/api/research',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({merchant:'LOJA EXEMPLO'})})).status,200);
 assert.equal((await fetch(api+'/api/research',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({merchant:'LOJA EXEMPLO'})})).status,429);
});
test('fontes locais, IPv6 e uma cidade incompatível não ganham confirmação automática',()=>{
 assert.equal(safePublicUrl('https://[::ffff:127.0.0.1]/'),null);
 assert.equal(rankSources('LOJA EXEMPLO',sources,{city:'Curitiba PR'})[0].automatic,false);
});
