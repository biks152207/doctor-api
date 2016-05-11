'use strict';

import mongoose from 'mongoose';

var PostSchema = new mongoose.Schema({
  post: { type: String, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Login', required: true },
  suggestion: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comments'}],
  created_at: { type: Date, default: Date.now}
});

export default mongoose.model('Post', PostSchema);
