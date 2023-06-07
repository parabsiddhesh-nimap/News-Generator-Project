const express = require('express');
const router = express.Router();
const {SignUp,SignIn,authCustomer} = require('../controller/customer');

router.post('/signUp', SignUp);

router.get('/SignIn',SignIn);

module.exports = router;