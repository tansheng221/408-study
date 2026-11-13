(function(root){
 'use strict';
 const subjects=['数据结构','组成原理','操作系统','计算机网络'];
 const terms=['时间复杂度','空间复杂度','顺序存储','链式存储','先进先出','后进先出','深度优先','广度优先','二分查找','快速排序','归并排序','中序遍历','先序遍历','后序遍历','虚拟内存','缺页中断','请求分页','互斥','同步','死锁','临界区','时间片','页表','进程','线程','信号量','局部性','程序计数器','补码','流水线','主存','高速缓存','Cache','CPU','DMA','TCP','UDP','IP','拥塞控制','流量控制','三次握手','四次挥手','可靠传输','滑动窗口','路由','栈','队列','树','图'];
 function generate(source,mode='mixed',density=2){
  const cards=[]; const lines=source.match(/[^\n。！？]+[。！？]?/g)||[];let cursor=0;
  for(const raw of lines){const start=source.indexOf(raw,cursor);cursor=start+raw.length; const candidates=[];
   const add=(s,e,kind)=>{if(e>s&&s>=0&&e<=raw.length)candidates.push({start:s,end:e,answer:raw.slice(s,e),kind});};
   if(mode==='mixed'||mode==='knowledge')for(const term of terms){let p=raw.indexOf(term);while(p>=0){add(p,p+term.length,'知识点');p=raw.indexOf(term,p+term.length);}}
   if(mode==='mixed'||mode==='definition'){const m=/(?:是指|定义为|指的是|称为|是)([^，。；！？\n]{2,48})/.exec(raw);if(m)add(m.index+m[0].length-m[1].length,m.index+m[0].length,'定义');}
   if(mode==='mixed'||mode==='number'){for(const m of raw.matchAll(/\d+(?:\.\d+)?(?:\s*(?:位|字节|bit|KB|MB|GB|次|层|个|ms|%))?|[二三四五六七八九十]+次/g))add(m.index,m.index+m[0].length,'事实数字');}
   if(mode==='mixed'||mode==='algorithm'){for(const m of raw.matchAll(/O\([^\n)]+\)|(?:首先|然后|最后|步骤\s*\d+[:：]?)[^，。；\n]+|(?:二分查找|快速排序|归并排序|深度优先|广度优先|Dijkstra|Kruskal|Prim|BFS|DFS)/g))add(m.index,m.index+m[0].length,'算法');}
   candidates.sort((a,b)=>(b.end-b.start)-(a.end-a.start)||a.start-b.start);const blanks=[];
   for(const c of candidates)if(blanks.length<density&&!blanks.some(b=>c.start<b.end&&c.end>b.start))blanks.push(c);
   if(blanks.length)cards.push({id:uid(),text:raw,sourceStart:start,blanks:blanks.sort((a,b)=>a.start-b.start),status:'new'});
  }return cards;
 }
 function uid(){return globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+Math.random().toString(36).slice(2);}
 function validate(data){
  if(!data||data.version!==1||!Array.isArray(data.docs)||data.docs.length>500)throw Error('需要 version: 1 的学习器备份，最多 500 个文档。');
  return data.docs.map(d=>{
   if(!d||typeof d.title!=='string'||!d.title.trim()||typeof d.source!=='string'||d.source.length>200000||!subjects.includes(d.subject)||!Array.isArray(d.cards)||d.cards.length>10000)throw Error('文档字段或课程分类不合法。');
   const cards=d.cards.map(c=>{
    if(!c||typeof c.text!=='string'||!Array.isArray(c.blanks)||!['new','mastered','review'].includes(c.status))throw Error('卡片格式不合法。');
    let end=0; const blanks=c.blanks.map(b=>{if(!b||!Number.isInteger(b.start)||!Number.isInteger(b.end)||b.start<end||b.end<=b.start||b.end>c.text.length||typeof b.answer!=='string'||b.answer.length>10000)throw Error('挖空范围或答案不合法。');end=b.end;return {start:b.start,end:b.end,answer:b.answer,kind:typeof b.kind==='string'?b.kind:'手动'};});
    if(!blanks.length)throw Error('卡片至少需要一个挖空。');return {id:uid(),text:c.text,sourceStart:Number.isInteger(c.sourceStart)?c.sourceStart:-1,blanks,status:c.status};
   });return {id:uid(),title:d.title.slice(0,120),subject:d.subject,source:d.source,cards,updated:new Date().toISOString()};
  });
 }
 function markdown(d){return '# '+d.title+'\n\n课程：'+d.subject+'\n\n'+d.cards.map((c,i)=>{let s='',p=0;c.blanks.forEach(b=>{s+=c.text.slice(p,b.start)+'____';p=b.end;});return '## '+(i+1)+'\n\n'+s+c.text.slice(p)+'\n\n答案：'+c.blanks.map(b=>b.answer).join('；')+'\n\n状态：'+({new:'未学习',review:'待复习',mastered:'已掌握'}[c.status]);}).join('\n\n')+'\n\n## 完整原文\n\n'+d.source;}
 const api={subjects,generate,validate,markdown,uid};if(typeof module!=='undefined')module.exports=api;else root.Engine=api;
})(globalThis);
