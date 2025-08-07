const Semesters = require('../Subject');

exports.SemesterCreate = async (req, res) => {
    try {
        const {
            Course,
            Semester,
            SubjectName
        } = req.body;

        // Validation (optional but good practice)
        if (!Course || !Semester || !SubjectName) {
            return res.status(400).json({
                success: false,
                message: "All fields (Course, Semester, SubjectName) are required."
            });
        }

        const data = await Semesters.create({
            Course,
            Semester,
            SubjectName
        });

        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            data: data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};
