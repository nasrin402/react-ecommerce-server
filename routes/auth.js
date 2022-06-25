const express = require('express')

const router = express.Router();
;
//middlewares
const {authCheck, adminCheck} = require("../middlewares/auth");

//controllers
const {createOrUpdateUser, currentUser} = require('../controllers/auth');

router.post('/create-or-update-auth',authCheck, createOrUpdateUser);
router.post('/current-user',authCheck, currentUser);
router.post('/current-admin',authCheck, adminCheck, currentUser);

module.exports = router;