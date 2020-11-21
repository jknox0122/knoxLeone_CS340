const deleteCharacterShip = (ShipID, CharacterID) => {
    $.ajax({
        url: `/add_character_ship/Ship/${ShipID}/Character/${CharacterID}`,
        type: 'DELETE',
        success: result => {
            window.location.reload();
        }
    })
}