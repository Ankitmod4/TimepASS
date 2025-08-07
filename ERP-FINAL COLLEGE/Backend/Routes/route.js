const express=require('express');
const router=express.Router();


const { createStudent} = require('../Controllers/Create');
const {createStudentFee} =require('../Controllers/CreateFees')
const {Assignment}= require('../Controllers/Assignment');
const { SemesterCreate } = require('../Controllers/SemesterCreate');
const { LoginStudent } = require('../Controllers/Login');
const {LoginAdmin} = require('../Controllers/AdminLogin');
const { FindAccordingtparam } = require('../Controllers/FindAllData');
const {FindUsers} = require('../Controllers/FindUsers');
const { AssignmentName } = require('../Controllers/AssignmentName');
const {updateStudentFee} = require('../Controllers/UpdateFees');
const { uploadPhoto, uploadMiddleware } = require('../Controllers/UploadPhoto');
const upload = require('./middleware/upload');








// Route to create a new student
router.post('/students', upload.single('photo'), createStudent);
router.post('/fees', createStudentFee);
router.post('/assignment', Assignment);
router.post('/semester', SemesterCreate);
router.post('/login', LoginStudent);
router.post('/adminlogin', LoginAdmin);
router.get('/students/:rollNumber', FindAccordingtparam);
router.get('/findUsers', FindUsers);
router.get('/assignment/:studentName', AssignmentName);
router.put('/update/:roll', updateStudentFee);



// GET /api/dashboard/fees
router.get("/dashboard/fees", async (req, res) => {
  try {
    const data = await Student.aggregate([
      {
        $group: {
          _id: null,
          paid: { $sum: "$PayFees" },
          due: { $sum: "$DueFees" },
          discount: { $sum: "$Discount" },
        },
      },
    ]);
    res.json(data[0] || { paid: 0, due: 0, discount: 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch fee stats" });
  }
});

// GET /api/dashboard/assignments
router.get("/dashboard/assignments", async (req, res) => {
  try {
    const submitted = await Student.countDocuments({ Assignment: "Yes" });
    const notSubmitted = await Student.countDocuments({ Assignment: "No" });
    res.json({ submitted, notSubmitted });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch assignment stats" });
  }
});


module.exports = router;