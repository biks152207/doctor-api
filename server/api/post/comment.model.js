import 'mongoose' from 'mongoose';

var commentSchema = new mongoose.Schema({
  commentText: { type: String, required: true},
  userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Login', required: true}
})
