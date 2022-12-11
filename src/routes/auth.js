// router
const router = require('express').Router();

// controllers
const auth = require('../controllers/auth');

// middlewares
const { authentication } = require('../middlewares/authentication');

// routes
// router.post('/register', authentication, auth.register);
router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/register', authentication, auth.checkAuth);

// export
module.exports = router;
