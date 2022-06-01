const { User } = require('../db/usersAuth');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registration = async ({ email, password }) => {
    try {
        const user = new User({
            email,
            password: await bcrypt.hash(password, 10)
        })
        await user.save();
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

module.exports = {
    registration, login, logout, current
}