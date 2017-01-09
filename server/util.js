var mysql = require('mysql');
function dbConnection(productName,productPrice,productDimensions,productColor,productImagePath,callback){
    //creating connection pool
    var pool  = mysql.createPool({
        connectionLimit : 100,
        host            : 'localhost',
        user            : 'root',
        password        : 'root',
        database        : 'poc'
    });

    var post  = {};
    post.product_name=productName;
    post.product_price=productPrice;
    post.product_image=productImagePath ;
    post.product_dimensions =productDimensions;
    post.product_color =productColor;
    pool.getConnection(function(err, connection) {
        if (err)
            return callback(err);
        pool.query('INSERT INTO ADD_PRODUCT SET ?', post, function (err, result) {
            if (err)
                return callback(err);
            return callback('successfully added product');
        });
    });
}

function getProducts(callback){
    var pool  = mysql.createPool({
        connectionLimit : 100,
        host            : 'localhost',
        user            : 'root',
        password        : 'root',
        database        : 'poc'
    });
    pool.getConnection(function(err, connection) {
        if (err)
            return callback(err);
        pool.query('SELECT * FROM add_product', function (err, result) {
            if (err)
                return callback(err);
            return callback(result);
        });
    });
}
function authenticateUser(userName,password,callback){
    var params =[];
    console.log(userName,password);
    params.push(userName,password);
    var pool  = mysql.createPool({
        connectionLimit : 100,
        host            : 'localhost',
        user            : 'root',
        password        : 'root',
        database        : 'poc'
    });
    pool.getConnection(function(err, connection) {
        if (err)
            return callback(err);
        pool.query('SELECT * FROM login where user_name=? and user_password=?',params ,function (err, result) {
            if (err)
                return callback(err);
            console.log(result);
            return callback(null,result);
        });
    });
}

module.exports = {
    dbConnection:dbConnection,
    getProducts:getProducts,
    authenticateUser:authenticateUser
}
