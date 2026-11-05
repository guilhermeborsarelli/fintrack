import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
GlobalWorkerOptions.workerSrc=workerUrl;
export async function extractPdf(file, askPassword) {
  if(file.size>25*1024*1024) throw new Error('O limite é de 25 MB por PDF.');
  const task=getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false});
  task.onPassword=(updatePassword,reason)=>{
    askPassword(reason===2).then(password=>{
      if(password===null) { task.destroy().catch(()=>{}); return; }
      updatePassword(password);
    }).catch(()=>task.destroy().catch(()=>{}));
  };
  try {
    const pdf=await task.promise;
    if(pdf.numPages>150) throw new Error('Importe um documento com até 150 páginas.');
    const pages=[];
    for(let n=1;n<=pdf.numPages;n++) {
      const page=await pdf.getPage(n); const content=await page.getTextContent();
      const lines=[];
      for(const item of content.items) {
        if(!('str' in item)||!item.str.trim()) continue;
        const y=item.transform[5],x=item.transform[4];
        let row=lines.find(r=>Math.abs(r.y-y)<2.5);
        if(!row){row={y,items:[]};lines.push(row);}
        row.items.push({x,text:item.str});
      }
      pages.push(lines.sort((a,b)=>b.y-a.y).map(r=>r.items.sort((a,b)=>a.x-b.x).map(i=>i.text).join(' ')).join('\n'));
      page.cleanup();
    }
    return pages.join('\n');
  } finally { await task.destroy().catch(()=>{}); }
}
