'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const allowed={'/':'index.html','/index.html':'index.html','/app.js':'app.js','/engine.js':'engine.js','/style.css':'style.css'};
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
http.createServer((req,res)=>{
 if(req.headers.host!=='127.0.0.1:40808'){res.writeHead(403);return res.end();}
 const url=new URL(req.url,'http://127.0.0.1:40808');
 if(url.pathname==='/health'){res.writeHead(200,{'Content-Type':'text/plain'});return res.end('408-study-desktop-v1');}
 const name=allowed[url.pathname];if(!name){res.writeHead(404);return res.end('Not found');}
 fs.readFile(path.join(__dirname,'web',name),(err,body)=>{res.writeHead(err?500:200,{'Content-Type':types[path.extname(name)],'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(err?'Unable to read application files':body);});
}).listen(40808,'127.0.0.1');
