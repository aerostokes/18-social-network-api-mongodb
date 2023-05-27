const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
});

const User = mongoose.model("User", userSchema);

module.exports = User;