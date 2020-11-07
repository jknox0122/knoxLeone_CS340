  
function updateCharacter(character_id){
    $.ajax({
        url: '/characters/' + character_id,
        type: 'PUT',
        data: $('#updateCharacter').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};

function updateFilm(film_id){
    $.ajax({
        url: '/films/' + film_id,
        type: 'PUT',
        data: $('#updateCharacter').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};