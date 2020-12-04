module.exports = function() {
    var express = require('express');
    var router = express.Router();

    const getShips = (res, mysql, context, complete) => {
        mysql.pool.query('SELECT ShipID, Name, Crew_Size, Length, Model FROM Piloted_Ships', (err, results, fields) =>{
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.ships = results;
            complete();
        });
    }

    const getShip = (res, mysql, context, ShipID, complete) => {
        var sql = 'SELECT * FROM Piloted_Ships WHERE ShipID = ?';
        var inserts = [ShipID];
        mysql.pool.query(sql, inserts, (err, results, fields) => {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.ship = results[0];
            complete();
        })
    }

    router.get('/', (req, res) => {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ['deleteItems.js'];
        var mysql = req.app.get('mysql');
        getShips(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 1){
                res.render('ships', context);
            }
        }
    });

    router.get('/:ShipID', (req, res) => {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ['updateItems.js'];
        var mysql = req.app.get('mysql');
        getShip(res, mysql, context, req.params.ShipID, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 1) {
                res.render('updateShip', context);
            }
        }
    });

    router.post('/', (req, res) => {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Piloted_Ships (Name, Crew_Size, Length, Model) VALUES (?,?,?,?)";
        var inserts = [req.body.Name, req.body.Crew_Size, req.body.Length, req.body.Model];
        sql = mysql.pool.query(sql, inserts,(err, results, fields) => {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.redirect('/ships');
            }
        });
    });

    router.put('/:ShipID', (req, res) => {
        var mysql = req.app.get('mysql');
        var sql = 'UPDATE Piloted_Ships SET Name = ?, Crew_Size = ?, Length = ?, Model = ? WHERE ShipID = ?';
        var inserts = [req.body.Name, req.body.Crew_Size, req.body.Length, req.body.Model, req.params.ShipID];
        sql = mysql.pool.query(sql, inserts, (err, results, fields) => {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.status(200).end();
            }
        });
    });

    router.delete('/:ShipID', (req, res) => {
        var mysql = req.app.get('mysql');
        var sql = 'DELETE FROM Piloted_Ships WHERE ShipID = ?';
        var inserts = [req.params.ShipID];
        sql = mysql.pool.query(sql, inserts, (err, results, fields) => {
            if(err) {
                res.write(JSON.stringify);
                res.status(400);
                res.end();
            } else {
                res.status(202).end();
            }
        });
    });

    return router;
}();