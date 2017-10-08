const express = require('express');
const path = require('path');
const fs = require('fs');
const { Client } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const client = new Client();
client.connect();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true,
}));

// Define the port to run on
app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
const server = app.listen(app.get('port'), () => {
  const { port } = server.address();
  console.log(`Listening on port ${port}`);
});

app.post('/', async (req, res) => {
  console.log('log');
  const { name, email, vcsAcc } = req.body;
  console.log(`Name: ${name} Email: ${email} vcsAcc: ${vcsAcc}`);
  fs.appendFile('newsletter.txt', `Name: ${name} Email: ${email} vcsAcc: ${vcsAcc} \r\n`, (err) => {
    if (err) throw err;
    console.log('Saved!');
  });

  const response = await client.query('INSERT INTO newsletter VALUES ($1, $2, $3)', [email, name, vcsAcc]);
  console.log(response);
  res.send({ status: 'success' });
});
