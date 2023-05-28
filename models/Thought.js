const { Schema, model } = require('mongoose');
const dayjs = require("dayjs")

const thoughtSchema = new Schema({
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
},{
    toJSON: { 
        getters: true,
        virtuals: true,
    },
});

//
function formatDate(createdAt) {
    return dayjs(createdAt).format("MM/DD/YY HH:mm")
}

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;