const express = require('express');

const router = express.Router();
const courseController = require('../controllers/courseController');

// POST - Create a new course
router.post('/generate',courseController.createCourse);

// GET - Retrieve all courses
router.get('/', courseController.getAllCourses);

// GET - Retrieve course by ID
router.get('/:id', courseController.getCourseById);

module.exports = router;
