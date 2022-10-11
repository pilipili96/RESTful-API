const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const e = require("express");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
  };
  
const Article = mongoose.model("Article", articleSchema);


//targeting all articles
app.route("/articles")
    .get(function(req,res){
            Article.find(function (err, foundArticles){
                if(err){
                    res.send(err);
                }else{
                    res.send(foundArticles)
                }
            });
        })

    .post(function(req,res){
        const savePostRequest = new Article(
            {
                title: req.body.title,
                content: req.body.content
            }
        );
        savePostRequest.save(function(err){
            if(err){
                res.send(err)
            } else{
                res.send("Added new article successfully")
            }
        })
    })

    .delete(function(req,res){
        Article.deleteMany(function(err){
            if (err){
                res.send(err)
            } else{
                res.send("Successfully deleted")
            };
        });
    });

    //targeting specific articles
    app.route("/articles/:articleTitle")
        .get(function(req,res){
            Article.findOne({title:req.params.articleTitle},function (err, foundArticle){
                if(!foundArticle){
                    res.send("No articles found");
                }else{
                    res.send(foundArticle)
                }
            });
        })
        .put(function(req,res){
            Article.replaceOne({title:req.params.articleTitle},{content:req.body.content, title:req.body.title},function(err,updateArtlce){
                if(err){
                    res.send(err)
                }else{
                    res.send("Successfully updated")
                }
            })
        })
        .patch(function(req,res){
            Article.findOneAndUpdate({title:req.params.articleTitle},{$set: req.body}, function(err){
                if(!err){
                    res.send("Updated one item in the article successfuly")
                }else{
                    res.send(err)
                }
            })
        })
        .delete(function(req,res){
            Article.deleteOne({title:req.params.articleTitle}, function(err){
                if(err){
                    res.send(err)
                }else{
                    res.send("Deleted one article successfully")
                }
            })
        });













app.listen(3000, function() {
  console.log("Server started on port 3000");
});
