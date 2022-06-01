const express = require('express');

const router = express.Router();

const { validation } = require('../../middlevares/validation');

const {
    registration,
    login,
} = require('../../models/auth');