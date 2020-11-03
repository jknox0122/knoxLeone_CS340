
function deleteCharacter(character_id){
    $.ajax({
        url: '/characters/' + character_id,
        type: 'DELETE',
        success: function(result){
            location.reload();
        }
    })
};
