import express from 'express';
import {
  registerUser,
  updateUser,
  forgetPassword,
  resetPassword,
  userLogin,
  verifyUser,
  singleUser,
  allUsers,
  resendVerificationLink,
  getUserPost,
  allCommentOnPost,
  deleteUser,
  uploadImage,
} from '../controller/userController';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

//Routes
router.post('/register', registerUser);
router.get('/verify/:token', verifyUser);
router.post('/login', userLogin);
router.post('/forgot-password', forgetPassword);
router.patch('/update/', auth, updateUser);
router.put('/update-admin/', adminAuth, updateUser);
router.patch('/reset-password/:token', resetPassword);
router.patch('/resend-verification', resendVerificationLink);
router.get('/user-post/:id', auth, getUserPost);
router.get('/all-comment-on-post/:id', auth, allCommentOnPost);
router.get('/single-user/:id', singleUser);
router.get('/all-users', adminAuth, allUsers);
router.delete('/delete-user/:id', adminAuth, deleteUser);
router.patch('/upload-image', uploadImage);
export default router;
