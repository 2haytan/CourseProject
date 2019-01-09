const cloudinary = require('cloudinary')
const fs = require('fs')
const Article = require('../models/Article');

exports.index = (req, res) => {
  res.render('articles');
};

function saveArticle(obj) {
  new Article(obj).save((err, article) => {
    if (err)
      res.send(err)
    else if (!article)
      res.send(400)
    else {
      return article.addAuthor(obj.author).then((_article) => {
        return res.send(_article)
      })
    }
    next()
  })
};

exports.postArticle = (req, res) => {
  if (req.files) {
    cloudinary.uploader.upload(req.files.image.path, (result) => {
      var obj = {
        author: req.user.id,
        text: req.body.text,
        title: req.body.title,
        description: req.body.description,
        ingredients: req.body.ingredients,
        category: req.body.category,
        feature_img: result.url != null ? result.url : ''
      }
      saveArticle(obj);
    },{
      resource_type: 'image',
      eager: [
        {effect: 'sepia'}
      ]
    })
  } else {
    saveArticle({
      author: req.user.id,
      text: req.body.text,
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      category: req.body.category,
      feature_img: '',
    })
  }
  console.log("user _id: " + req.user.id);
  saveArticle({
    author: req.user.id,
    text: req.body.text,
    title: req.body.title,
    description: req.body.description,
    ingredients: req.body.ingredients,
    category: req.body.category,
    feature_img: '',
  });
  res.redirect('/');
}

exports.getAll = (req, res, next) => {
  Article.find(req.user.id)
    .populate('author')
    .populate('comments.author').exec((err, article)=> {
    if (err)
      res.send(err)
    else if (!article)
      res.send(404)
    else
      res.send(article)
    next()
  })
};
