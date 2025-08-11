const StudentFee = require('../FeesModel');
const Student = require('../Model');

exports.updateStudentFee = async (req, res) => {
  try {
    const { roll } = req.params;
    const { semester, paid, discount, total } = req.body;
     
    // console.log("Updating fee record for roll:", roll);
    // console.log("This one",req.body)
    if (!roll) {
      return res.status(400).json({
        success: false,
        message: "Missing 'roll' parameter",
      });
    }

    // 🔍 Find fee record
    let feeRecord = await StudentFee.findOne({ roll });

    if (!feeRecord) {
      // 📌 If no fee record found, create one
      feeRecord = await StudentFee.create({
        roll,
        semester: semester || '',
        paid: paid || 0,
        discount: discount || 0,
        total: total || 0,
        due: (total || 0) - (discount || 0) - (paid || 0),
        action: ((total || 0) - (discount || 0) - (paid || 0)) <= 0
          ? 'Paid'
          : (paid > 0 ? 'Partial' : 'Unpaid'),
      });
    }

    // ✅ Use current values if not provided
    const updatedPaid = paid !== undefined ? paid : feeRecord.paid;
    const updatedDiscount = discount !== undefined ? discount : feeRecord.discount;
    const updatedTotal = total !== undefined ? total : feeRecord.total;

    // 🔄 Recalculate due & action
    const due = updatedTotal - updatedDiscount - updatedPaid;
    let action = 'Unpaid';
    if (due <= 0) action = 'Paid';
    else if (updatedPaid > 0) action = 'Partial';

    // 🔁 Update in StudentFee collection
    const feeUpdateResult = await StudentFee.updateOne(
      { roll },
      {
        $set: {
          semester,
          paid: updatedPaid,
          discount: updatedDiscount,
          total: updatedTotal,
          due,
          action,
        },
      }
    );

    // 🔁 Update same fields in Student collection
    const studentUpdateResult = await Student.updateOne(
      { rollNumber: roll },
      {
        $set: {
          semester,
          PayFees: updatedPaid,
          Discount: updatedDiscount,
          TotalFees: updatedTotal,
          DueFees: due,
        },
      },
      { upsert: true } // 📌 Create Student if not exists
    );

    return res.status(200).json({
      success: true,
      message: "Fee record updated/created in both collections successfully",
      feeUpdate: feeUpdateResult,
      studentUpdate: studentUpdateResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update fee record",
      error: error.message,
    });
  }
};
