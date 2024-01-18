const mongoose = require("mongoose");
const summarySchema = mongoose.Schema({
    title : {
        type : String,
        required: true,
    },
    summary : {
        type : String,
        required : true,
    },
    keywords : {
        type : [String],
        required : true,
    }
})
const summaryModel = mongoose.model('summary',summarySchema);
module.exports = summaryModel;