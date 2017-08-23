var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config/config');

mongoose.Promise = Promise;
mongoose.connect(config.mongodb);

var userSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    password: String
});

exports.User = mongoose.model('User', userSchema);

var imageSchema = mongoose.Schema({
    _author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
    size: String,
    imageName: String,
    like: Array,
    createAt: Date
});

exports.Image = mongoose.model('Image', imageSchema);

var commentSchema = mongoose.Schema({
    _imageId: {
        type: Schema.Types.ObjectId,
        ref: 'Image'
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reply: [
        {
            from: {type: Schema.Types.ObjectId, ref: 'User'},
            to: {type: Schema.Types.ObjectId, ref: 'User'},
            content: String,
            createAt: Date
        }
    ],
    content: String,
    createAt: Date
});

exports.Comment = mongoose.model('Comment', commentSchema)