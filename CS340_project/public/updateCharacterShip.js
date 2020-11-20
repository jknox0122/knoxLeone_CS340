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