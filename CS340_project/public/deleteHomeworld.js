const deleteHomeworld = WorldID => {
    $.ajax({
        url: `/homeworlds/${WorldID}`,
        type: 'DELETE',
        success: result => {
            location.reload();
        }
    })
}