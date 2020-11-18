module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var app = express();

    function getCharacters(res,mysql,context,complete){
        mysql.pool.query('SELECT CharacterID, First_Name, Last_Name, Birthdate, Gender, Species, Height FROM Characters', function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    function getCharacter(res, mysql, context, CharacterID, complete){
        var sql = "SELECT CharacterID, First_Name, Last_Name, Birthdate, Gender, Species, Height FROM Characters WHERE CharacterID = ?";
        var inserts = [CharacterID];
        mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.character = results[0];
            complete();
        });
    }

    router.get('/', function(req,res){
        var callbackCount = 0;
        var context ={};
        context.jsscripts = ["deleteCharacter.js"];
        var mysql = req.app.get('mysql');
        getCharacters(res,mysql,context,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >=1){
                res.render('characters',context);
            }
        }
    });

    router.get('/specificSearch', function(req,res){
        var context = {};
        context.jsscripts = ["specificSearch.js"];
        res.render('specificSearch',context);
    } )


    router.get('/:CharacterID', function(req,res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateCharacter.js"];
        var mysql = req.app.get('mysql');
        getCharacter(res,mysql,context,req.params.CharacterID,complete);
        function complete(){
            callbackCount++;
            if(callbackCount >=1){
                res.render('updateCharacter',context);
            }
        }
    });

    router.post('/',function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Characters ( First_Name, Last_Name, Birthdate, Gender, Species, Height) VALUES (?,?,?,?,?,?)";
        var inserts = [req.body.First_Name, req.body.Last_Name, req.body.Birthdate, req.body.Gender, req.body.Species, req.body.Height];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            } else{
                res.redirect('/characters');
            }
        });
    });

    router.put('/:CharacterID', function(req,res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Characters SET First_Name = ?, Last_Name = ?, Birthdate = ?, Gender = ?, Species = ?, Height = ? WHERE CharacterID = ?";
        var inserts = [req.body.First_Name, req.body.Last_Name, req.body.Birthdate, req.body.Gender, req.body.Species, req.body.Height, req.params.CharacterID];
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