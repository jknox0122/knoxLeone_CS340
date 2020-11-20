module.exports = function() {
    var express = require('express');
    var router = express.Router();

    const getShips = (res, mysql, context, complete) => {
        mysql.pool.query('SELECT ShipID, Name AS Ship_Name FROM Piloted_Ships', (err, results, fields) =>{
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.ships = results;
            complete();
        });
    }

    /* get people to populate in dropdown */
    function getCharacters(res, mysql, context, complete){
        mysql.pool.query("SELECT CharacterID, Name FROM Characters", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    function getCharactersPilotShip(res, mysql, context, complete){
        sql = "SELECT cs.ShipID, cs.CharacterID, c.Name, ps.Name as Ship_Name FROM Characters c INNER JOIN Character_Pilot_Ship cs on c.CharacterID = cs.CharacterID INNER JOIN Piloted_Ships ps on ps.ShipID = cs.ShipID"
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.characterShip = results;
            complete();
        });
    }

    router.get('/', (req, res) => {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ['deleteCharacterShip.js'];
        var mysql = req.app.get('mysql');
        getShips(res, mysql, context, complete);
        getCharacters(res, mysql, context, complete);
        getCharactersPilotShip(res, mysql, context, complete)
        function complete() {
            callbackCount++;
            if(callbackCount >= 3){
                res.render('characterShip', context);
            }
        }
    });

    router.post('/', (req, res) => {
        var mysql = req.app.get('mysql');
        var ships = req.body.ShipID;
        var character = req.body.CharacterID;
        var sql = 'INSERT INTO Character_Pilot_Ship (ShipID, CharacterID) VALUES ( (SELECT s.ShipID FROM Piloted_Ships s WHERE s.ShipID = ?), (SELECT c.CharacterID FROM Characters c WHERE c.CharacterID = ?) )';
        var inserts = [ships, character];
        sql = mysql.pool.query(sql, inserts, (err, results, fields) => {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.redirect('/add_character_ship');
            }
        });
        
    });

    router.delete('/Ship/:ShipID/Character/:CharacterID', (req, res) => {
        var mysql = req.app.get('mysql');
        var sql = 'DELETE FROM Character_Pilot_Ship WHERE ShipID = ? AND CharacterID = ?';
        var inserts = [req.params.ShipID, req.params.CharacterID];
        sql = mysql.pool.query(sql, inserts, (err, results, fields) => {
            if(err) {
                res.write(JSON.stringify(err));
                res.status(400);
                res.end();
            } else {
                res.status(200).end();
            }
        });
    });

    return router;
}();