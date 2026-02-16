const fs = require('fs');
const express = require('express');
const app = express();

// middlware
app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours
    }
  })
};
const getTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) return res.status(404).json({ status: 'failed', message: 'Tour does not exist' });
  const tour = tours.find(el => el.id === id);
  res.status(200).json({
    status: 'success',
    tour: tour
  })
};

const createTour = (req, res) => {
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
}

const updateTour = (req, res) => {
  if (req.params.id > tours.length) return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated Tour Here>'
    }
  })
};

const deleteTour = (req, res) => {
  if (req.params.id > tours.length) return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  res.status(204).json({
    status: 'success',
    data: null
  })
};

//app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTour);
//app.post('/api/v1/tours', createTour)
//app.patch('/api/v1/tours/:id', updateTour)
//app.delete('/api/v1/tours/:id', deleteTour)

app.route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app.route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
})
