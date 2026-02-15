const express = require('express');

const app = express();

app.get('/', (request, response) => {
  response.status(200).json(
    {
      messsage: 'Hello from the server side!',
      app: 'NA-Tours'
    });
});

app.post('/', (req, res) => {
  res.status(201).send('You can post to this endpoint');
})


const port = 3000;
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
})
