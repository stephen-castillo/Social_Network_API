// routes/userRoutes.js
const router = require('express').Router();
const User = require('../../models/User');

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
        const userList = await User.find();
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
        const singleUser = await User.findById(id);
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

module.exports = router;