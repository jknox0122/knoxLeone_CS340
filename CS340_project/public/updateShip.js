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