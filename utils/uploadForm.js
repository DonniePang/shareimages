var formidable = require('formidable');
var fs = require('fs');

function imagefilter(files) {
    var key;
    for (key in files) {
        if (files.hasOwnProperty(key)) {
            if (!files[key].name.match(/\.(jpg|jpeg|gif)$/)) {
                console.log('格式不符'); //要转移到路由中去，给flash赋值success或者error，并且不符合要退出当前路由
                var deleteFilePath = '.\\'.concat(files[key].path);
                console.log(deleteFilePath);
                fs.unlink(deleteFilePath, function () {
                    console.log('已删除格式不符文件')
                })
                delete files[key]; //删除的只是req里的数据
            }
        }
    }
}

module.exports = {
    uploadForm: function uploadForm(req, res, next) {
        var form = new formidable.IncomingForm();
        form.uploadDir = './data/images/';
        form.keepExtensions = true;
        form.parse(req, function (err, fields, files) {
            imagefilter(files);
            req.fields = fields;
            req.files = files;
            next()
        });
    }
}