'use strict';

require('letsencrypt-express').create({

  server: 'staging'

, email: 'john.ferguson3.141596@gmail.com'

, agreeTos: true

, approveDomains: [ 'http://99.254.129.78:8080' ]

, app: require('express')().use('/', function (req, res) {
    res.end('Hello, World!');
  })

}).listen(80, 443);
