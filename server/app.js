    var express = require('express');
    var cors = require('cors');
    var app = express();
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var config = require('./config').config;
    var dbConnection = require('./util');

    app.use(cors());
    /** Serving from the same express Server
    No cors required */
    app.use(express.static('../client'));
    app.use(bodyParser.json());

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, config.destinationFolder);
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            var newFileName =file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
            imagePath = newFileName;
            cb(null,newFileName);

        }

    });


    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            var imgUrl = config.destinationFolder+imagePath;

            dbConnection.dbConnection(req.body.productName,req.body.productPrice,
                req.body.productDimension,req.body.productColor,imgUrl,function(err,data){
                if (err)
                    res.send('error');
                res.send(data);
            })
        });
    });
    app.get('/auth', function(req, res) {
            dbConnection.authenticateUser(req.query.userId,req.query.userPassword
               ,function(err,data){
                    if (err)
                        res.send('error');
                    res.send(data);
                })
    });

    app.get('/fetchItems',function(req,res){
      dbConnection.getProducts(function(err,data){
          if(err)
              res.send(err);
          res.send(data);
      });
    });

    app.listen('3000', function(){
        console.log('running on 3000...');
    });
