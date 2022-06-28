const Router = require('express')
const router = new Router()
const userConrtroller = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', userConrtroller.register);
router.post('/login', userConrtroller.login);
router.get('/auth', authMiddleware, userConrtroller.check)
router.get('/profile/:id', userConrtroller.getUser);
router.put('/profile/:id', userConrtroller.updateUser);
router.delete('/profile/:id', userConrtroller.deleteUser);
router.get('/profiles', userConrtroller.getAllUsers);

module.exports = router