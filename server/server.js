const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');


const PORT = 3000;
const api = require('./routers/api');

const app = express();

app.use(express.static(path.join(__dirname, '../ngApp/dist/ngApp')))

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', api);

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../ngApp/dist/ngApp/index.html'));
})

app.listen(PORT, function () {
  console.log('Server running on localhost: ' + PORT);
})