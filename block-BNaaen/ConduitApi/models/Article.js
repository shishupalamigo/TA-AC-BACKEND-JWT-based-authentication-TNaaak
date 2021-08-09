let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let slugger = require('slugger');

let Schema = mongoose.Schema;

let articleSchema = new Schema(
  {
    slug: { type: String, require: true, unique: true },
    title: { type: String, require: true },
    description: { type: String },
    body: { type: String },
    tagList: [{ type: String }],
    favorited: [{ type: mongoose.Types.ObjectId }],
    favoritesCount: { type: Number, default: 0 },
    author: { type: Object, require: true },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

articleSchema.pre('save', async function (next) {
  this.slug = slugger(this.title);
  next();
});

articleSchema.methods.displayArticle = function(id = null) {
  console.log(this.favoriteList.includes(id));
  return {
      title: this.title,
      slug: this.slug,
      description: this.description,
      body: this.body,
      tagList: this.tagList,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      favorited: id ? this.favoriteList.includes(id) : false,
      favoritesCount: this.favoritesCount,
      author: this.author.displayUser(id)
  }
}

let Article = mongoose.model('Article', articleSchema);

module.exports = Article;