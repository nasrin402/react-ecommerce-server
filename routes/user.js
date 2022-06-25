const express = require('express')

const router = express.Router();

router.get('/user', (req, res) =>{
    res.json({
        data:'hey u! welcome to user create or update'
    });
});

module.exports = router;