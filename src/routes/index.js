// router
const router = require('express').Router();

// router
const authRouter = require('./auth');

// set router
router.use('/auth', authRouter);

// export
module.exports = router;
