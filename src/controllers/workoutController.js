const service = require('../services/workoutService.js');
const data = require('../database/exercises.json');

const getAllWorkouts = (req,res,next) => {
  const allWorkouts = service.getAllWorkouts();
  res.json(allWorkouts);
}

const countDocuments = (req,res,next)=> {
  const numberOfDocuments = service.countDocuments();
  res.json(numberOfDocuments);
}

const getWorkoutsByLetter = (req,res,next)=> {
  const firstLetter = req.params.firstLetter;
  const letterGroup = service.getWorkoutsByLetter(firstLetter);
  res.json(letterGroup)
}

const sortByCategory = (req,res,next)=> {
  const category = req.params.category;
  console.log(req.params)
  const categoryGroup = service.sortByCategory(category);
  //limit list with filter
  res.json(categoryGroup)
}

const getOneWorkout = (req,res,next)=> {
  const id = req.params.workoutid;
  const workout = service.getOneWorkout(id);
  res.json(workout)
}

const createNewWorkout = (req,res,next)=> {
  const data = req.body;
  const missingParam = !data.name || !data.mode || !data.equipment || !data.exercises || !data.trainerTips;
  if(missingParam) {
    var params = ['name','mode','equipment', 'exercises', 'trainerTips'];
    var missing = params.filter(p => !data[p]);
    res.json({message: 'Please include missingParam ' + missing})
  }
  else {
    const createWorkout = service.createNewWorkout(data);
    res.json(createWorkout)
  }
 
}

const updateOneWorkout = (req,res,next)=> {
  const updateWorkout = service.updateOneWorkout();
  res.send('update one controller')
}

const deleteOneWorkout = (req,res,next)=> {
  service.deleteOneWorkout();
  res.send('delete one controller')
};

module.exports = {
  getAllWorkouts,
  getOneWorkout,
  createNewWorkout,
  updateOneWorkout,
  deleteOneWorkout,
  countDocuments,
  getWorkoutsByLetter,
  sortByCategory
}