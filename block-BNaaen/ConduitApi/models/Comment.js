let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let slugger = require('slugger');

let Schema = mongoose.Schema;

let commentSchema = new Schema(
  {
    author: { type: Object, require: true },
    body: { type: String, require: true },
    article: { type: mongoose.Types.ObjectId, ref: 'Article' },
  },
  { timestamps: true }
);

commentSchema.methods.displayComment = function(id = null) {
  return {
      id: this.id,
      body: this.body,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      author: this.author.displayUser(id)
  }
}

let Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;