module.exports = function() {
    var express = require('express');
    var router = express.Router();

    function getShips(res, mysql, context, complete) {
        mysql.pool.query('SELECT ShipID, Name, Crew_Size, Length, Model FROM Piloted_Ships', function(err, results, fields) {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.ships = results;
            complete();
        });
    }

    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getShips(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 1){
                res.render('ships', context);
            }
        }
    });

    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Piloted_Ships (Name, Crew_Size, Length, Model) VALUES (?,?,?,?)";
        var inserts = [req.body.Name, req.body.Crew_Size, req.body.Length, req.body.Model];
        sql = mysql.pool.query(sql, inserts, function(err, results, fields) {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.redirect('/ships');
            }
        });
    });
    return router;
}();