function customSearch(){
    $.ajax({
        url: '/customSearch/',
        type: 'PUT',
        data: $('#customSearch').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};