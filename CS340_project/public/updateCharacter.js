  
function updateCharacter(character_id){
    $.ajax({
        url: '/characters/' + character_id,
        type: 'PUT',
        data: $('#updateCharacter').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};