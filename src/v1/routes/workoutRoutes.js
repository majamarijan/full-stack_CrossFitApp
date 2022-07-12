const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/workoutController.js');

router.get('/', ctrl.getAllWorkouts);

router.get('/length', ctrl.countDocuments);

router.get('/:firstLetter', ctrl.getWorkoutsByLetter);

router.get('/category/:category', ctrl.sortByCategory)

router.get('/workout/:workoutid', ctrl.getOneWorkout);

router.post('/', ctrl.createNewWorkout);

router.patch('/:workoutid', ctrl.updateOneWorkout);

router.delete('/:wodkoutid', ctrl.deleteOneWorkout)


module.exports = router;