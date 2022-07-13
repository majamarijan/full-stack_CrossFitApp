const express = require('express');
const app = express();
const v1Router = require('./src/v1/routes/workoutRoutes.js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();
const PORT = process.env.PORT || 3000;
const app_root = path.join(__dirname, 'public');


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(app_root))
app.get('/', (req,res,next)=> {
  res.sendFile('index.html', {root:app_root})
});

app.use('/api/v1/workouts', v1Router);


app.listen(PORT, ()=> console.log('Server is opened...'))