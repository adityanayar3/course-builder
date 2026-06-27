const Course = require('../models/course.js');
const courseCreator = require('../services/geminiService.js');

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const { userId, creator } = req.query;
        const filter = userId || creator ? { creator: userId || creator } : {};
        const courses = await Course.find(filter);
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const topic = req.body?.topic || req.body?.title;
        console.log(req.body);
        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Course title or topic is required'
            });
        }

        const course = await courseCreator.generateCourse(topic);
        //await Course.create(course);
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete course
exports.deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
