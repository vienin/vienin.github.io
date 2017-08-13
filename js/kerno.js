var buildAlbum = function (album, photos, count) {

    var linkscontainer = $('<div/>').addClass("row");
    var titlecontainer = $('<div/>')
        .append($('<div/>')
            .append($('<h2/>')
                .addClass("page-header")
                .text(album)
            )
            .addClass("col-lg-12")
        )
        .addClass("row");

    // Create a dedicated section for the album
    var id = (count == 0) ? "" : count;
    var section = $("<section/>")
        .append($("<div/>")
            .addClass("row")
            .addClass("portfolio-section")
            .attr("id", "photo" + id)
        )
        .append(titlecontainer)
        .append(linkscontainer)
        .addClass("content-section")
        .addClass("text-center")
        .addClass("photo-thumbnails")
        .insertBefore($('#contact'))

    var first;
    $.each(photos, function (thumb) {
        var photo = photos[thumb];

        if (first == undefined) {
            // Add an entry to the portfolio for the album
            first = $("<div/>")
                .append($('<a/>')
                    .append($('<div>')
                        .addClass("img-responsive")
                        .css("background", "url(" + thumb + ") 50% 50% no-repeat")
                        .addClass("portfolio-item")
                    )
                    .prop('href', "#photo" + id)
                )
                .append($('<h4/>')
                    .append($('<a/>').prop('href', "#photo" + id).text(album))
                )
                .append($('<p/>'))
                .addClass("col-lg-3")
                .addClass("col-md-4")
                .addClass("col-sm-6")
                .addClass("portfolio-album")
                .appendTo(portfoliocontainer);
        }

        // Add the image in the proper section
        $("<div/>")
            .append($('<a/>')
                .append($('<div>')
                    .addClass("img-responsive")
                    .css("background", "url(" + thumb + ") 50% 50% no-repeat")
                    .addClass("portfolio-item")
                )
                .prop('href', photo)
                .addClass('thumbnail')
                .attr('data-gallery', '')
            )
            .addClass("col-lg-3")
            .addClass("col-md-4")
            .addClass("col-sm-6")
            .addClass("thumb")
            .appendTo(linkscontainer);
    });
}


var buildPortfolio = function (index) {
    var albums = Object.keys(index).sort();

    // Add the images as links with thumbnails to the page:
    portfoliocontainer = $('<div/>').addClass("row").appendTo($('#portfolio-container'));

    var count = 0;
    $.each(albums, function (i) {
        var album = albums[i];

        var linkscontainer = $('<div/>').addClass("row");
        var titlecontainer = $('<div/>')
            .append($('<div/>')
                .append($('<h2/>')
                    .addClass("page-header")
                    .text(album)
                )
                .addClass("col-lg-12")
            )
            .addClass("row");

        // Create a dedicated section for the album
        var id = (count == 0) ? "" : count;
        var section = $("<section/>")
            .append($("<div/>")
                .addClass("row")
                .addClass("portfolio-section")
                .attr("id", "photo" + id)
            )
            .append(titlecontainer)
            .append(linkscontainer)
            .addClass("content-section")
            .addClass("text-center")
            .addClass("photo-thumbnails")
            .insertBefore($('#contact'))

        var first;
        $.each(index[album], function (thumb) {
            var photo = index[album][thumb];

            if (first == undefined) {
                // Add an entry to the portfolio for the album
                first = $("<div/>")
                    .append($('<a/>')
                        .append($('<div>')
                            .addClass("img-responsive")
                            .css("background", "url(" + thumb + ") 50% 50% no-repeat")
                            .addClass("portfolio-item")
                        )
                        .prop('href', "#photo" + id)
                    )
                    .append($('<h4/>')
                        .append($('<a/>').prop('href', "#photo" + id).text(album))
                    )
                    .append($('<p/>'))
                    .addClass("col-lg-3")
                    .addClass("col-md-4")
                    .addClass("col-sm-6")
                    .addClass("portfolio-album")
                    .appendTo(portfoliocontainer);
            }

            // Add the image in the proper section
            $("<div/>")
                .append($('<a/>')
                    .append($('<div>')
                        .addClass("img-responsive")
                        .css("background", "url(" + thumb + ") 50% 50% no-repeat")
                        .addClass("portfolio-item")
                    )
                    .prop('href', photo)
                    .addClass('thumbnail')
                    .attr('data-gallery', '')
                )
                .addClass("col-lg-3")
                .addClass("col-md-4")
                .addClass("col-sm-6")
                .addClass("thumb")
                .appendTo(linkscontainer);
        });
        count++;
    });

    // Add pagination
    // var pagelist = $("<ul/>").addClass("pagination");
    // $("<div/>")
    //     .append($("<div/>")
    //         .append(pagelist)
    //         .addClass("col-lg-12")
    //     )
    //     .addClass("row")
    //     .addClass("text-center")
    //     .appendTo(portfoliocontainer);
}

var buildMenu = function (photo) {
    $("<div/>")
        .css("border-radius", "25px")
        .append($('<img/>')
            .addClass("featurette-image")
            .addClass("img-responsive")
            .addClass("pull-right")
            .css("margin-top", "-240px")
            .prop('src', photo)
        )
        .prependTo($('#menu'))
}

// Mode is the way how to the script retrieve the photo (files|facebook)
// TODO: Design an architecture based on backend types
var mode = "facebook"

$(function() {
    portfoliocontainer = $('<div/>').addClass("row").appendTo($('#portfolio-container'));

    var appID = "908471955878576";
    var appSecret = "52520b77a9c88c82263003b877d68d45";
    var tokenUrl = "https://graph.facebook.com/oauth/access_token?client_id=" + appID +
                   "&client_secret=" + appSecret +
                   "&grant_type=client_credentials";

    // Get the token
    $.get(tokenUrl, function(accessTokenData) {
        var accessToken = "access_token=" + accessTokenData.access_token
        var menusUrl = "https://graph.facebook.com/1399682133418503/photos?" + accessToken;
        // Get all posts all search the first one about the menu
        // NOTE: The api do not provides the url of the pdf menu yet
        $.getJSON(menusUrl, function(menuList) {
            photo = menuList.data[menuList.data.length - 1]
            buildMenu("https://graph.facebook.com/" + photo.id + "/picture?" + accessToken);
            return false;
        })

        var albumsUrl = "https://graph.facebook.com/972308122822575/albums?" + accessToken;

        // Get all page ablums, and build each photos sections
        $.getJSON(albumsUrl, function(albumsList) {
            // Add the images as links with thumbnails to the page:
            var count = 0;

            // Build the index from the facebook page albums
            blackList = [ "Profile Pictures", "Cover Photos", "Timeline Photos", "Menu de la semaine" ]
            $.each(albumsList.data, function (album) {
                album = albumsList.data[album]

                if ($.inArray(album.name, blackList) > -1) { return true ; }

                // Build the list of the photos url indexed by thumbs url
                var photos = {}
                var albumUrl = "https://graph.facebook.com/" + album.id + "/photos?" + accessToken;
                $.getJSON(albumUrl, function(photosList) {
                   $.each(photosList.data, function (photo) {
                        photo = photosList.data[photo]
                        var photoUrl = "https://graph.facebook.com/" + photo.id + "/picture?" + accessToken;
                        photos[photoUrl] = photoUrl;
                    })

                    // Build the ablum from the facebook page albums photos
                    var photos_sources = Object.keys(photos)
                    if (photos_sources.length > 0) {
                        buildAlbum(album.name, photos, count);
                    }

                    count++;
                })
            })
        })
    })

    $('#blueimp-gallery').data('useBootstrapModal', 0);
});
