var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');


var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'bimbel_nodejs'
});

connection.connect(function(err){
    if (!err) {
        console.log("Database is connected..\n");
    } else {
        console.log("Error connecting database..\n");
        console.log(err);
    }
});

/* GET home page. */

router.get('/', function(req, res, next){
    if (req.session.loggedIn == null){    
	res.render('login',{ title:'Login'})
    }else{
        res.redirect('/users/home');
    }
});

router.get('/register', function(req, res, next){	
	res.render('register',{ title:'Profile'})
});

router.get('/coba', function(req, res, next){   
    res.render('coba',{ title:'Profile'})
});

// POST login
router.post('/', function(req, res) {
    var uname = req.body.username;
    var password = req.body.password;
    connection.query('SELECT * FROM tb_user WHERE username = ?', [uname], function(error, results, fields) {
        //console.log(results);
        if (error) {
            // console.log("error ocurred",error);
            res.send({message: "Email and password wrong1"
                    })
        } else {
            console.log('The results is: ', results);

            if (results.length > 0) {
            	// langsung compare dri body dengan db secara async
            	bcrypt.compare(password, results[0].password, function(err, ress) {
    				console.log(ress);
    				if(ress){
    					req.session.loggedIn = true;
                    	req.session.namaSession = results[0].username;
                    	req.session.idUser = results[0].id;
                    	req.session.lvlUser = results[0].level;
                    	console.log(req.session.namaSession);
                    	res.redirect('/users/home');
                	}else{
                		//res.send({message: "Email and password wrong2"
                    	//});
                        res.redirect('/users/home');
                	}
				});
            } else {
                //res.send({message: "Email and password wrong3"
                //});
                res.redirect('/users/home');
            }
        }
    });
});

//POST Register
router.post('/register', function(req,res){
    var uname = req.body.username;
    var password = req.body.password;
    
    // buat generate pass secara async
    const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
               bcrypt.hash(password, salt, function(err, hash) {
                    // Store hash in your password DB.
                   console.log('dari body '+hash);
        var post = {username: uname, password: hash}

        connection.query('INSERT INTO tb_user SET ?', post, function(error,results,fields){
            res.redirect('/users/home');
            
        });
        });
        });       
});

/* GET logout function. */
router.get('/logout', function(req, res) {
    req.session = null;
    res.redirect('/');
});
module.exports = router;
