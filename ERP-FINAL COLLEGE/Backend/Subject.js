const mongoose = require('mongoose');

const StudentFeeSchema = new mongoose.Schema({
   Course:{
    type: String,
    required: true,
    enum: ['BCA', 'BA', 'BCOM', 'BSC']
   },
   Semester:{
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6]
   },
   SubjectName:{
    type: [String], 
    required: true,
   }    
});

module.exports = mongoose.model('Semesters', StudentFeeSchema);
