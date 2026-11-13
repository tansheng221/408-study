const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=http.createServer((req,res)=>{let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}const file=path.resolve(__dirname,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(__dirname+path.sep)){res.writeHead(403);return res.end();}fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':types[path.extname(file)]||'text/plain; charset=utf-8','Cache-Control':'no-store'});res.end(err?'Not found':data);});});
const port=Number(process.env.PORT)||4080;
server.listen(port,'127.0.0.1',()=>console.log(`408 学习器：http://127.0.0.1:${port}  （按 Ctrl+C 停止）`));
server.on('error',e=>{console.error('启动失败：'+e.message);process.exitCode=1;});
