const deleteCharacterFilm = (FilmID, CharacterID) => {
    $.ajax({
        url: `/characters_in_films/Film/${FilmID}/Character/${CharacterID}`,
        type: 'DELETE',
        success: result => {
            window.location.reload();
        }
    })
}