const Status = require('../StudentSchema');

// 🔹 Create Assignment Status for Multiple Subjects
exports.Assignment = async (req, res) => {
  try {
    const { studentName, semester, course, assignments } = req.body;

    // Validate all statuses
    const validStatuses = ['Submitted', 'Not Submitted'];
    const invalid = assignments.some(
      (a) => !a.subject || !validStatuses.includes(a.status)
    );

    if (invalid) {
      return res.status(400).json({
        message: 'Each subject must have a valid status: Submitted or Not Submitted',
      });
    }

    const newStatus = await Status.create({
      studentName,
      semester,
      course, // ✅ Add course here
      assignments,
    });

    res.status(201).json({
      message: 'Assignment status record created successfully',
      data: newStatus,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create status record',
      error: error.message,
    });
  }
};
