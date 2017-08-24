(function () {
    var commentTemplate = document.getElementById('commentTemplate').innerHTML;

    // 点赞评论区的事件
    var imageContent = document.getElementById('imageContent');
    imageContent.addEventListener('click', function (event) {
        var target = event.target;
        if (target.classList.contains('like')) {
            var imageId = target.parentNode.parentNode.parentNode.getElementsByTagName('img')[0].getAttribute('data-imageId');
            getAndChage(imageId, function (like) {
                if (like.likeState === true) {
                    target.style.color = "red";
                } else {
                    target.style.color = "#ccc";
                }
                target.nextElementSibling.innerHTML = like.likeNum;
            });
        }
        if (target.classList.contains('commentBtn')) {
            var imageId = target.parentNode.parentNode.getElementsByTagName('img')[0].getAttribute('data-imageId');
            var commentDetail = target.parentNode.parentNode.getElementsByClassName('commentDetail')[0];
            var glyphicon = target.getElementsByClassName('glyphicon')[0];
            if (commentDetail.classList.contains('hidden')) {
                commentDetail.classList.remove('hidden');
                glyphicon.classList.remove('glyphicon-chevron-down');
                glyphicon.classList.add('glyphicon-chevron-up')

                // 插入评论区
                getComment(imageId, function (data) {
                    var template = Handlebars.compile(commentTemplate);
                    var context = {
                        comments: data,
                        imageId: imageId
                    }
                    var html = template(context);
                    commentDetail.innerHTML = html
                })
            } else {
                commentDetail.classList.add('hidden');
                glyphicon.classList.remove('glyphicon-chevron-up');
                glyphicon.classList.add('glyphicon-chevron-down')

                // 删除评论区

            }
        }
        if (target.classList.contains('commentSubmit')) {
            var form = new FormData(target.parentNode);
            var imageId = target.parentNode.getElementsByTagName('textarea')[0].getAttribute('name');
            // var testForm = form.get(imageId); //test
            // form.append('test', 'testtext')
            postComment(form, imageId, function (data) {
                console.log(data)
            })
        }
    });

    // 拿到like的状态
    function getAndChage(imageId, cb) {
        var xhr = new XMLHttpRequest();
        var url = '/images/' + imageId + '/like'
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var like = JSON.parse(xhr.response)
                    // 匿名回调更改样式
                    cb(like)
                } else {
                    console.error(xhr.status);
                }
            }
        }
        xhr.send(imageId);
    };

    // 拿到评论区数据
    function getComment(imageId, cb) {
        var xhr = new XMLHttpRequest();
        var url = '/images/' + imageId + '/comment'
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.response)
                    cb(data)
                } else {
                    console.error(xhr.status);
                }
            }
        }
        xhr.send(imageId);
    }

    // 发送评论内容
    function postComment(form, imageId, cb) {
        var xhr = new XMLHttpRequest();
        var url = '/images/' + imageId + '/comment'
        xhr.open('POST', url);
        // xhr.setRequestHeader('Content-Type', 'multipart/form-data'); //不要设置header？
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.response)
                    // console.log(data)
                    cb(data)
                } else {
                    console.error(xhr.status);
                }
            }
        }
        xhr.send(form);
    }

})()