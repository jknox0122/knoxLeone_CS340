
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

const deleteHomeworld = WorldID => {
    $.ajax({
        url: `/homeworlds/${WorldID}`,
        type: 'DELETE',
        success: result => {
            location.reload();
        }
    })
}

const deleteCharacterShip = (ShipID, CharacterID) => {
    $.ajax({
        url: `/add_character_ship/Ship/${ShipID}/Character/${CharacterID}`,
        type: 'DELETE',
        success: result => {
            window.location.reload();
        }
    })
}

const deleteCharacterFilm = (FilmID, CharacterID) => {
    $.ajax({
        url: `/characters_in_films/Film/${FilmID}/Character/${CharacterID}`,
        type: 'DELETE',
        success: result => {
            window.location.reload();
        }
    })
}

const deleteShip = ShipID => {
    $.ajax({
        url: `/ships/${ShipID}`,
        type: 'DELETE',
        success: result => {
            location.reload();
        }
    });
};