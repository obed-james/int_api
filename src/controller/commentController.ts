import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createCommentSchema, options } from '../utils/utils';
import { CommentHistoryInstance } from '../model/commentHistoryModel';
import { PostInstance } from '../model/postModel';

export const createComments = async (req: Request | any, res: Response, next: NextFunction) => {
  const id = uuidv4();

  try {
    const userId = req.user.id;

    const { commentBody, postID, firstName, lastName } = req.body;

    const validatedInput = await createCommentSchema.validate(req.body, options);
    if (validatedInput.error) {
      return res.status(400).json(validatedInput.error.details[0].message);
    }
    const post = await PostInstance.findById(postID);
    if (!post) {
      return res.status(404).json({ message: 'post not found' });
    }
    if (post) {
      const comment = await CommentHistoryInstance.create({
        id: id,
        userId: userId,
        postID: postID,
        commentBody: commentBody,
        firstName,
        lastName,
      });

      const newPost = await PostInstance.findByIdAndUpdate(
        postID,
        {
          $push: { comments: comment },
        },
        { new: true },
      );

      return res.status(201).json({
        message: 'You have successful commented on post',
        comment,
      });
    } else {
      return res.status(400).json({ message: 'Network Error. Comment not successful' });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

// get all comments
export const getAllComments = async (req: Request | any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const allComments = await CommentHistoryInstance.find({ userId });
    if (!allComments) {
      return res.status(404).json({ message: 'No allComments found' });
    }
    return res.status(200).json({ allComments });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};
