
function updateCharacter(CharacterID){
    $.ajax({
        url: `/characters/${CharacterID}`,
        type: 'PUT',
        data: $('#updateCharacter').serialize(),
        success: function(result){
            window.location.replace("/characters");
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

const updateHomeworld = WorldID => {
    $.ajax({
        url: `/homeworlds/${WorldID}`,
        type: 'PUT',
        data: $('#updateHomeworld').serialize(),
        success: function(result) {
            window.location.replace('./');
        }
    });
};

const updateCharacterShip = (ShipID, CharacterID) => {
    $.ajax({
        url: `/add_character_ship/edit/ship/${ShipID}/character/${CharacterID}`,
        type: 'PUT',
        data: $('#updateCharacterShip').serialize(),
        success: result => {
            window.location.replace('./');
        }
    });
}

const updateShip = ShipID => {
    $.ajax({
        url: `/ships/${ShipID}`,
        type: 'PUT',
        data: $('#updateShip').serialize(),
        success: result => {
            window.location.replace('./')
        }
    });
};