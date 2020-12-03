module.exports = function(){
    var express = require('express');
    var router = express.Router();

    const getCharactersInFilm = (res, mysql, context, FilmID, complete) => {
        var sql = 'SELECT c.CharacterID, c.Name, c.Birthdate, c.Gender, c.Species, c.Height, h.Name AS homeworld, f.Name_Of_Movie, f.FilmID FROM Characters c INNER JOIN Characters_In_Films cf ON c.CharacterID = cf.CharacterID LEFT JOIN Homeworlds h ON h.WorldID = c.WorldID INNER JOIN Films f ON f.FilmID = cf.FilmID WHERE f.FilmID = ?';
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

    // const getCharacters = (res,mysql,context, complete) => {
    //     var sql = 'SELECT c.CharacterID, c.Name, c.Birthdate, c.Gender, c.Species, c.Height, h.Name as homeworld from Characters c LEFT JOIN Homeworlds h ON h.WorldID = c.WorldID';
    //     mysql.pool.query(sql, (error,results,fields) => {
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.characters = results;
    //         complete();
    //     });
    // }

    router.get('/:FilmID', (req, res) => {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ['deleteCharacterFilm.js']
        var mysql = req.app.get('mysql');
        getCharactersInFilm(res, mysql, context, req.params.FilmID, complete);
        // getCharacters(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 1) {
                res.render('charactersInFilms', context);
            }
        }
    });

    router.delete('/Film/:FilmID/Character/:CharacterID', (req, res) => {
        var mysql = req.app.get('mysql');
        var sql = 'DELETE FROM Characters_In_Films WHERE FilmID = ? AND CharacterID = ?';
        var inserts = [req.params.FilmID, req.params.CharacterID];
        sql = mysql.pool.query(sql, inserts, (err, results, fields) => {
            if(err) {
                res.write(JSON.stringify(err));
                res.status(400).end();
            } else {
                res.status(202).end();
            }
        });
    });

    return router;
}();