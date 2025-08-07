const Student = require('../Model'); // Adjust path if needed

exports.LoginStudent = async (req, res) => {

    try{
        const { rollNumber, Password } = req.body;
        console.log(rollNumber, Password);
        const student = await Student.findOne({ rollNumber: rollNumber , Password: Password });
        if (!student) {
            return res.status(404).json({ message: 'Student not found or incorrect password' });
        }
        res.status(200).json({
            message: 'Login successful',
            data: {
rollNumber: student.rollNumber,
photo: student.photo,
                firstName: student.firstName,
                lastName: student.lastName,
                course: student.course,
                semester: student.semester,
                subjects: student.subjects,
                TotalFees: student.TotalFees,
                Discount: student.Discount,
                PaidFees: student.PayFees,
                DueFees: student.DueFees,
                Assignment: student.Assignment
                }
            });




    }

    catch(error){
    res.status(500).json({ message: 'Failed to login student', error: error.message });
    }


}                