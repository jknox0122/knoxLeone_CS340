module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var app = express();

    function getCharacters(res,mysql,context,complete){
        mysql.pool.query('SELECT character_id, first_name, last_name, birth_date, gender, species, height FROM characters', function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    function getCharacter(res,mysql,context,character_id,complete){
        var sql = "SELECT character_id, first_name, last_name, birth_date, gender, species, height FROM characters WHERE character_id = ?";
        var inserts = [character_id];
        mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results[0];
            complete();
        });
    }

    router.get('/', function(req,res){
        var callbackCount = 0;
        var context ={};
        context.jsscripts = ["deleteCharacter.js"];
        var mysql = req.app.get('mysql');
        getCharacters(res,mysql,context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >=1){
                res.render('characters',context);
            }
        }
    });

    app.get('/index',function(req,res){
        res.render('index');
    })

    router.get('/:character_id', function(req,res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateCharacter.js"];
        var mysql = req.app.get('mysql');
        getCharacter(res,mysql,context,req.params.character_id,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >=1){
                res.render('updateCharacter',context);
            }
        }
    });

    router.post('/',function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO characters ( first_name, last_name, birth_date, gender, species, height) VALUES (?,?,?,?,?,?)";
        var inserts = [req.body.first_name, req.body.last_name, req.body.birth_date, req.body.gender, req.body.species, req.body.height];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            } else{
                res.redirect('/characters');
            }
        });
    });

    router.put('/:character_id', function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE characters SET first_name=?, last_name=?, birth_date=?, gender=?, species=?, height=? WHERE character_id =?";
        var inserts = [req.body.first_name, req.body.last_name, req.body.birth_date, req.body.gender, req.body.species, req.body.height, req.params.character_id];
        sql = mysql.pool.query(sql,inserts,function(error, results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            } else{
                res.status(200);
                res.end();
            }
        });
    });

    router.delete('/:character_id',function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM characters WHERE character_id = ?";
        var inserts = [req.params.character_id];
        sql = mysql.pool.query(sql,inserts,function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            } else{
                res.status(202).end();
            }
        });
    });
    return router;
}();