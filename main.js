function startServer() {
  const express = require('express');
  const app = express();
  const path = require('path');
  const router = express.Router();
  
  router.get('/',function(_, res){
    const html = require('fs').readFileSync(__dirname + '/src/index.html', 'utf8');
    require('glob')(__dirname + "/src/**/*.js", function (er, files) {
      const inject = files.map(f => {
        if (f.includes('utils.js')) return
        return `<script src="${f.replace(path.join(__dirname, 'src'), '')}"></script>`
      }).join('\n')      
      res.send(html.replace('~~inject~~', inject));
    })
  });

  app.use('/', router);
  app.use(express.static(path.join(__dirname, "src")));
  app.listen(process.env.port || 3000);
  console.log('Running at Port 3000');
}

function startServer2() {
  const http = require('http');
  const fs = require("fs");
  const path = require("path");

  function send404(response){
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: Resource not found.');
    response.end();
  }

  // only load js and html!
  const mimeLookup = {
    '.js': 'application/javascript',
    '.html': 'text/html'
  };

  // inject all pages/components into app head
  let html = fs.readFileSync(__dirname + '/src/index.html', 'utf8');
  require("glob")(__dirname + "/src/**/*.js", function (er, files) {
    const inject = files.map(f => {
      if (f.includes('utils.js')) return
      return `<script src="${f.replace(path.join(__dirname, 'src'), '/src')}"></script>`
    }).join('\n')
    html = html.replace('~~inject~~', inject)
  })

  http.createServer((req, res) => {
    if(req.method !== 'GET') return
    let fileurl = req.url
    if(req.url === '/'){
      fileurl = 'src/index.html';
    }
    let filepath = path.resolve('./' + fileurl);
    let mimeType = mimeLookup[path.extname(filepath)];

    // only allow supported files
    if(!mimeType) return send404(res)

    fs.exists(filepath, (exists) => {
      // if file doesn't exist, 404
      if(!exists) return send404(res)
      // file exists, 200
      res.writeHead(200, {'Content-Type': mimeType});
      // if is index.html, then send our app
      if(fileurl.includes('src/index.html')) res.end(html)
      // otherwise, send scripts!
      else fs.createReadStream(filepath).pipe(res);
    });
  }).listen(3000);
  console.log('Running at Port 3000');
}

startServer()