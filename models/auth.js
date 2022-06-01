const { User } = require('../db/usersAuth');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

const registration = async ({ email, password }) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    try {
        const user = new User({
            email,
            password: await bcrypt.hash(password, 10)
        })
        await user.save();

        const msg = {
            to: email,
            from: "tatjana.tarasovych@gmail.com",
            subject: "Please, confirm Your Email!",
            text: `Here is Your verification link - http://127.0.0.1:3000/users/verify/${user.verificationToken}`,
            html: `Here is Your verification <a href=http://127.0.0.1:3000/users/verify/${user.verificationToken}>link</a>`,
        };

        await sgMail.send(msg);

        const newUser = { email: user.email, subscription: user.subscription }
        return newUser

    } catch (err) {
        console.log('err', err.message)
    }
}

const login = async ({ email, password }) => {
    try {
        const findUser = await User.findOne({ email });
        if (!findUser)
            return `No such user ${email}`;
        if (!(await bcrypt.compare(password, findUser.password)))
            return 'Wrong password';

        const token = jwt.sign(
            { _id: findUser._id },
            process.env.JWT_KEY
        );
        await User.updateOne({ _id: findUser._id }, { token });
        const user = { email, subscription: findUser.subscription, token };
        return user
    } catch (err) {
        console.log('err', err.message)
    }
}

const logout = async (userId) => {
    try {
        return await User.updateOne({ _id: userId._id }, { token: null });
    }
    catch (err) {
        console.log('err', err.message)
    }
}

const current = async (email) => {
    try {
        const findUser = await User.findOne({ email });
        const userData = { email: findUser.email, subscription: findUser.subscription };
        return userData
    }
    catch (err) {
        console.log('err', err.message)
    }
}

const updateEmail = async (email) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    try {
        const user = await User.findOne({ email });
        if (!user) return `No user with email ${email}`;
        if (user.verify === true) return "Verification has already been passed";
        const msg = {
            to: email,
            from: "tatjana.tarasovych@gmail.com",
            subject: "Please, confirm Your Email!",
            text: `Here is Your verification link - http://127.0.0.1:3000/users/verify/${user.verificationToken}`,
            html: `Here is Your verification <a href=http://127.0.0.1:3000/users/verify/${user.verificationToken}>link</a>`,
        };

        await sgMail.send(msg);
        return user;
    } catch (error) {
        console.log("error", error.message);
        return false;
    }
}
module.exports = {
    registration, login, logout, current, updateEmail
}