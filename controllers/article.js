const cloudinary = require('cloudinary')
const fs = require('fs')
const Article = require('../models/Article');
const User = require('../models/User');

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
  // if( existedTitle === title) nahuy
  image = "https://www.rd.com/wp-content/uploads/2017/10/yes-it-s-possible-to-cook-an-egg-without-heat_618240320-oksana-mizina-760x506.jpg"
    cloudinary.uploader.upload(image, (result) => {
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
  }
//   console.log("user _id: " + req.user.id);
//   saveArticle({
//     author: req.user.id,
//     text: req.body.text,
//     title: req.body.title,
//     description: req.body.description,
//     ingredients: req.body.ingredients,
//     category: req.body.category,
//     feature_img: '',
//   });
//   res.redirect('/');
// }

exports.getAll = (req, res, next) => {
  console.log(req.user.id)
  User.find({_id: req.user.id})
    .populate('articles').exec((err, articles)=> {
    res.json(articles);
  })
};

