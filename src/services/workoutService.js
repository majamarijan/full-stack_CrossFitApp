// contain business logic and comunicate with DB Layer
// logic: transformig data structures
const Workout = require('../database/Workout.js');
const {v4: uuid} = require('uuid');

const getAllWorkouts = () => {
  const allWorkouts = Workout.getAllWorkouts();
  return allWorkouts;
}

const countDocuments = ()=> {
  const numberOfDocuments = Workout.countDocuments();
  const result = {length: numberOfDocuments}
  return result;
}

const  getWorkoutsByLetter = (firstLetter)=> {
  const workoutsGroup = Workout.getWorkoutsByLetter(firstLetter);
  return workoutsGroup
}

const sortByCategory = (category) => {
  const categoryGroup = Workout.sortByCategory(category);
  return categoryGroup;
}

const getOneWorkout = (id) => {
  const workout = Workout.getOneWorkout(id);
  return workout;
}



const createNewWorkout = (data) => {
  const workoutToInsert = {
    ...data,
    id: uuid(),
    createdAt: new Date().toLocaleString('en-US', {timeZone: 'UTC'}),
    updatedAt: new Date().toLocaleString('en-US', {timeZone: 'UTC'}),
  };
  const createdWorkout = Workout.createNewWorkout(workoutToInsert);
  return createdWorkout;
}

const updateOneWorkout = () => {
  return
}

const deleteOneWorkout = () => {
  return
}

module.exports = {
  getAllWorkouts,
  getOneWorkout,
  createNewWorkout,
  updateOneWorkout,
  deleteOneWorkout,
  countDocuments,
  getWorkoutsByLetter
}