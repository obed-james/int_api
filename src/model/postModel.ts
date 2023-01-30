import { Schema, model, connect } from 'mongoose';
import { CommentHistoryAttribute } from './commentHistoryModel';
import { userAttributes } from './userModel';

export interface PostAttribute {
  id?: string;
  postTitle?: string;
  postBody?: string;
  postImage?: string;
  userSummary?: string;
  userId?: string;
  date?: string;
  comments?: CommentHistoryAttribute;
  author?: userAttributes;
}

export const PostSchema = new Schema<PostAttribute>({
  postTitle: {
    type: String,
    allowNull: false,
  },

  postBody: {
    type: String,
    allowNull: false,
  },

  postImage: {
    type: String,
    allowNull: false,
  },
  userSummary: {
    type: String,
    allowNull: false,
  },

  userId: {
    type: String,
    allowNull: false,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  date: {
    type: Date,
    default: Date.now(),
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
});

PostSchema.index({ $postTitle: 'text', $userSummary: 'text' });

export let PostInstance = model('posts', PostSchema);
