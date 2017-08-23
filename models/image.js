var Image = require('../schemas/schema').Image;

module.exports = {
    create: function create(image) {
        return Image.create(image);
    },
    getImages: function getImages() {
        return Image.find({})
            .populate({
                path: '_author',
                model: 'User'
            });
    },
    getImagesByUserId: function getImagesByUserId(userId) {
        return Image.find({
            _author: userId
        })
    },
    getImageById: function getImageById(imageId) {
        return Image.findOne({
            _id: imageId
        })
    }
}