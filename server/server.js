const express = require('express')
const bodyParser = require('body-parser')


const PORT = 3000;
const api = require('./router/api');

const app = express()

app.use(bodyParser.json());

app.use('/api', api);

app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(PORT, function() {
    console.log('Server running on localhost: ' + PORT);
})