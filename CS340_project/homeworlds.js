module.exports = function() {
    var express = require('express');
    var router = express.Router();

    function getHomeworlds(res, mysql, context, complete) {
        mysql.pool.query('SELECT WorldID, Name, Population, Climate, Terrain FROM Homeworlds', function(err, results, fields) {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.homeworlds = results;
            complete();
        });
    }

    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getHomeworlds(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if(callbackCount >= 1){
                res.render('homeworlds', context);
            }
        }
    });

    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Homeworlds (Name, Population, Climate, Terrain) VALUES (?,?,?,?)";
        var inserts = [req.body.Name, req.body.Population, req.body.Climate, req.body.Terrain];
        sql = mysql.pool.query(sql, inserts, function(err, results, fields) {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            } else {
                res.redirect('/homeworlds');
            }
        });
    });
    return router;
}();