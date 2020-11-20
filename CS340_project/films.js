module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var app = express();

    function getFilms(res,mysql,context,complete){
        mysql.pool.query('SELECT FilmID, Name_Of_Movie, Year_Released, IMDB_Rating, Directed_By FROM Films', function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.films = results;
            complete();
        });
    }

    function getFilm(res,mysql,context, FilmID, complete){
        var sql = "SELECT FilmID, Name_Of_Movie, Year_Released, IMDB_Rating, Directed_By FROM Films WHERE FilmID = ?";
        var inserts = [FilmID];
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

    router.get('/:FilmID/', function(req,res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateCharacter.js"];
        var mysql = req.app.get('mysql');
        getFilm(res,mysql,context,req.params.FilmID,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >=1){
                res.render('updateFilm',context);
            }
        }
    });

    router.post('/',function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Films (Name_Of_Movie, Year_Released, IMDB_Rating, Directed_By) VALUES (?,?,?,?)";
        var inserts = [req.body.Name_Of_Movie, req.body.Year_Released, req.body.IMDB_Rating, req.body.Directed_By];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            } else{
                res.redirect('/films');
            }
        });
    });

    router.put('/:FilmID', function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Films SET Name_Of_Movie=?, Year_Released=?, IMDB_Rating=?, Directed_By=? WHERE FilmID =?";
        var inserts = [req.body.Name_Of_Movie, req.body.Year_Released, req.body.IMDB_Rating, req.body.Directed_By, req.params.FilmID];
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
        var sql = "DELETE FROM Films WHERE FilmID = ?";
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