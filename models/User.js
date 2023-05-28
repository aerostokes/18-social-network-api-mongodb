const { Schema, model } = require('mongoose');
// const { Thought } = require("./Thought");

const userSchema = new Schema({
    name: {
        type: String, 
        unique: true, 
        required: true, 
        trim: true,
    },
    email: {
        type: String, 
        unique: true, 
        required: true, 
        validate: {
            validator: function(v) {
              return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z]{2,6})$/i.test(v);
            },
            message: `Not a valid email type`
          },
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Thought",
        },
    ],
    friends: [ 
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
},
{
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
  id: false,
});

userSchema.virtual("friendCount").get(function() {
    return this.friends.length;
});

// userSchema.virtual("friends", {
//     ref: "Friend",
//     localField: "_id",
//     foreignField: ""

// })

const User = model("User", userSchema);

module.exports = User;