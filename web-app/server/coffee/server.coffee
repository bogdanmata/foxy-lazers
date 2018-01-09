http      = require "http"
url       = require "url"
fs        = require "fs"

server = http.createServer (req, res) ->
  console.log "#{req.url} requested"

  originalFile = url.parse(req.url).pathname
  regexString = /(^\/js\/)|(^\/css\/)/g
  regexString.exec originalFile
  #console.log "#{regexString.lastIndex}"
  fileName = if (regexString.lastIndex == 0) || ('\/' == originalFile) then "./app/client/index.html" else "./app/client#{originalFile}"
  console.log "Requested resource: \"#{originalFile}\" -> \"#{fileName}\""
  fs.readFile fileName, "utf8", (err, data) ->
    if err
      res.writeHead 404,
        "Content-Type": "text/plain"
      res.end err.message
    else
      res.writeHead 200,
        "Content-Type": "text/html"
      res.end data

server.listen 3000
console.log "Server listening on port 3000..."
