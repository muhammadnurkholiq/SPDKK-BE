// router
const router = require('express').Router();

// router
const authRouter = require('./auth');
const userRouter = require('./user');

// set router
router.use('/auth', authRouter);
router.use('/user', userRouter);

// export
module.exports = router;
