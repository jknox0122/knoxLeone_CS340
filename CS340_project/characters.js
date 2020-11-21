module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getCharacters(res, mysql, context, complete){
        var sql = 'SELECT c.CharacterID, c.Name, c.Birthdate, c.Gender, c.Species, c.Height, h.Name as homeworld from Characters c LEFT JOIN Homeworlds h ON h.WorldID = c.WorldID';
        mysql.pool.query(sql, function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end;
            }
            context.characters = results;
            complete();
        });
    }

    function getCharacter(res, mysql, context, CharacterID, complete){
        var sql = "SELECT c.CharacterID, c.Name, c.Birthdate, c.Gender, c.Species, c.Height, h.Name as homeworld from Characters c LEFT JOIN Homeworlds h ON h.WorldID = c.WorldID WHERE c.CharacterID = ?";
        var inserts = [CharacterID];
        mysql.pool.query(sql,inserts, (error, results, fields) => {
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results[0];
            complete();
        });
    }

    const getHomeworlds = (res, mysql, context, complete) => {
        mysql.pool.query('SELECT WorldID, Name, Population, Climate, Terrain FROM Homeworlds', (err, results, fields) => {
            if(err) {
                res.write(JSON.stringify(err));
                res.end();
            }
            context.homeworlds = results;
            complete();
        });
    }

    router.get('/', function(req,res){
        var callbackCount = 0;
        var context ={};
        context.jsscripts = ["deleteCharacter.js"];
        var mysql = req.app.get('mysql');
        getCharacters(res,mysql,context,complete);
        getHomeworlds(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('characters',context);
            }
        }
    });

    router.get('/specificSearch', function(req,res){
        var context = {};
        context.jsscripts = ["specificSearch.js"];
        res.render('specificSearch',context);
    })


    router.get('/:CharacterID', function(req,res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateCharacter.js"];
        var mysql = req.app.get('mysql');
        getCharacter(res,mysql,context,req.params.CharacterID,complete);
        getHomeworlds(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('updateCharacter',context);
            }
        }
    });

    router.post('/',function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Characters (Name, Birthdate, Gender, Species, Height, WorldID) VALUES (?,?,?,?,?,?)";
        var inserts = [req.body.Name, req.body.Birthdate, req.body.Gender, req.body.Species, req.body.Height, req.body.WorldID];
        sql = mysql.pool.query(sql, inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            } else{
                console.log(req.body);
                res.redirect('/characters');
            }
        });
    });

    router.put('/:CharacterID', function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Characters SET Name = ?, Birthdate = ?, Gender = ?, Species = ?, Height = ?, WorldID = ? WHERE CharacterID = ?";
        var inserts = [req.body.Name, req.body.Birthdate, req.body.Gender, req.body.Species, req.body.Height, req.body.WorldID, req.params.CharacterID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            } else{
                res.status(200);
                res.end();
            }
        });
    });

    router.delete('/:CharacterID',function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Characters WHERE CharacterID = ?";
        var inserts = [req.params.CharacterID];
        sql = mysql.pool.query(sql,inserts,function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            } else{
                res.status(202).end();
            }
        });
    });
    return router;
}();