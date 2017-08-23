var UserModel = require('../models/user');
var ImageModel = require('../models/image');
var CommentModel = require('../models/commet');
var uploadForm = require('../utils/uploadForm').uploadForm;
var checkLogin = require('../utils/checkLogin').checkLogin;

function routes(router) {
    //GET / 首页

    router.get('/', function (req, res, next) {
        ImageModel.getImages()
            .then(function (images) {
                res.render('home', {
                    image: images
                })
            }).catch(next)
    });

    //POST /images 上传图片
    router.post('/images', checkLogin, uploadForm, function (req, res, next) {
        var imageArr = req.files.imageFile.path.split("\\");
        var imageName = imageArr[imageArr.length - 1];
        var image = {
            _author: req.session.user,
            text: req.fields.text,
            size: req.files.imageFile.size,
            imageName: imageName,
            createAt: new Date()
        };
        ImageModel.create(image).then(function () {
            res.redirect('/');
        }).catch(next);
    });

    //GET /images/:imageId/like 为图片点赞
    router.get('/images/:imageId/like', function (req, res) {
        var imageId = req.params.imageId;
        ImageModel.getImageById(imageId).then(function (image) {
            if (req.session.user) {
                var userId = req.session.user._id;
                var likeState;
                if (image.like.indexOf(userId) === -1) {
                    // 在图片的like里面增加点赞的id
                    image.like.push(userId);
                    image.save();
                    likeState = true;
                } else {
                    // 在图片的like里面取消点赞的id
                    var imageIndex = image.like.indexOf(userId);
                    image.like.splice(imageIndex, 1);
                    image.save();
                    likeState = false;
                }
                var likeNum = image.like.length;
                var resObj = {
                    likeNum: likeNum,
                    likeState: likeState
                }
                // 给页面返回数据
                res.json(resObj)
            } else {
                req.flash('error', '未登录');
                res.redirect('back')
            }
        })
    })

    //POST /images/:imageId/comment 为图片评论
    router.post('/images/:imageId/comment', checkLogin, function (req, res) {
        var imageId = req.params.imageId;
        // console.log(req)
        console.log(req.body)
        var comment = {
            _imageId: imageId,
            from: req.session.user._id,
            content: req.body[imageId]
        }
        // CommentModel.create(comment)
        console.log(comment)
        res.json(comment)
    })

    //GET /images/:imageId/comment 获取图片评论
    router.get('/images/:imageId/comment', function(req, res) {
        var imageId = req.params.imageId;
        CommentModel.getCommentByImageId(imageId).then(function(comments){
            res.json(comments)
        })
    })

    //user的相关路由
    //GET /user/:id 用户主页，包括用户信息以及分享的图片
    router.get('/user/:id', function (req, res, next) {
        var userId = req.params.id;
        ImageModel.getImagesByUserId(userId).then(function (images) {
            res.render('userhome', {
                image: images
            });
        }).catch(next)

    });

    //POST /user/singup 注册用户
    router.post('/user/signup', function (req, res) {

        var userName = req.body.userName;
        var userPW = req.body.password;
        var user = {
            name: userName,
            password: userPW
        }

        UserModel.create(user).then(function (result) {
            //result拿到的是注册信息
            var id = result._id;
            req.session.user = result;
            req.flash('success', '注册成功');
            res.redirect('/user/:id');
        }, function (err) {
            if (err.message.match('E11000 duplicate key')) {

                req.flash('error', '用户名重复');
                return res.redirect('/');
            } else {
                req.flash('error', '注册未知错误');
                res.redirect('/')
            }
        });

    });

    //POST /user/singin 用户登陆
    router.post('/user/signin', function (req, res) {

        var userName = req.body.userName;
        var userPW = req.body.password;

        UserModel.getUserByName(userName).then(function (user) {
            if (!user) {
                req.flash('error', '用户不存在');
                return res.redirect('/');
            }
            if (userPW !== user.password) {
                req.flash('error', '密码不正确');
                return res.redirect('/');
            }
            var id = user._id;
            req.session.user = user;
            req.flash('success', '登陆成功');
            res.redirect(`/user/${id}`);
        })

    })

    //GET /logout 用户登出
    router.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功');
        res.redirect('/');
    })
    //user的相关路由结束

}
module.exports = routes;