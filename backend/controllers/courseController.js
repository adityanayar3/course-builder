const Course = require('../models/course.js');
const Module = require('../models/module.js');
const Lesson = require('../models/lesson.js');
const courseCreator = require('../services/geminiService.js');

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const { userId, creator } = req.query;
        const filter = userId || creator ? { creator: userId || creator } : {};
        const courses = await Course.find(filter).populate('modules', 'title');
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate({
            path: 'modules',
            select: 'title lessons',
            populate: { path: 'lessons', select: 'title content isEnriched' }
        });
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
        const creator = req.body?.creator || req.headers['x-user-id'] || '21212';

        if (!topic) {
            return res.status(400).json({
                success: false,
                message: 'Course title or topic is required'
            });
        }

        const generatedCourse = await courseCreator.generateCourse(topic);
        const savedCourse = await Course.create({
            title: generatedCourse.title,
            description: generatedCourse.description,
            tags: generatedCourse.tags || [],
            creator,
            modules: []
        });

        const moduleIds = [];

        for (const generatedModule of generatedCourse.modules || []) {
            const savedModule = await Module.create({
                title: generatedModule.title,
                course: savedCourse._id,
                lessons: []
            });

            const lessons = await Lesson.insertMany(
                (generatedModule.lessons || []).map((lessonTitle) => ({
                    title: lessonTitle,
                    content: [],
                    module: savedModule._id
                }))
            );

            savedModule.lessons = lessons.map((lesson) => lesson._id);
            await savedModule.save();
            moduleIds.push(savedModule._id);
        }

        savedCourse.modules = moduleIds;
        await savedCourse.save();

        const populatedCourse = await Course.findById(savedCourse._id).populate({
            path: 'modules',
            populate: { path: 'lessons' }
        });

        res.status(201).json({ success: true, data: populatedCourse });
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
