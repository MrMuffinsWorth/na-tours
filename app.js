const fs = require('fs');
const express = require('express');
const app = express();

// middlware
app.use(express.json());

/*app.get('/', (request, response) => {
  response.status(200).json(
    {
      messsage: 'Hello from the server side!',
      app: 'NA-Tours'
    });
});

app.post('/', (req, res) => {
  res.status(201).send('You can post to this endpoint');
})
*/
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  })
});

app.post('/api/v1/tours', (req, res) => {
  //console.log(req.body);
  const newID = tours[tours.length - 1].id + 1;
  //Object.assign will merge two JS objects
  const newTour = Object.assign({ id: newID }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    if (err) return console.error(err.message);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  });
})

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
})
