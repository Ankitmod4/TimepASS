const Status = require('../StudentSchema');



exports.AssignmentName = async (req, res) => {
    try{
        const {studentName}=req.params;
        const data=await Status.find({studentName:studentName});
        console.log(data);
        if(!data || data.length === 0){
            return res.status(404).json({
                message: 'No assignments found for this student'
                });
                }
        res.status(200).json({
            message: 'Assignments retrieved successfully',
            data:data
        });
    }
    catch(err){
        
        res.status(500).json({
            message: 'Error retrieving assignments',
            error: err.message
        });


    }

}