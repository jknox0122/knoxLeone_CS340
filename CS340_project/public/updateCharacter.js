
function updateCharacter(CharacterID){
    $.ajax({
        url: `/characters/${CharacterID}`,
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
        data: $('#updateFilm').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};