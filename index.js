'use strict';

const express = require('express');
const port = 8080;

let app = express();

app.use('/', express.static('static'));

app.listen(port);

console.log('Static server listening on http://[::]:' + port);
