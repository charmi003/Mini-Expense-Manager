//Require the library
const mongoose = require('mongoose');

//Connect to the database
mongoose.connect('mongodb://localhost/expense_manager_db', {useNewUrlParser: true, useUnifiedTopology: true});

//Acquire the connection
const db=mongoose.connection;

//error
db.on('error', console.error.bind(console, 'connection error:'));

//up and running
db.once('open', function() {
   console.log("Successfully connected to the database!!")
});

