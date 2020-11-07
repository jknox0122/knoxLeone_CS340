
function deleteCharacter(character_id){
    $.ajax({
        url: '/characters/' + character_id,
        type: 'DELETE',
        success: function(result){
            location.reload();
        }
    })
};

function deleteFilm(film_id){
    $.ajax({
        url: '/films/' + film_id,
        type: 'DELETE',
        success: function(result){
            location.reload();
        }
    })
};
