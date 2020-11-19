function myFunction() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}

function specificSearch(Name){
    $.ajax({
        url: '/results/' + Name,
        type: 'PUT',
        data: $('#specificSearch').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};