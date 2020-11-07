function myFunction() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}

function specificSearch(first_name){
    $.ajax({
        url: '/results/' + first_name,
        type: 'PUT',
        data: $('#specificSearch').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};