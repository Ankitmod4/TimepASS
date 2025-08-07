const Student = require('../Model'); // Adjust path if needed


exports.FindAccordingtparam = async (req, res) => {


     const { rollNumber } = req.params;

  try {
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Student retrieved successfully',
      data: student,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
}
