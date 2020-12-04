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

function myFunction() {
    var selected = document.getElementById("typeSearch").value;
    var cs = document.getElementById('CharactersSearch');
    var Filmsearch = document.getElementById('FilmsSearch');
    var ps = document.getElementById('planetSearch');
    var ss = document.getElementById('shipSearch');
    if (selected === "Characters") {
        if (Filmsearch.style.display === "block" || ps.style.display === "block" || ss.style.display === "block") {
            Filmsearch.style.display = "none";
            ps.style.display = "none";
            ss.style.display = "none";
        }

        if (cs.style.display === "block") {
            cs.style.display = "none";
        } else {
            cs.style.display = "block";
        }
    } else if (selected === "Films") {
        if (cs.style.display === "block" ||  ps.style.display === "block" || ss.style.display === "block") {
            cs.style.display = "none";
            ps.style.display = "none";
            ss.style.display = "none";
        }
        if (Filmsearch.style.display === "block") {
            Filmsearch.style.display = "none";
        } else {
            Filmsearch.style.display = "block";
        }
    } else if (selected === "Homeworlds") {
        if (cs.style.display === "block" || Filmsearch.style.display === "block" || ss.style.display === "block") {
            cs.style.display = "none";
            Filmsearch.style.display = "none";
            ss.style.display = "none";
        }
        if (ps.style.display === "block") {
            ps.style.display = "none";
        } else {
            ps.style.display = "block";
        }
    } else if (selected === "Ships") {
        if (cs.style.display === "block" || Filmsearch.style.display === "block" || ps.style.display === "block") {
            cs.style.display = "none";
            Filmsearch.style.display = "none";
            ps.style.display = "none";
        }
        if (ss.style.display === "block") {
            ss.style.display = "none";
        } else {
            ss.style.display = "block";
        }
    }
}