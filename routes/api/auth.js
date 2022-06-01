const express = require('express');

const router = express.Router();

const { validation } = require('../../middlevares/validation');

const { authCheck } = require('../../middlevares/authCheck');

const { User } = require('../../models/auth');
const {
    registration,
    login,
    logout,
    current
} = require('../../models/auth');

router.post('/register', validation, async (req, res, next) => {
    const userMail = req.body.email
    const existingUser = await await User.findOne({ userMail });

    if (existingUser) {
        return res.status(409).json({ message: "Email in use" });
    }

    const user = await registration(req.body);

    res.status(201).json(user);
});

router.post("/login", validation, async (req, res, next) => {
    const result = await login(req.body);
    if (!result)
        return res.status(401).json({ message: 'Email or password is wrong' });
    res.status(200).json({ user: result });
});

router.get("/logout", authCheck, async (req, res, next) => {
    const result = await logout(req.id);
    if (!result)
        return res.status(401).json({ message: 'Not authorized' });
    res.status(204).json({ message: "No Content" });
});

router.get("/current", authCheck, async (req, res, next) => {
    const result = await current(req.id);
    if (!result)
        return res.status(401).json({ message: 'Not authorized' });
    res.status(200).json({ user: result });
});

module.exports = router;