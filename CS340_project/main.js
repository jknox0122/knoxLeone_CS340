const express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
const path= require('path');

const app = express();
var hbs = require('express-handlebars');

app.engine('hbs', hbs( {
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials'
}));

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/static',express.static('public'));
app.set('view engine', 'hbs');
app.set('port', 3199);
app.set('mysql', mysql);

app.get('/', (req, res) => res.render("index"));
app.use('/characters', require('./characters.js'));
app.use('/films', require('./films.js'));
app.use('/homeworlds', require('./homeworlds'));
app.use('/ships', require('./ships'));
app.use('/characters_in_films', require('./charactersInFilms'));
app.use('/add_character_ship', require('./addCharacterShip'));
app.use('/add_characters_in_films', require('./addCharacterToFilm'));
app.use('/customSearch', require('./customSearch.js'));
app.use('/customResults', require('./customSearch.js'));
app.use(express.static(__dirname+'/public'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
