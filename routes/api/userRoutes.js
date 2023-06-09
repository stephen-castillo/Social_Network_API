// routes/userRoutes.js
const router = require('express').Router();
const { User, Thought}  = require('../../models');

router.post('/create', async (req, res) => {
  try {
    const { username, email } = req.body;
    const newUser = new User({ username, email });
    // Save the user
    await newUser.save();
    // Send the new user's information back to the client
    res.json(newUser);
  } catch (err) {
    // Something went wrong
    res.status(500).send(err);
  }
});

router.get('/', async (req, res) => {
    //console.log('Here for get');
    try {
        const userList = await User.find({})
        .populate({
            path: "friends",
            select: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });
        //console.log(userList);
        // Send the userlist information back to the client
        res.json(userList);
    } catch (err) {
        // Something went wrong
        res.status(500).send(err);
    }
});

router.get('/find/:id', async (req, res) => {
    //console.log('Here for get');
    try {
        const { id } = req.params;
        const singleUser = await User.findById({_id: id})
        .populate({
            path: "thoughts",
            select: "-__v",
        })
        .populate({
        path: "friends",
        select: "-__v",
        })
        .select("-__v");
        //console.log(singleUser);
        // Send the user's information back to the client
        res.json(singleUser);
    } catch (err) {
        // Something went wrong
        res.status(500).send(err);
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Update the user and return the updated document
        const updateUser = await User.findOneAndUpdate({ _id: id }, req.body, { new: true });

        // If no user is found by the given id
        if (!updateUser) {
            return res.status(404).json({ message: 'No user found with this id!' });
        }

        // Send the updated user's information back to the client
        res.json(updateUser);
    } catch (err) {
        // Something went wrong
        res.status(500).send(err);
    }
});


router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the user
        const deletedUser = await User.findByIdAndDelete(id);
        //console.log(deletedUser);
        // Send the deletion confirmation back to the client
        res.json(deletedUser);
    } catch (err) {
        // Something went wrong
        res.status(500).send(err);
    }
});

router.put('/addFriend/:userId/:friendId', async (req, res) => {
    try {
        const { userId, friendId } = req.params;

        // Add a friend to the user's friend list
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { friends: friendId } },
            { new: true, runValidators: true }
        );

        // Check if the user was found and updated
        if (!updatedUser) {
            return res.status(404).json({ message: "No user with this id" });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});




router.put('/deletefriend/:userId/:friendId', async (req, res) => {
    try {
        const { userId, friendId } = req.params;

        // Remove a friend from the user's friend list
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $pull: { friends: friendId } },
            { new: true }
        );

        // Check if the user was found and updated
        if (!updatedUser) {
            return res.status(404).json({ message: "No user with this id" });
        }

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;