const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const personRoutes = require('./routes/personRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use('/api', personRoutes);
app.use(errorHandler);

mongoose.connect('mongodb://127.0.0.1:27017/folketingDB')
    .then(() => console.log('MongoDB er tilsluttet!'))
    .catch(err => console.log('MongoDB fejl: ', err));

app.listen(3000, () => console.log('Server er klar på `http://localhost/3000`'));
