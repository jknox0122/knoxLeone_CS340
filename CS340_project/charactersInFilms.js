module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCharactersInFilm(res, mysql, context, FilmID, complete) {
        var sql = 'SELECT c.Name, c.Birthdate, c.Gender, c.Species, c.Height FROM Characters c INNER JOIN Characters_In_Films cf ON cf.CharacterID = c.CharacterID WHERE cf.FilmID = ?';
        var inserts = [FilmID];
        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characterFilms = results;
            complete();
        });
    }

    // function getCharactersInFilms(res, mysql, context, complete) {
    //     var sql = 'SELECT c.Name, f.Name_Of_Movie FROM (Characters c, Films f) INNER JOIN Characters_In_Films cf ON c.CharacterID = cf.CharacterID AND f.FilmID = cf.FilmID';
    //     mysql.pool.query(sql, function(error, results, fields) {
    //         if(error) {
    //             res.write(JSON.stringify(error));
    //             res.end();
    //         }
    //         context.characterFilms = results;
    //         complete();
    //     })
    // }

    router.get('/:FilmID', function(req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getCharactersInFilm(res, mysql, context, req.params.FilmID, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 1) {
                res.render('charactersInFilms', context);
            }
        }
    });

    return router;
}();