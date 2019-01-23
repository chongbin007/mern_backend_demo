const mongoose = require('mongoose');
const genres = require('./routes/genres');
const express = require('express');
const app = express();

require('./startup/prod')(app);

mongoose.connect('mongodb://localhost/nodestudydb', {
  useNewUrlParser: true
})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB...'));
mongoose.set('useFindAndModify', false);//设置来避开一些deprecationwarning

app.use(express.json()); //需要加这个转Json
//设置路径
app.use('/api/genres', genres);



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));