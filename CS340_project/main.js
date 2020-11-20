var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static',express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 3196);
app.set('mysql', mysql);

//res.render('view', { title: 'my other page', layout: 'other' });
app.get('/', (req, res) => res.render("index"));
app.use('/characters', require('./characters.js'));
app.use('/films', require('./films.js'));
app.use('/homeworlds', require('./homeworlds'));
app.use('/ships', require('./ships'));
app.use('/characters_in_films', require('./charactersInFilms'));
app.use('/add_character_ship', require('./addCharacterShip'));
app.use('/add_characters_in_films', require('./addCharacterToFilm'));
app.use('/specificSearch', require('./characters.js'));
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
