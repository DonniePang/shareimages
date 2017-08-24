var formidable = require('formidable');

module.exports = {
    otherForm: function otherForm(req, res, next) {
        var form = new formidable.IncomingForm();
        
        form.parse(req, function(err, fields, files) {
            req.fields = fields;
            req.files = files;
            console.log(req.fields);

            next();
        })
    }
}