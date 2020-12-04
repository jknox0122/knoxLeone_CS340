module.exports = function() {
    var express = require('express');
    var router = express.Router();

    const getHomeworlds = (res, mysql, context, complete) => {
        mysql.pool.query('SELECT WorldID, Name, Population, Climate, Terrain FROM Homeworlds', function(err, results, fields) {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.homeworlds = results;
            complete();
        });
    }

    const getHomeworld = (res, mysql, context, WorldID, complete) => {
        var sql = 'SELECT WorldID, Name, Population, Climate, Terrain FROM Homeworlds WHERE WorldID = ?';
        var inserts = [WorldID];
        mysql.pool.query(sql, inserts, (err, results, fields) => {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.homeworld = results[0];
            complete();
        });
    }

    router.get('/', (req, res) => {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ['deleteItems.js'];
        var mysql = req.app.get('mysql');
        getHomeworlds(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 1){
                res.render('homeworlds', context);
            }
        }
    });

    router.get('/:WorldID', (req, res) => {
        callbackCount = 0;
        var context = {};
        context.jsscripts = ['updateItems.js'];
        var mysql = req.app.get('mysql');
        getHomeworld(res, mysql, context, req.params.WorldID, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 1) {
                res.render('updateHomeworld', context);
            }
        }
    });

    router.post('/', (req, res) => {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Homeworlds (Name, Population, Climate, Terrain) VALUES (?,?,?,?)";
        var inserts = [req.body.Name, req.body.Population, req.body.Climate, req.body.Terrain];
        sql = mysql.pool.query(sql, inserts, (err, results, fields) => {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.redirect('/homeworlds');
            }
        });
    });

    router.put('/:WorldID', (req, res) => {
        var mysql = req.app.get('mysql');
        var sql = 'UPDATE Homeworlds SET Name = ?, Population = ?, Climate = ?, Terrain = ? WHERE WorldID = ?';
        var inserts = [req.body.Name, req.body.Population, req.body.Climate, req.body.Terrain, req.params.WorldID];
        sql = mysql.pool.query(sql, inserts, (err, results, fields) => {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.status(200).end();
            }
        });
    });

    router.delete('/:WorldID', (req, res) => {
        var mysql = req.app.get('mysql');
        var sql = 'DELETE FROM Homeworlds WHERE WorldID = ?';
        var inserts = [req.params.WorldID];
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