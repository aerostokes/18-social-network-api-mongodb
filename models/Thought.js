const { Schema, model } = require('mongoose');
const dayjs = require("dayjs");

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280,
    },
    username: {
        type: String,
        required: true,
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
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema]
},{
    toJSON: { 
        getters: true,
        virtuals: true,
    },
});

// Getter to format createdAt
function formatDate(createdAt) {
    return dayjs(createdAt).format("MM/DD/YY HH:mm")
};

thoughtSchema.virtual("reactionCount").get(function() {
    return this.reactions.length;
})

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;