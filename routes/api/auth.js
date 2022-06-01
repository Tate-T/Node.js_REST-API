const express = require('express');

const router = express.Router();

const { userValidation, updateEmailValidation } = require('../../middlevares/validation');

const { authCheck } = require('../../middlevares/authCheck');
const multer = require('multer');
const Jimp = require("jimp");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { User } = require('../../db/usersAuth');
const {
    registration,
    login,
    logout,
    current,
    updateEmail
} = require('../../models/auth');

router.post('/register', userValidation, async (req, res, next) => {
    const userMail = req.body.email
    const existingUser = await User.findOne({ userMail });

    if (existingUser) {
        return res.status(409).json({ message: "Email in use" });
    }

    const user = await registration(req.body);

    res.status(201).json(user);
});

router.post("/login", userValidation, async (req, res, next) => {
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

router.patch("/avatars", multer.single("avatar"), async (req, res, next) => {
    const { description } = req.body;
    const { path: temporaryName, originalname } = req.file;
    const newPathName = path.join(
        process.cwd(),
        `public/avatars/${uuidv4()}_${originalname}`
    );

    Jimp.read(temporaryName, async (err, storeImage) => {
        if (err) throw err;
        storeImage
            .resize(250, 250) // resize
            .quality(60) // set JPEG quality
            .write(newPathName); // save
        await fs.unlink(temporaryName);
    });

    res.json({ description, message: "Файл успешно загружен", status: 200 });
});

router.get("/verify/:verificationToken", async (req, res, next) => {
    const { verificationToken } = req.params;
    const result = await registration(verificationToken);
    if (!result) {
        return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Verification successful" });
});

router.post(
    "/verify",
    updateEmailValidation,
    async (req, res, next) => {
        const { email } = req.body;
        const result = await updateEmail(email);
        if (typeof result === "string")
            return res.status(400).json({ message: result });
        if (result) res.json({ message: "Verification email sent" });
    }
);

module.exports = router;