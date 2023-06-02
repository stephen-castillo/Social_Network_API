// routes/userRoutes.js
const router = require('express').Router();
const {User, Thought} = require('../../models');

router.post('/create', async (req, res) => {
    try {
        const { thoughtText, username, userId } = req.body;

        const newThought = new Thought({
            thoughtText,
            username
        });
        await newThought.save();
        //console.log(newThought._id);
        const userUpdate = await User.findOneAndUpdate(
            { _id: userId },
            { $push: { thoughts: newThought._id } },
            { new: true }
        );
        console.log(userUpdate);
        res.json(newThought);
    } catch (err) {
        res.status(500).send(err);
    }
});


router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find()
        .populate({
            path: "reactions",
            select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });

        res.json(thoughts);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const thought = await Thought.findById({_id: id})
        .populate({
            path: "reactions",
            select: "-__v",
        })
        .select("-__v");
        res.json(thought);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedThought);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedThought = await Thought.findByIdAndDelete(req.params.id);
        res.json(deletedThought);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/addReaction/:thoughtId', async (req, res) => {
    try {
        const { thoughtId } = req.params;

        // Add a friend to the user's friend list
        const updatedReaction = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true, runValidators: true }
        );

        // Check if the user was found and updated
        if (!updatedReaction) {
            return res.status(404).json({ message: "No thought with this id" });
        }

        res.json(updatedReaction);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/deleteReaction/:thoughtId/:reactionId', async (req, res) => {
    try {
        const { thoughtId, reactionId } = req.params;

        // Remove a friend from the user's friend list
        const updatedReaction = await Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $pull: { reactions: reactionId } },
            { new: true, runValidators: true }
        );

        // Check if the user was found and updated
        if (!updatedReaction) {
            return res.status(404).json({ message: "No reaction with this id" });
        }

        res.json(updatedReaction);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;