const mongoose = require('mongoose');

let studentSchema = new mongoose.Schema({
    photo: {
        type: String,  // Can be a URL or base64 string
        required: true 
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    subjects: {
        type: [String],  // Array of subject names
        required: true
    },
    TotalFees: {
        type:Number,  
        required: true
    },
    Discount:{
        type:Number,

    },
    DueFees:{
        type:Number,
         
    },
    PayFees:{
        type:Number,
    },
 Assignment: {
  type: Map,
  of: String,
  default: {}
},
    Password:{
        type:String,
        required: false
     
    },
   
});

module.exports = mongoose.model('Student', studentSchema);
