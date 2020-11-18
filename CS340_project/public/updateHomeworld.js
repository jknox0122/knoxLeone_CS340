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