module.exports = {
    checkLogin: function (req, res, next) {
        if (req.session.user) {
            next()
        } else {
            req.flash('error', '未登录');
            res.redirect('back')
        }
    }
}