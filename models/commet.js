var Comment = require('../schemas/schema').Comment;

module.exports = {
    create: function create(comment) {
        return Comment.create(comment);
    },
    getCommentByImageId: function getCommentByImageId(imageId){
        return Comment.find({
            _imageId: imageId
        }).populate({
            path: 'from',
            modal: 'User'
        })
    }
}