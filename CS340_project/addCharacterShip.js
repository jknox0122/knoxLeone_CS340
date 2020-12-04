module.exports = function() {
    var express = require('express');
    var router = express.Router();

    const getShips = (res, mysql, context, complete) => {
        mysql.pool.query('SELECT ShipID, Name AS Ship_Name FROM Piloted_Ships ORDER BY Name ASC', (err, results, fields) =>{
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.ships = results;
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

    function getCharactersPilotShip(res, mysql, context, complete){
        var sql = "SELECT cs.ShipID, cs.CharacterID, c.Name, ps.Name as Ship_Name, ps.Model FROM Characters c INNER JOIN Character_Pilot_Ship cs ON c.CharacterID = cs.CharacterID INNER JOIN Piloted_Ships ps ON ps.ShipID = cs.ShipID";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.characterShip = results;
            complete();
        });
    }

    // function getCharacterPilotShip(res, mysql, context, ShipID, CharacterID, complete){
    //     var sql = "SELECT ShipID, CharacterID FROM Character_Pilot_Ship WHERE ShipID = ? AND CharacterID = ?";
    //     var inserts = [ShipID, CharacterID];
    //     mysql.pool.query(sql, inserts, function(error, results, fields){
    //         if(error){
    //             res.write(JSON.stringify(error));
    //             res.end()
    //         }
    //         context.cs = results[0];
    //         complete();
    //     });
    // }

    // const getCharacter = (res, mysql, context, CharacterID, complete) => {
    //     var sql = 'SELECT CharacterID, Name FROM Characters WHERE CharacterID = ?';
    //     var inserts = [CharacterID];
    //     mysql.pool.query(sql, inserts, (err, results, fields) => {
    //         if(err) {
    //             res.write(JSON.stringify(err));
    //             res.end();
    //         }
    //         context.character = results[0];
    //         complete();
    //     });
    // }

    // const getShip = (res, mysql, context, ShipID, complete) => {
    //     var sql = 'SELECT ShipID, Name AS Ship_Name FROM Piloted_Ships WHERE ShipID = ?';
    //     var inserts = [ShipID];
    //     mysql.pool.query(sql, inserts, (err, results, fields) => {
    //         if(err) {
    //             res.write(JSON.stringify(err));
    //             res.end();
    //         }
    //         context.ship = results[0];
    //         complete();
    //     });
    // }

    router.get('/', (req, res) => {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ['deleteItems.js'];
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

    // router.get('/edit/ship/:ShipID/character/:CharacterID', (req, res) => {
    //     var callbackCount = 0;
    //     var context = {};
    //     context.jsscripts = ['updateCharacterShip.js'];
    //     var mysql = req.app.get('mysql');
    //     // getCharacter(res, mysql, context, req.params.CharacterID, complete);
    //     // getShip(res, mysql, context, req.params.ShipID, complete);
    //     getCharacterPilotShip(res, mysql, context, req.params.ShipID, req.params.CharacterID, complete);
    //     getShips(res, mysql, context, complete);
    //     getCharacters(res, mysql, context, complete);
    //     function complete() {
    //         callbackCount++;
    //         if(callbackCount >= 3) {
    //             res.render('updateCharacterShip', context);
    //         }
    //     }
    // });

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

    // router.put('/edit/ship/:ShipID/character/:CharacterID', (req, res) => {
    //     var mysql = req.app.get('mysql');
    //     var sql = 'UPDATE Character_Pilot_Ship SET ShipID = ?, CharacterID = ? WHERE ShipID = ? AND CharacterID = ?';
    //     var inserts = [req.body.ShipID, req.body.CharacterID];
    //     sql = mysql.pool.query(sql, inserts, (err, results, fields) => {
    //         if(err) {
    //             res.write(JSON.stringify(err));
    //             res.end();
    //         } else {
    //             res.status(200).end();
    //         }
    //     });
    // });

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
                res.status(202).end();
            }
        });
    });

    return router;
}();