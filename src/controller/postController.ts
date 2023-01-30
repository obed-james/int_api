import express, { Request, Response, NextFunction } from 'express';
import { createPostSchema, options } from '../utils/utils';
import sendMails from './FILE/email/sendMails';
import { userInstance } from '../model/userModel';
import sampleImages from './FILE/medicalImages/sample';

import { PostInstance } from '../model/postModel';
export async function createPost(req: Request | any, res: Response, next: NextFunction) {
  try {
    const userID = req.user.id;
    const ValidatePost = await createPostSchema.validateAsync(req.body, options);
    if (ValidatePost.error) {
      return res.status(400).json({
        status: 'error',
        message: ValidatePost.error.details[0].message,
      });
    }

    const record = await PostInstance.create({
      postTitle: req.body.postTitle,
      postBody: req.body.postBody,
      postImage: req.body.postImage || sampleImages[Math.floor(Math.random() * sampleImages.length)],
      userSummary: req.body.userSummary,
      userId: userID,
    });
    if (record) {
      const allUsers = await userInstance.find({ isVerified: true, notify: true });
      const emails = allUsers.map((user) => user.email);

      const message = `A new post has been created by ${req.user.occupation} ${req.user.name} with the title: <b>${req.body.postTitle}</b>`;
      sendMails.postNotification(emails, message);

      return res.status(201).json({
        status: 'success',
        message: 'Post created successfully',
        data: record,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}
export async function getAllUserPost(req: Request | any, res: Response, next: NextFunction) {
  try {
    const userId = req.user.id;
    const allPost = await PostInstance.findById({
      userId,
    }).populate('comments');
    if (allPost) {
      return res.status(200).json({
        status: 'success',
        message: 'all post retrieved successfully',
        data: allPost,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}
export async function getAllPost(req: Request | any, res: Response, next: NextFunction) {
  try {
    const allPost = await PostInstance.find({}).populate('comments').sort({ createdAt: -1 }).limit(10).exec();
    if (allPost) {
      return res.status(200).json({
        status: 'success',
        message: 'all post retrieved successfully',
        data: allPost,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}
export async function deletePost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const post = await PostInstance.findByIdAndDelete({
      id,
    });
    if (post) {
      return res.status(200).json({
        status: 'success',
        message: 'Post deleted successfully',
      });
    }
    return res.status(404).json({
      status: 'error',
      message: 'Post not found',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}
export async function getUserPost(req: Request | any, res: Response, next: NextFunction) {
  try {
    const userID = req.user.id;
    const post = await PostInstance.find({
      where: { userId: userID },
    });
    if (post) {
      return res.status(200).json({
        status: 'success',
        message: 'Post retrieved successfully',
        data: post,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}

export async function getSinglePost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const post = await PostInstance.findById(id).populate('comments').sort({ createdAt: -1 }).exec();

    if (post) {
      return res.status(200).json({
        status: 'success',
        message: 'Post retrieved successfully',
        data: post,
      });
    }
    return res.status(404).json({
      status: 'error',
      message: 'Post not found',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'internal server error',
    });
  }
}
// export async function updatePost(req: Request, res: Response, next: NextFunction) {
//   try {
//     const {id} = req.params.id;
//     const post = await PostInstance.findByIdAndUpdate {
//       id,
//       req.body,
//     };
//     if (post) {
//       return res.status(200).json({
//         status: 'success',
//         message: 'Post updated successfully',
//         data: post,
//       });
//     }
//     return res.status(404).json({
//       status: 'error',
//       message: 'Post not found',
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 'error',
//       message: 'internal server error',
//     });

//   }
// }
