let app = require('express')();
let express = require('express');
let cors = require('cors')
let fs = require('fs');
let http = require('http');
let https = require('https');

app.use(cors())

// 密钥
let privateKey = fs.readFileSync('./key/privatekey.pem', 'utf8');
let certificate = fs.readFileSync('./key/certificate.pem', 'utf8');
let credentials = {key: privateKey, cert: certificate};

let httpServer = http.createServer(app)
let httpsServer = https.createServer(credentials, app)
// http 端口
let PORT = 6666;
// https 端口
let SSLPORT = 443;

httpServer.listen(PORT, function() {
  console.log(`HTTP Server is running on: http://localhost:${PORT}`);
})

httpsServer.listen(SSLPORT, function() {
  console.log(`HTTPS Server is running on: https://localhost:${SSLPORT}`);
})

app.use(express.static('../'));

app.get('/', function(req, res) {
  if (req.protocol === 'https') {
    fs.readFile('../index.html', function(err, data) {
      if (err) {
        console.log(err);
       }
      else{
        //200：OK
        // res.writeHead(200,{"Content-Type":"text/html"});
        res.write(data.toString());
        res.status(200).send()
      }
    })
  } else {
    res.status(200).send('Welcome http!')
  }
});

app.get('/setting.json', function(req, res) {
  if (req.protocol === 'https') {
    fs.readFile('../config/setting.json', 'utf8', function(err, data){
      if (err) throw err;
      let config = JSON.parse(data)
      res.status(200).send(config)
    })
  } else {
    res.status(200).send('Welcome http!')
  }
});