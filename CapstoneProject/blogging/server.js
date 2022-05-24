console.log("Hello Server");
const http=require('http');
const { normalize } = require('path');
const app=require('./backend/app');
const port=process.env.PORT||3000;
app.set('port',port);
// const server=http.createServer((req,res)=> {
//     res.end('This is my first response');
// });
const server=http.createServer(app);
server.listen(port);

