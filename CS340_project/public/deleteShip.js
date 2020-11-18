const deleteShip = ShipID => {
    $.ajax({
        url: `/ships/${ShipID}`,
        type: 'DELETE',
        success: result => {
            location.reload();
        }
    });
};