const Student = require('../Model');

const createStudent = async (req, res) => {
  try {
    // Parse stringified JSON from 'data' field
    const {
      rollNumber,
      firstName,
      lastName,
      course,
      semester,
      subjects,
      TotalFees,
      Discount,
      DueFees,
      PayFees,
      Assignment
    } = JSON.parse(req.body.data); // 👈 FIXED

    const generatePassword = (firstName) => {
      const cleanName = firstName.trim().toLowerCase(); 
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      return `${cleanName}${randomDigits}`;
    };

    // These are already arrays/objects from JSON.parse above
    const parsedSubjects = subjects;
    const parsedAssignment = Assignment;

    const newStudent = await Student.create({
      photo: req.file?.path || '', // ✅ safe check
      rollNumber,
      firstName,
      lastName,
      course,
      semester,
      Password: generatePassword(firstName),
      subjects: parsedSubjects,
      TotalFees,
      Discount,
      DueFees,
      PayFees,
      Assignment: parsedAssignment
    });

    res.status(201).json({
      message: 'Student created successfully',
      data: newStudent
    });

  } catch (error) {
    console.log(error); // ✅ helpful for debugging
    if (error.code === 11000 && error.keyPattern?.rollNumber) {
      return res.status(409).json({ message: 'Roll number already exists' });
    }
    res.status(500).json({ message: 'Failed to create student', error: error.message });
  }
};

module.exports = {
  createStudent
};
