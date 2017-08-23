module.exports = {
    port: 3000,
    mongodb: 'mongodb://localhost:27017/shareimages',
    session: {
        secret: 'shareimages',
        maxAge: 2592000000
    }
}