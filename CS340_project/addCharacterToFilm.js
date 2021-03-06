module.exports = function() {
    var express = require('express');
    var router = express.Router();

    function getFilms(res,mysql,context,complete){
        mysql.pool.query('SELECT FilmID, Name_Of_Movie FROM Films ORDER BY Name_Of_Movie ASC', function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.films = results;
            complete();
        });
    }

    function getCharacters(res, mysql, context, complete){
        mysql.pool.query("SELECT CharacterID, Name FROM Characters ORDER BY Name ASC", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }
    
    router.get('/', (req, res) => {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        // getCharactersInFilm(res, mysql, context, complete);
        getCharacters(res, mysql, context, complete);
        getFilms(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 2) {
                res.render('addCharactersInFilms', context);
            }
        }
    });

    router.post('/', (req,res) => {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Characters_In_Films (FilmID, CharacterID) VALUES ( (SELECT f.FilmID FROM Films f WHERE f.FilmID = ?), (SELECT c.CharacterID FROM Characters c WHERE c.CharacterID = ?) );";
        var inserts = [req.body.FilmID, req.body.CharacterID];
        sql = mysql.pool.query(sql, inserts, (error, results, fields) => {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            } else{
                console.log(req.body);
                res.redirect('/characters_in_films/'+inserts[0]);
            }
        });
    });

    return router;
}();