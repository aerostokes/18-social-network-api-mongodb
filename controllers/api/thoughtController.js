const express = require("express");
const router = express.Router();
const db = require("../../config/connection");
const { Thought, User } = require("../../models");

// Routes for /api/thoughts

// Post new Thought
router.post("/", async (req, res) => {
    try {
        const foundUser = await User.findOne( { _id: req.body.userId });
        if (!foundUser) {
            return res.status(404).json( {msg: "UserId not found" })
        } else {
            const thoughtObj = await Thought.create({ 
                thoughtText: req.body.thoughtText,
                username: foundUser.name
            });
            await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thoughtObj._id } },
                { new: true },
                );
            return res.json( { thoughtObj })
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    }
});

// Get all Thoughts
router.get("/", (req, res) => {
    Thought.find({}).then(thoughtArr => {
        if (thoughtArr.length === 0) {
            return res.status(404).json({ msg: "No Thoughts here" });
        } else {
            return res.json(thoughtArr);
        };
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    });
});

// Get Thought by ID
router.get("/:id", (req, res) => {
    Thought.findOne({ _id: req.params.id }).then(thoughtObj => {
        if (!thoughtObj) {
            return res.status(404).json({ msg: "No Thoughts here" });
        } else {
            return res.json(thoughtObj);
        };
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    });
});

// Update Thought by id
router.put("/:id", (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.id }, 
        req.body, 
        { new: true }
    ).then(thoughtObj => {
        return res.json({ msg: "Successfully updated", thought: thoughtObj });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    });
});

// Delete Thought by id 
router.delete("/:id", (req, res) => {
    Thought.findOneAndDelete({
        _id: req.params.id,
    }).then(thoughtObj => {
        if (!thoughtObj) {
            return res.status(404).json({ msg: "ThoughtId not found" });
        } else {
            return res.json({ msg: `Successfully deleted ${thoughtObj}` });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    });
});


// Add a reaction
router.post("/:thoughtId/reactions", async (req, res) => {
    try {
        const thoughtObj = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: {
                reactionBody: req.body.reactionBody,
                username: req.body.username
            } } },
            { new: true },
        )
        return res.json({ msg: "Successfully added new reaction: ", thought: thoughtObj})
    } catch(err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    }
});


// Delete a reaction
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
    try {
        const thoughtObj = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { 
                reactions: { _id: req.params.reactionId }
            }},
            { new: true },
        )
        console.log(thoughtObj)
        return res.json({ msg: "Successfully removed reaction: ", Thought: thoughtObj})
    } catch(err) {
        console.log(err);
        res.status(500).json({ msg: "Error Occurred", err });
    }
});


module.exports = router;


