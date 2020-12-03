const { Types } = require('mysql');

module.exports = function(){
    var express = require('express');
    var router = express.Router();
    var app = express();



    router.get('/', function(req,res){
        var callbackCount = 0;
        var context ={};
        var mysql = req.app.get('mysql');
        getFilms(res,mysql,context,complete);
        getWorlds(res,mysql,context,complete);
        getPiloted_Ships(res,mysql,context,complete);
        getCharacters(res,mysql,context,complete);
        getTerrain(res,mysql,context,complete);
        function complete(){
            callbackCount++
            if(callbackCount >= 5){
                res.render('customSearch',context);
            }
        }
    });
    function buildQueryFilms(params){
        var conditions = [];
        var joins = [];
        var values = [];

        if(params.Name_Of_Movie != ""){
            conditions.push("Films.Name_Of_Movie LIKE ?");
            values.push("%" + params.Name_Of_Movie + "%");
        }
        if(params.IMDB_Rating != ""){
            conditions.push("IMDB_Rating LIKE ?");
            values.push("%" + params.IMDB_Rating + "%");
        }
        if(params.Year_Released != ""){
            conditions.push("Year_Released LIKE ?");
            values.push("%" + params.Year_Released + "%")
        }
        if(params.Directed_By != ""){
            conditions.push("Directed_By LIKE ?")
            values.push("%" + params.Directed_By + "%");
        }
        if(params.character_name != ""){
            conditions.push("Characters.Name LIKE ?");
            values.push("%" + params.character_name + "%");
        }

        return {
            WHERE: conditions.length ? 
                    conditions.join(' AND ') : '1',
            values: values
        };
    }

    function buildQuery(params){
        var conditions = [];
        var joins = [];
        var values = [];
        var conditionsStr;

        if (params.Char_Name != ""){
            conditions.push("Characters.Name LIKE ?");
            values.push("%" + params.Char_Name + "%");
        }
        if (params.Birthdate != ""){
            conditions.push("Birthdate = ?")
            values.push(params.Birthdate);
        }
        if (params.Species != ""){
            conditions.push("Species LIKE ?");
            values.push("%" + params.Species + "%");
        }
        if(params.Gender != ""){
            conditions.push("Gender = ?");
            values.push(params.Gender);
        }
        if(params.Name_Of_Movie != ""){
            conditions.push("Films.Name_Of_Movie = ?");
            values.push(params.Name_Of_Movie);
        }
        if(params.Name != ""){
            conditions.push("Homeworlds.Name AS Homeworld_Name = ?");
            values.push(params.Name);
        }
        if(params.Piloted_Ships != ""){
            conditions.push("Piloted_Ships.Name = ?")
            values.push(params.Piloted_Ships);
        }
        return {
            WHERE: conditions.length ? 
                    conditions.join(' AND ') : '1',
            values: values
        };
    }

    function getCustomSearchFilms(res,mysql,context,attributes,complete){
        var conditions = buildQueryFilms(attributes);
        var sql;
            sql = "SELECT Name_Of_Movie, Year_Released, IMDB_Rating, Directed_By FROM Films";
            sql += " JOIN Characters_In_Films ON Films.FilmID = Characters_In_Films.FilmID";
            sql += " JOIN Characters ON Characters_In_Films.CharacterID = Characters.CharacterID";
            sql += " WHERE " + conditions.WHERE;
            sql += " GROUP BY Films.FilmID;";

        sql = mysql.pool.query(sql,conditions.values,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Films = results;
            complete();
        });
    }

    function getCustomSearch(res,mysql,context,attributes,complete){
        var conditions = buildQuery(attributes);
        var sql;
        if(attributes.Name_Of_Movie != "" && attributes.Name != "" && attributes.Piloted_Ships != ""){
            sql = "SELECT Characters.Name AS Character_Name, Birthdate, Homeworlds.Name AS Homeworld_Name, Gender, Species, Height FROM Characters";
            sql += " JOIN Characters_In_Films ON Characters.CharacterID = Characters_In_Films.CharacterID";
            sql += " JOIN Films ON Characters_In_Films.FilmID = Films.FilmID";
            sql += " JOIN Homeworlds ON Characters.WorldID = Homeworlds.WorldID";
            sql += " JOIN Character_Pilot_Ship ON Characters.CharacterID = Character_Pilot_Ship.CharacterID";
            sql += " JOIN Piloted_Ships ON Character_Pilot_Ship.ShipID = Piloted_Ships.ShipID";
            sql += " WHERE " + conditions.WHERE + ';';
        }
        else if(attributes.Name_Of_Movie != "" && attributes.Name != "" && attributes.Piloted_Ships == ""){
            sql = "SELECT Characters.Name AS Character_Name, Birthdate, Homeworlds.Name AS Homeworld_Name, Gender, Species, Height FROM Characters";
            sql += " JOIN Characters_In_Films ON Characters.CharacterID = Characters_In_Films.CharacterID";
            sql += " JOIN Films ON Characters_In_Films.FilmID = Films.FilmID";
            sql += " JOIN Homeworlds ON Characters.WorldID = Homeworlds.WorldID";
            sql += " WHERE " + conditions.WHERE + ';';
        }
        else if(attributes.Name_Of_Movie != "" && attributes.Piloted_Ships != "" && attributes.Name == ""){
            sql = "SELECT Characters.Name AS Character_Name, Birthdate, Homeworlds.Name AS Homeworld_Name, Gender, Species, Height FROM Characters";
            sql += " JOIN Characters_In_Films ON Characters.CharacterID = Characters_In_Films.CharacterID";
            sql += " JOIN Films ON Characters_In_Films.FilmID = Films.FilmID";
            sql += " JOIN Homeworlds ON Characters.WorldID = Homeworlds.WorldID";
            sql += " JOIN Character_Pilot_Ship ON Characters.CharacterID = Character_Pilot_Ship.CharacterID";
            sql += " JOIN Piloted_Ships ON Character_Piloted_Ship.ShipID = Piloted_Ships.ShipID";
            sql += " WHERE " + conditions.WHERE + ';';
        }
        else if(attributes.Piloted_Ships && attributes.Name != "" && attributes.Name_Of_Movie == ""){
            sql = "SELECT Characters.Name AS Character_Name, Birthdate, Homeworlds.Name AS Homeworld_Name, Gender, Species, Height FROM Characters";
            sql += " JOIN Characters_In_Films ON Characters.CharacterID = Characters_In_Films.CharacterID";
            sql += " JOIN Films ON Characters_In_Films.FilmID = Films.FilmID";
            sql += " JOIN Homeworlds ON Characters.WorldID = Homeworlds.WorldID";
            sql += " JOIN Character_Pilot_Ship ON Characters.CharacterID = Character_Pilot_Ship.CharacterID";
            sql += " JOIN Piloted_Ships ON Character_Piloted_Ship.ShipID = Piloted_Ships.ShipID";
            sql += " WHERE " + conditions.WHERE + ';';
        }
        else if(attributes.Name_Of_Movie != "" && attributes.Name == "" && attributes.Piloted_Ships == ""){
            sql = "SELECT Characters.Name AS Character_Name, Birthdate, Homeworlds.Name AS Homeworld_Name, Gender, Species, Height FROM Characters";
            sql += " JOIN Characters_In_Films ON Characters.CharacterID = Characters_In_Films.CharacterID";
            sql += " JOIN Films ON Characters_In_Films.FilmID = Films.FilmID";
            sql += " JOIN Homeworlds ON Characters.WorldID = Homeworlds.WorldID";
            sql += " WHERE " + conditions.WHERE + ";";
        }
        else if(attributes.Piloted_Ships != "" && attributes.Name == "" && attributes.Name_Of_Movie == ""){
            sql = "SELECT Characters.Name AS Character_Name, Birthdate, Homeworlds.Name AS Homeworld_Name, Gender, Species, Height FROM Characters";
            sql += " JOIN Character_Pilot_Ship ON Characters.CharacterID = Character_Pilot_Ship.CharacterID";
            sql += " JOIN Piloted_Ships ON Character_Pilot_Ship.ShipID = Piloted_Ships.ShipID";
            sql += " JOIN Homeworlds ON Characters.WorldID = Homeworlds.WorldID";
            sql += " WHERE " + conditions.WHERE + ';';
        }
        else if(attributes.Name != "" && attributes.Piloted_Ships == "" && attributes.Name_Of_Movie == ""){
            sql = "SELECT Characters.Name AS Character_Name, Birthdate, Homeworlds.Name AS Homeworld_Name, Gender, Species, Height FROM Characters";
            sql += " JOIN Homeworlds ON Characters.WorldID = Homeworlds.WorldID";
            sql += " WHERE " + conditions.WHERE + ';';
        }
        else{
            sql = "SELECT Characters.Name AS Character_Name, Birthdate, Gender, Species, Height, Homeworlds.Name AS Homeworld_Name FROM Characters";
            sql += " JOIN Homeworlds ON Characters.WorldID = Homeworlds.WorldID";
            sql += " WHERE " + conditions.WHERE + ';';
        }
        console.log(sql);
        sql = mysql.pool.query(sql,conditions.values,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Characters = results;
            complete();
        });
        
    }

router.post('/', function(req,res){
        callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        var inserts = req.body;
        if(inserts.typeSearch == "Characters"){
            getCustomSearch(res, mysql, context, inserts,complete);
            function complete(){
                callbackCount++;
                if(callbackCount >=1){
                    res.render('customResults',{inserts, context, selector: 'Characters'});
                }
            }
        } else if(inserts.typeSearchFilms == "Films")
            getCustomSearchFilms(res, mysql, context, inserts,complete);
            function complete(){
                callbackCount++;
                if(callbackCount >=1){
                    res.render('customResults',{inserts, context, selector: 'Films'});
                }
            }
        
            
    });

    function getFilms(res,mysql,context,complete){
        mysql.pool.query('SELECT FilmID, Name_Of_Movie, Year_Released, IMDB_Rating, Directed_By FROM Films', function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Films = results;
            complete();
        });
    }
    
    function getWorlds(res,mysql,context,complete){
        mysql.pool.query('SELECT WorldID, Name, Population, Climate, Terrain FROM Homeworlds', function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Homeworlds = results;
            complete();
        });
    }

    function getTerrain(res,mysql,context,complete){
        mysql.pool.query('SELECT Terrain FROM Homeworlds', function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Terrain = results;
            complete();
        });
    }

    function getPiloted_Ships(res,mysql,context,complete){
        mysql.pool.query('SELECT ShipID, Name, Crew_Size, Length, Model FROM Piloted_Ships', function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Piloted_Ships = results;
            complete();
        });
    }

    function getCharacters(res,mysql,context,complete){
        mysql.pool.query('SELECT CharacterID, Name, Birthdate, Gender, Species, Height FROM Characters', function(error,results,fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Characters = results;
            complete();
        });
    }

    
    return router;

}();