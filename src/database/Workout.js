// collection of methods for DB
const DB = require('./exercises.json');
const {saveToDatabase} = require('./utils.js');
const {v4:uuid} = require('uuid');

const getAllWorkouts = ()=> {
  return DB.exercises;
}

const createIDS = ()=> {
  DB.exercises.map(e => e.id = uuid());
  console.log(DB.exercises.length)
  saveToDatabase(DB)
}

const countDocuments = ()=> {
  return DB.exercises.length;
}

const getWorkoutsByLetter = (firstLetter)=> {
  const workoutsGroup = DB.exercises.filter(e => e.name[0].toLowerCase() === firstLetter.toLowerCase());
  if(workoutsGroup.length > 0) {
    return workoutsGroup;
  }else {
    return {message: 'No workout found!'}
  }
}

const sortByCategory = (category) => {
  const categoryGroup = DB.exercises.filter(e => e.category === category);
  return categoryGroup
}

const getOneWorkout = (id) => {
  const workout = DB.exercises.find(x => x.id === id);
  if(!workout) {
    return {message: 'No workout found!'}
  }else {
    return workout;
  }
}

const createNewWorkout = (newWorkout)=> {
  const isAdded = DB.exercises.findIndex(w => w.name === newWorkout.name) > -1;
  if(isAdded) {
    return {message: 'Already added'}
  }else{
    DB.exercises.push(newWorkout);
    saveToDatabase(DB);
    return newWorkout;
  }
}

module.exports = {
  getAllWorkouts,
  createNewWorkout,
  getOneWorkout,
  countDocuments,
  getWorkoutsByLetter,
  sortByCategory,
  createIDS
}