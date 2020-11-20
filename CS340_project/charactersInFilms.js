module.exports = function(){
    var express = require('express');
    var router = express.Router();

    const getCharactersInFilm = (res, mysql, context, FilmID, complete) => {
        var sql = 'SELECT c.Name, c.Birthdate, c.Gender, c.Species, c.Height, h.Name AS homeworld, f.Name_Of_Movie, f.FilmID FROM Characters c INNER JOIN Characters_In_Films cf ON cf.CharacterID = c.CharacterID LEFT JOIN Homeworlds h ON h.WorldID = c.WorldID INNER JOIN Films f ON f.FilmID = cf.FilmID WHERE cf.FilmID = ?';
        var inserts = [FilmID];
        mysql.pool.query(sql, inserts, (error, results, fields) => {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characterFilms = results;
            complete();
        });
    }

    const getCharacters = (res,mysql,context, complete) => {
        var sql = 'SELECT c.CharacterID, c.Name, c.Birthdate, c.Gender, c.Species, c.Height, h.Name as homeworld from Characters c LEFT JOIN Homeworlds h ON h.WorldID = c.WorldID';
        mysql.pool.query(sql, (error,results,fields) => {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    function getFilm(res,mysql,context, complete){
        var sql = "SELECT FilmID FROM Characters_In_Films WHERE FilmID = ?";
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

    router.get('/:FilmID', (req, res) => {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getCharactersInFilm(res, mysql, context, req.params.FilmID, complete);
        getCharacters(res, mysql, context, complete);
        // getFilm(res, mysql, context, req.params.FilmID, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 2) {
                res.render('charactersInFilms', context);
            }
        }
    });

    router.post('/:FilmID', (req,res) => {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Characters_In_Films (FilmID, CharacterID) VALUES ( (SELECT f.FilmID FROM Films f WHERE f.FilmID = ?), (SELECT c.CharacterID FROM Characters c WHERE c.CharacterID = ?) );";
        var inserts = [req.body.Name, req.body.Birthdate, req.body.Gender, req.body.Species, req.body.Height, req.body.WorldID, req.params.FilmID];
        sql = mysql.pool.query(sql, inserts, (error, results, fields) => {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            } else{
                console.log(req.body);
                res.redirect('/characters_in_films/:FilmID');
            }
        });
    });

    return router;
}();