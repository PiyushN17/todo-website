const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req,res)=>{
    if(req.method==='POST' && req.url==='/add-todo'){
        let body='';
        req.on('data',chunk=>{body+=chunk});
        req.on('end',()=>{
            try{
                const todo=JSON.parse(body);
                const filePath=path.join(__dirname,'public','data.json');
                fs.readFile(filePath,'utf8',(err,data)=>{
                    let todos=[];
                    if(!err && data) todos=JSON.parse(data);
                    todos.push(todo);
                    fs.writeFile(filePath,JSON.stringify(todos,null,2),err=>{
                        if(err){
                            res.writeHead(500,{'Content-Type':'application/json'});
                            return res.end(JSON.stringify({status:'error',message:err.message}));
                        }
                        res.writeHead(200,{'Content-Type':'application/json'});
                        res.end(JSON.stringify({status:'success',todo}));
                    });
                });
            }catch(e){
                res.writeHead(400,{'Content-Type':'application/json'});
                res.end(JSON.stringify({status:'error',message:'Invalid JSON'}));
            }
        });
        return;
    }

    if(req.method==='GET' && req.url==='/data.json'){
        const filePath=path.join(__dirname,'public','data.json');
        fs.readFile(filePath,(err,data)=>{
            if(err){
                res.writeHead(404,{'Content-Type':'application/json'});
                return res.end(JSON.stringify({status:'error',message:'File not found'}));
            }
            res.writeHead(200,{'Content-Type':'application/json'});
            res.end(data);
        });
        return;
    }

    let pathName=req.url;
    if(pathName==='/') pathName='/index.html';
    if(!path.extname(pathName)) pathName+='.html';

    const filePath=path.join(__dirname,'public',pathName);
    const ext=path.extname(filePath);
    const allowedExt=['.html','.css','.js','.json'];
    if(!allowedExt.includes(ext)){
        res.writeHead(404,{'Content-Type':'text/plain'});
        return res.end('Not Found');
    }

    fs.readFile(filePath,(error,data)=>{
        if(error){
            res.writeHead(404,{'Content-Type':'text/plain'});
            return res.end('File Not Found');
        }
        let contentType='text/html';
        if(ext==='.css') contentType='text/css';
        else if(ext==='.js') contentType='application/javascript';
        else if(ext==='.json') contentType='application/json';
        res.writeHead(200,{'Content-Type':contentType});
        res.end(data);
    });
});

server.listen(8000,'127.0.0.1',()=>{console.log('Listening on http://127.0.0.1:8000')});
