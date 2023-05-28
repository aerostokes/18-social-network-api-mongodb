const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const { User } = require("../../models");

// Routes for /api/users

// Post new User
router.post("/", (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,

    }).then(userObj => {
        res.json({ msg: "Successfully created", userObj })
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    });
});

// Get all Users
router.get("/", (req, res) => {
    User.find({})
    .select('-__v')
    .then(usersArr => {
        if (usersArr.length === 0) {
            return res.status(404).json({ msg: "No Users found" });
        } else {
            return res.json(usersArr);
        };
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    });
});

// Get User by id
router.get("/:id", (req, res) => {
    User.findOne({ _id: req.params.id})
    .select("-__v")
    .populate({path: "thoughts", select: "-__v" })
    .populate({path: "friends", select: "-__v" })
    .then(userObj => {
        if (!userObj) {
            return res.status(404).json({ msg: "UserId not found" });
        } else {
            return res.json(userObj);
        };
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    });
});


// Update User by id
router.put("/:id", (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.id }, 
        req.body, 
        { new: true }
    ).then(userObj => {
        return res.json({ msg: "Successfully updated", user: userObj });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    });
});


// Delete User by id 
router.delete("/:id", (req, res) => {
    User.findOneAndDelete({
        _id: req.params.id,
    }).then(userObj => {
        if (!userObj) {
            return res.status(404).json({ msg: "UserId not found" });
        } else {
            return res.json({ msg: `Successfully deleted ${userObj}` });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    });
});



// Add a "friendship"
router.post("/:userId/friends/:friendId", async (req, res) => {
    try {
        const userObj = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true },
        )
        await User.findOneAndUpdate(
            { _id: req.params.friendId },
            { $addToSet: { friends: req.params.userId } },
            { new: true },
        )
        return res.json({ msg: "Successfully added new friendship: ", User: userObj})
    } catch(err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    }
});



// Delete a "friendship"
router.delete("/:userId/friends/:friendId", async (req, res) => {
    try {
        const userObj = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true },
        )
        await User.findOneAndUpdate(
            { _id: req.params.friendId },
            { $pull: { friends: req.params.userId } },
            { new: true },
        )
        return res.json({ msg: "Successfully removed friendship: ", User: userObj})
    } catch(err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    }
});


module.exports = router;
