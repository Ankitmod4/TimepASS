let mongoose = require('mongoose');

let DbConnect=() => {
    mongoose.connect("mongodb+srv://erpjupiter:Billgates%40Jupiter@cluster0.peh1xhz.mongodb.net/erp", {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(() => {
        console.log("DataBase Connected"); 
        
    }
    ).catch((err) => { 
        console.log(err);
        console.error(err.message);
        process.exit(1); 
    }
    )
}
module.exports = DbConnect;