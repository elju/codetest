/* Auto-executing function (a #selfie :) ) to give ourselves a namespace
 * for 'global' variables.
 **/
!function(window) {
    var $body  = $('body'),
        $modal = $('<div>').addClass('modal');

    // Delegate entry clicks to the body
    $(function() {
        $.ajax('http://vimeo.com/api/v2/whitneymuseum/videos.json?page=1', {
            complete: handleVimeo
        });
        $body.on('click', '.entry', createModal);
    });

    /* createEntryHTML returns a wrapped HTML vimeo entry
     * @param info - An object containing vimeo data
     */
    function createEntryHTML(info) {
        var $a  = $('<a>'),
            url = info.url;
        $a.addClass('entry').attr('href', url);
        $a.html(
            '<h1>'+ info.title +'</h1>'+
            '<div class="entry-thumb-container">'+
                '<img src="'+info.thumbnail_medium+'"></img>'+
            '</div>'+
            '<p class="entry-description">'+ info.description +'</p>'+
            '<span class="entry-upload-date">'+info.upload_date+'</span>'
        );
        $a.data('info', info);
        return $a;
    };

    function createModal(e) {
        var $this = $(this),
            info  = $this.data('info');
        $modal.html(
            '<iframe src="https://player.vimeo.com/video/'+info.id+'?title=0&byline=0&portrait=0" width="500" height="264" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href="https://vimeo.com/121291579">Lize Mogel on Counter-Cartography</a> from <a href="https://vimeo.com/whitneymuseum">Whitney Museum of American Art</a> on <a href="https://vimeo.com">Vimeo</a>.</p>'
        );
        $body.append($modal);
        $modal.click(function(e) {
            $(this).remove();
        });
        e.preventDefault();
    };

    /* handleVimeo is a basic function to process vimeo JSON data
     * @param data - a jqXHR object
     * @param {string} status - standard jquery status
     */
    function handleVimeo(data, status) {
        var response, $a,
            $body = $body || $('body');

        if (status === 'error') {
            alert('whoops');
        }
        var response = data.responseJSON || [];
        response.forEach(function(info) {
            $a = createEntryHTML(info);
            $body.append($a);
        });
    };
}(window);
