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
        // Send the new user's information back to the client
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
        // Send the new user's information back to the client
        res.json(singleUser);
    } catch (err) {
        // Something went wrong
        res.status(500).send(err);
    }
});

router.put('/update/:id', async (req, res) => {
    //console.log('Here for get');
    try {
        const { id } = req.params;
        const updateUser = await User.updateOne({ _id: id}, req.body);
        // Send the new user's information back to the client
        res.json(updateUser);
    } catch (err) {
        // Something went wrong
        res.status(500).send(err);
    }
});

router.delete('/delete/:id', async (req, res) => {
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

module.exports = router;