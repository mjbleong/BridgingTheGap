"use strict";

//var mongoose = require('mongoose');
var async = require('async');
//p7
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');

// Load the Mongoose schema for User, Photo, and SchemaInfo
//var User = require('./schema/user.js');
//var Photo = require('./schema/photo.js');
//var SchemaInfo = require('./schema/schemaInfo.js');

var express = require('express');
var app = express();
var fs = require("fs");

//mongoose.connect('mongodb://localhost/cs142project6');

app.use(express.static(__dirname));

//p7
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());



app.get('/getFavorites', function (request, response) {
    var userId = request.session.my_id;
    User.findOne({_id: userId}, function (err, user) {
        if (err) {
            console.error('Doing /user/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user === null) {
            console.log('User not found.');
            response.status(400).send('Not found');
            return;
        }
        user = JSON.parse(JSON.stringify(user));
        response.status(200).send(user.favorites_list);
    });
});


app.post('/getFavoritesPhoto/:photo_id', function (request, response) {
    var photo_id = request.params.photo_id;
    console.log(photo_id);
    Photo.findOne({_id: photo_id}, function (err, photo) {
        if (err) {
            console.error('ph error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (photo === null) {
            console.log('Photos not found.');
            response.status(400).send('Not found');
            return;
        }
        photo = JSON.parse(JSON.stringify(photo));
        response.status(200).send(photo);
    });

});



app.post('/favorite/:photo_id', function (request, response) {
    var photo_id = request.params.photo_id;
    var userId = request.session.my_id;
    User.findOne({_id: userId}, function (err, user) {
        if (err) {
            console.error('Doing /user/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user === null) {
            console.log('User not found.');
            response.status(400).send('Not found');
            return;
        }
        var alreadyHasFav = false;
        user.favorites_list.forEach(function(elem) {
            if (elem === photo_id) {
                alreadyHasFav= true;
            }
        });
        if (alreadyHasFav) {
            console.log("already there");
            response.status(400).send("already fav");
            return;
        }
            user.favorites_list.push(photo_id);
            user.save();
            response.status(200).send(user);
        });
});

app.post('/unfavorite/:photo_id', function (request, response) {
    var photo_id = request.params.photo_id;
    var userId = request.session.my_id;
    User.findOne({_id: userId}, function (err, user) {
        if (err) {
            console.error('Doing /user/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user === null) {
            console.log('User not found.');
            response.status(400).send('Not found');
            return;
        }
        var newArrayFav = [];
        user.favorites_list.forEach(function(fav) {
            if (photo_id !== fav) {
                newArrayFav.push(fav);
            }
        });
        user.favorites_list = newArrayFav;
        user.save();
        response.status(200).send(user);
        });
});


app.post('/like/:photo_id', function (request, response) {
    var photo_id = request.params.photo_id;
    var userId = request.session.my_id;
    User.findOne({_id: userId}, function (err, user) {
        if (err) {
            console.error('Doing /user/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user === null) {
            console.log('User not found.');
            response.status(400).send('Not found');
            return;
        }
        user = JSON.parse(JSON.stringify(user));

        Photo.findOne({_id: photo_id}, function (err, photo) {
            var alreadyHas = false;
            photo.likes.forEach(function(elem) {
                if (elem === user.login_name) {
                    alreadyHas= true;
                }
            });
            if (alreadyHas) {
                console.log("already there");
                response.status(400).send("already liked");
                return;
            }
            if (err) {
                console.error('comments error:', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (photo === null) {
                console.log('Photos not found.');
                response.status(400).send('Not found');
                return;
            }
            var newUserLike = user.login_name;
            photo.likes.push(newUserLike);
            photo.save();
            response.status(200).send(photo);
        });

    }); 
});


app.post('/unlike/:photo_id', function (request, response) {
    var photo_id = request.params.photo_id;
    var userId = request.session.my_id;
    User.findOne({_id: userId}, function (err, user) {
        if (err) {
            console.error('Doing /user/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user === null) {
            console.log('User not found.');
            response.status(400).send('Not found');
            return;
        }
        user = JSON.parse(JSON.stringify(user));

        Photo.findOne({_id: photo_id}, function (err, photo) {
            var likedAlready = false;
            photo.likes.forEach(function(elem) {
                if (elem === user.login_name) {
                    likedAlready = true;
                }
            });
            if (!likedAlready) {
                console.log("not liked there");
                response.status(400).send("not liked");
                return;
            }
            if (err) {
                console.error('comments error:', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (photo === null) {
                console.log('Photos not found.');
                response.status(400).send('Not found');
                return;
            }
            var newArray = [];
            photo.likes.forEach(function(like) {
                console.log(user.login_name);
                console.log(like);
                if (user.login_name !== like) {
                    newArray.push(like);
                }
            });
            photo.likes = newArray;
            photo.save();
            response.status(200).send(photo);
        });

    }); 
});

app.post('/recent/:id', function (request, response) {
    var id = request.params.id;
    var userHere = JSON.parse(JSON.stringify(request.body.user));
        Photo.find({user_id: id}, function (err, photos) {
            console.log(request.session.login_name);
            if (!request.session.login_name) {
                console.log("no log in");
                response.status(401).send("no one logged in");
                return;
            }
            if (err) {
                console.error('/photosOfUser/:id error:', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (photos === null) {
                console.log('Photos with _id:' + id + ' not found.');
                response.status(400).send('Not found');
                return;
            }
            if (photos.length === 0) {
                console.log("err here!");
                console.log('Photos for user with _id:' + id + ' not found.');
                response.status(400).send('Not found');
                return;
            }
            photos = JSON.parse(JSON.stringify(photos));
            var mostRecentPhotoTime = null;
            var mostRecPhotoNum = 0;
            var counter = 0;
            photos.forEach(function(elem) {
                var currTime = new Date(elem.date_time);
                if (counter === 0) { 
                    mostRecentPhotoTime = currTime;
                }
                if (currTime > mostRecentPhotoTime) {
                    mostRecentPhotoTime = currTime;
                    mostRecPhotoNum = counter;
                }
                counter++;
            });
            var finalPhoto = photos[mostRecPhotoNum];
            finalPhoto.numInArray = mostRecPhotoNum;
            response.status(200).send(finalPhoto);

    });
});


app.post('/mostComments/:id', function (request, response) {
    var id = request.params.id;
    var userHere = JSON.parse(JSON.stringify(request.body.user));
    if (!request.session.login_name) {
        console.log("no log in");
        response.status(401).send("no one logged in");
        return;
    }
        Photo.find({user_id: id}, function (err, photos) {
            if (!request.session.login_name) {
                console.log("no log in");
                response.status(401).send("no one logged in");
                return;
            }
            if (err) {
                console.error('/photosOfUser/:id error:', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (photos === null) {
                console.log('Photos with _id:' + id + ' not found.');
                response.status(400).send('Not found');
                return;
            }
            if (photos.length === 0) {
                console.log("err here!");
                console.log('Photos for user with _id:' + id + ' not found.');
                response.status(400).send('Not found');
                return;
            }
            photos = JSON.parse(JSON.stringify(photos));
            var mostComments = 0;
            var mostComPhotoNum = 0;
            var counter = 0;
            photos.forEach(function(elem) {
                if (elem.comments.length > mostComments) {
                    mostComments = elem.comments.length;
                    mostComPhotoNum = counter;
                }
                counter++;
            });
            var finalPhoto = photos[mostComPhotoNum];
            finalPhoto.numInArray = mostComPhotoNum;
            response.status(200).send(finalPhoto);
    });
});



app.post('/user', function (request, response) {
    console.log("register");

    User.findOne({login_name: request.body.login_name}, function (err, user) {
        if (err) {
            console.error('Doing register error', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        console.log("hello1");
        console.log(request.body.first_name);
        console.log("hello");
        if (request.body.login_name === undefined ||request.body.first_name === undefined || request.body.last_name === undefined || request.body.location ===  undefined || request.body.description === undefined || request.body.occupation === undefined || request.body.password === undefined || request.body.confirmPassword === undefined  || request.body.login_name === "" ||request.body.first_name === "" || request.body.last_name === "" || request.body.location ===  "" || request.body.description === "" || request.body.occupation === "" || request.body.password === "" || request.body.confirmPassword === ""){
            console.error('Doing register error', err);
            response.status(400).send("empty");
            return;
        }
        if (request.body.password !== request.body.confirmPassword){
            console.error('Doing register error', err);
            response.status(400).send("empty");
            return;
        }
        if (user !== null) {
            response.status(400).send("duplicate");
            return;
        } else {         
            User.create({login_name: request.body.login_name,
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            location: request.body.location,
            description: request.body.description,
            occupation: request.body.occupation,
            password: request.body.password,
            id: request.body.id}, function (err, newUser) {
                if (err) {
                    console.error('Doing /user/ create error:', err);
                    response.status(400).send(JSON.stringify(err));
                    return;
                }
                if (newUser === null) {
                    console.log('User not made.');
                    response.status(400).send('Not made');
                    return;
                }
                newUser = JSON.parse(JSON.stringify(newUser));
                request.session.login_name = request.body.login_name;
                request.session.my_id = newUser._id;
                response.status(200).send(newUser);
            });
}
});

});



app.post('/photos/new', function (request, response) {
    processFormBody(request, response, function (err) {
            if (err || !request.file) {
                console.log("error of photonew");
                response.status(400).send(err);
                return;
            }
            var viewersList = request.body.share;

            // request.file has the following properties of interest
            //      fieldname      - Should be 'uploadedphoto' since that is what we sent
            //      originalname:  - The name of the file the user uploaded
            //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
            //      buffer:        - A node Buffer containing the contents of the file
            //      size:          - The size of the file in bytes

            // XXX - Do some validation here.
            // We need to create the file in the directory "images" under an unique name. We make
            // the original file name unique by adding a unique prefix with a timestamp.
            var timestamp = new Date().valueOf();
            var filename = 'U' +  String(timestamp) + request.file.originalname;

            fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
                var userId = request.session.my_id;
                var timeStamp = new Date();
                    User.findOne({_id: userId}, function (err, user) {
                        if (err) {
                            console.error('Doing /user/:id error:', err);
                            response.status(400).send(JSON.stringify(err));
                            return;
                        }
                        if (user === null) {
                            console.log('User not found.');
                            response.status(400).send('Not found');
                            return;
                        }
                        user = JSON.parse(JSON.stringify(user));
                        console.log("hello");
                        console.log(viewersList);
                        Photo.create({id: userId, file_name: filename, date_time: timestamp, user_id: user, comments: [], viewers: viewersList}, function(err, newPhoto) {
                            response.status(200).send(newPhoto);
                        });
                    });

            });
        });
});

app.post('/commentsOfPhoto/:photo_id', function (request, response) {
    var photo_id = request.params.photo_id;
    var userId = request.session.my_id;
    var currUserObj;
    var timeStamp = new Date();
    var currComm = request.body.comment;
    Photo.findOne({_id: photo_id}, function (err, photo) {
            if (err) {
                console.error('comments error:', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (photo === null) {
                console.log('Photos not found.');
                response.status(400).send('Not found');
                return;
            }
        var newComment = {comment: currComm, date_time: timeStamp, user_id: userId};
        photo.comments.push(newComment);
        photo.save();
        response.status(200).send(photo);
    });
});

app.post('/admin/login', function (request, response) {
    console.log("login");

    var username = request.body.login_name;
    var password = request.body.password;

    User.findOne({login_name: username}, function (err, user) {
        if (err) {
            console.error('Doing /user/:id error:', err);
            response.status(400).send(JSON.stringify(err));
            return;
        }
        if (user === null) {
            console.log('User with _id:' + username + ' not found.');
            response.status(400).send('Not found');
            return;
        }
        if (user.password !== password) {
            response.status(400).send(JSON.stringify(err));
            return;
        }
        user = JSON.parse(JSON.stringify(user));
        request.session.login_name = request.body.login_name;
        request.session.my_id = user._id;
        response.status(200).send(user);

    });
});

app.post('/admin/logout', function (request, response) {
    console.log("logout");
    delete request.session.login_name;
    delete request.session.my_id;
    request.session.destroy();
    response.status(200).send();

});


app.get('/getSession', function (request, response) {
    response.status(200).send(request.session);
});


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});


app.get('/user/list', function (request, response) {
    if (!request.session.login_name) {
        console.log("no log in");
        response.status(401).send("no one logged in");
        return;
    }
    User.find({}, function (err, users) {
            if (err) {
                console.error('/user/list error:', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (users.length === 0) {
                response.status(500).send('No Users');
                return;
            }
            if (users === null) {
                console.log('User list not found.');
                response.status(400).send('Not found');
                return;
            }
            users = JSON.parse(JSON.stringify(users));
            users.forEach(function(elem) {
                delete elem.occupation;
                delete elem.description;
                delete elem.location;
                delete elem.__v;
                delete elem.login_name;
                delete elem.password;
            });
            response.status(200).send(JSON.stringify(users));
        });
});


app.get('/user/:id', function (request, response) {
    var id = request.params.id;
    if (!request.session.login_name) {
        console.log("no log in");
        response.status(401).send("no one logged in");
        return;
    }
    User.findOne({_id: id}, function (err, user) {
            if (err) {
                console.error('Doing /user/:id error:', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (user === null) {
                console.log('User with _id:' + id + ' not found.');
                response.status(400).send('Not found');
                return;
            }
            user = JSON.parse(JSON.stringify(user));
            delete user.__v;
            delete user.login_name;
            delete user.password;
            response.status(200).send(JSON.stringify(user));
        });
});


app.get('/photosOfUser/:id', function (request, response) {
    var id = request.params.id;
    var userArray;
    if (!request.session.login_name) {
        console.log("no log in");
        response.status(401).send("no one logged in");
        return;
    }
    var donePromise = User.find({}, function (err, users) {
            if (err) {
                console.error('/user/list error:', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (users === null) {
                console.log('User list not found.');
                response.status(400).send('Not found');
                return;
            }
            userArray = JSON.parse(JSON.stringify(users));
            userArray.forEach(function(elem) {
                delete elem.occupation;
                delete elem.description;
                delete elem.location;
                delete elem.__v;
                delete elem.login_name;
                delete elem.password;
            });
        });
    donePromise.then(function (value) {
        Photo.find({user_id: id}, function (err, photos) {
            photos = JSON.parse(JSON.stringify(photos));

            //sort by likes
            for (var d = 0; d < photos.length; d++) {
            for (var c = 0; c < photos.length; c++) {
                if (photos[c+1] !== undefined) {
                    if ((photos[c].likes.length < photos[c+1].likes.length) || ((photos[c].likes.length === photos[c+1].likes.length) && (photos[c].date_time < photos[c+1].date_time))) {
                        var saved = photos[c];
                        photos[c] = photos[c+1];
                        photos[c+1] = saved;
                    }
                }
            }
            }

            var slimPhotos = []; //new photo array created here
            if (!request.session.login_name) {
                console.log("no log in");
                response.status(401).send("no one logged in");
                return;
            }
            if (err) {
                console.error('/photosOfUser/:id error:', err);
                response.status(400).send(JSON.stringify(err));
                return;
            }
            if (photos === null) {
                console.log('Photos with _id:' + id + ' not found.');
                response.status(400).send('Not found');
                return;
            }
            if (photos.length === 0) {
                console.log("no photos yet");
                response.status(200).send(JSON.stringify(slimPhotos));
                return;
            }

            photos.forEach(function(elem) {
                var newElem = {};
                newElem._id = elem._id;
                newElem.user_id = elem.user_id;
                newElem.file_name = elem.file_name;
                newElem.date_time = elem.date_time;
                newElem.comments = [];
                if (elem.likes===null) {
                newElem.likes = [];
            } else {
                newElem.likes = elem.likes;
            }
            if(elem.viewers.length===0) {
                console.log("in");
                newElem.viewers = [];
                userArray.forEach(function(elem) {
                    newElem.viewers.push(elem._id);
                });
            } else {
                newElem.viewers = elem.viewers;
            }
                async.each(elem.comments, function(com) {
                    var currComment = {};
                    currComment.comment = com.comment;
                    currComment.date_time = com.date_time;
                    currComment._id = com._id;
                    var correctUser;
                    userArray.forEach(function(element) {
                        if(String(element._id) === String(com.user_id)){
                            correctUser=element;
                        }
                    });
                    currComment.user = correctUser;
                    newElem.comments.push(currComment);
                });

            var contains = false;
            console.log(newElem.viewers);
            newElem.viewers.forEach(function(elem) {
                if (elem === request.session.my_id) {
                    contains = true;
                }
            });
            if (contains) {
                slimPhotos.push(newElem);
            }
            });
            response.status(200).send(JSON.stringify(slimPhotos));
        });

    });
});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
