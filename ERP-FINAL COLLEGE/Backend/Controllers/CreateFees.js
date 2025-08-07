 const StudentFee = require('../FeesModel');

// ✅ CREATE Student Fee Record
const createStudentFee = async (req, res) => {
  try {
    const { student, roll, semester, total, discount = 0, paid = 0 } = req.body;

if (!student  || !semester || !total) {
  return res.status(400).json({
    success: false,
    message: 'Missing required fields: student, course, semester, or total'
  });

    }

    // 💰 Calculate due and action
    const due = total - discount - paid;
    let action = 'Unpaid';

    if (due <= 0) {
      action = 'Paid';
    } else if (paid > 0) {
      action = 'Partial';
    }

    // 📦 Create Fee Record
    const newFee = await StudentFee.create({
      student,
      roll,
      semester,
      total,
      discount,
      paid,
      due,
      action,
    });

    res.status(201).json({
      success: true,
      message: 'Student fee record created successfully',
      data: newFee,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create fee record',
      error: error.message,
    });
  }
};

module.exports = { createStudentFee };
