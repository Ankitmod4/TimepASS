const Student = require('../Model'); // Adjust path if needed



exports.FindUsers = async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).json({
            message: 'Students retrieved successfully',
            data: students
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve students', error: error.message });
    }
}