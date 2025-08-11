const Student = require('../Model'); // Adjust path if needed


exports.SubjectUpdate = async (req, res) => {


     const {course,semester,subjects}=req.body;

  try {
    const student = await Student.findOne({ course, semester });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const data=await Student.updateOne(
        { course, semester },
        { $set: { subjects } }
    );


    res.status(200).json({
      message: 'Student retrieved successfully',
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
}
