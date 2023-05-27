const mongoose = require("mongoose");
const dayjs = require("dayjs")

const thoughtSchema = new mongoose.Schema({
    thoughtText: {
        type: String, 
        required: true, 
        maxLength: 280,
    },
    createdAt: {
        type: Date, 
        default: Date.now, 
        required: true, 
        get: formatDate
    },
});

//
function formatDate(createdAt) {
    return dayjs(createdAt).format("MM/DD/YY HH:mm")
}

const User = mongoose.model("User", thoughtSchema);

module.exports = User;