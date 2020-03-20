const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const indexPath = path.join(__dirname, 'public', 'index.html')
let html = cheerio.load(fs.readFileSync(indexPath, 'utf8')).html()
require('glob')(__dirname + "/public/**/*.js", function (er, files) {
  let utils = ''
  const inject = files.map(f => {
    if (f.includes('injectSrcScripts.js')) return
    if (f.includes('utils.js')) {
      utils = `<script src="${f.replace(path.join(__dirname, 'public'), '.')}"></script>`
      return
    }
    if (f.includes('main.js')) return '  <script defer src="./main.js"></script>'
    return `  <script src="${f.replace(path.join(__dirname, 'public'), '.')}"></script>`
  }).join('\n').trimRight()
  let res = html.split('\n').map(e => e.includes('<script src="./') ? null : e).reduce((a, c) => {
    if (c) a += `${c}\n`
    return a
  }, '').trimRight()
  if (res.includes('<script defer src="./main.js"></script>'))
    res = res.replace('<script defer src="./main.js"></script>', [utils, inject].join('\n'))
  else
    res = res.replace('</head>', [utils, inject, '</head>'].join('\n'))
  fs.writeFileSync(indexPath, res, {encoding:'utf8',flag:'w'})
})