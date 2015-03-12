$(function() {
    $.ajax("http://vimeo.com/api/v2/whitneymuseum/videos.json?page=1", {
        complete: handleVimeo
    });
});

function createEntryHTML(info) {
    var $a  = $("<a>"),
        url = info.url;
    $a.addClass("entry").attr("href", url);
    $a.html(
        "<h1>"+ info.title +"</h1>"+
        "<p class='entry-description'>"+ info.description +"</p>"+
        "<span class='entry-upload-date'>"+info.upload_date+"</span>"
    );
    return $a;
};

function linkify(text, url) {
    return "<a href="+url+">"+text+"</a>";
}

function handleVimeo(data, status) {
    var response, $a, $body = $("body");

    if (status === "error") {
        alert("whoops");
    }
    var response = data.responseJSON || [];
    response.forEach(function(info) {
        $a = createEntryHTML(info);
        $body.append($a);
    });
};
