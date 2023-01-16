const express = require("express");
const controller = require('../controllers/userController');

const router = express.Router();

router.post('/user', controller.signUp);

router.post('/user/login', controller.login);

router.get('/user', controller.userDetails)

module.exports = router
