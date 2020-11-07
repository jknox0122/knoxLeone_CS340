module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var app = express();

    function getFilms(res,mysql,context,complete){
        mysql.pool.query('SELECT film_id, name_of_movie, year_released, imdb_rating, directed_by FROM films', function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.films = results;
            complete();
        });
    }

    function getFilm(res,mysql,context,character_id, complete){
        var sql = "SELECT film_id, name_of_movie, year_released, imdb_rating, directed_by FROM films WHERE film_id = ?";
        var inserts = [film_id];
        mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.film = results[0];
            complete();
        });
    }

    router.get('/', function(req,res){
        var callbackCount = 0;
        var context ={};
        context.jsscripts = ["deleteCharacter.js"];
        var mysql = req.app.get('mysql');
        getFilms(res,mysql,context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >=1){
                res.render('films',context);
            }
        }
    });

    router.get('/:film_id/', function(req,res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateCharacter.js"];
        var mysql = req.app.get('mysql');
        getFilm(res,mysql,context,req.params.film_id,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >=1){
                res.render('updateFilm',context);
            }
        }
    });

    router.post('/',function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO films (name_of_movie, year_released, imdb_rating, directed_by) VALUES (?,?,?,?)";
        var inserts = [req.body.name_of_movie, req.body.year_released, req.body.imdb_rating, req.body.directed_by];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            } else{
                res.redirect('/films');
            }
        });
    });

    router.put('/:film_id', function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE films SET name_of_movie=?, year_released=?, imdb_rating=?, directed_by=? WHERE film_id =?";
        var inserts = [req.body.name_of_movie, req.body.year_released, req.body.imdb_rating, req.body.directed_by, req.params.film_id];
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

    router.delete('/:film_id',function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM films WHERE film_id = ?";
        var inserts = [req.params.film_id];
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