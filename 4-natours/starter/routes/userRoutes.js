const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.patch(
  '/deactivateMe',
  authController.protect,
  userController.deactivateMe
);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// router.param('id', userController.checkId);

router.route('/').get(userController.getAllUsers);
//   .post(userController.checkBody, userController.createUser);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .put(userController.updateUserPut)
//   .patch(userController.updateUserPatch)
//   .delete(userController.deleteUser);

module.exports = router;
