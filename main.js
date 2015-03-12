/* Self-executing function (a #selfie :) ) to give ourselves a namespace
 * for 'global'-ish variables.
 **/
!function($, moment, window, undefined) {
    var $container  = $('.container'),
        $modal = $('<div>').addClass('modal'),
        width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    // Delegate entry clicks to the container
    $(function() {
        $.ajax('http://vimeo.com/api/v2/whitneymuseum/videos.json?page=1', {
            complete: handleVimeo
        });
        $container.on('click', '.entry', createModal);
    });

    /**
     * createEntryHTML returns a wrapped HTML vimeo entry
     * @param info - An object containing vimeo data
     */
    function createEntryHTML(info) {
        var $a         = $('<a>'),
            uploadDate = moment(info.upload_date),
            url        = info.url;
        $a.addClass('entry').attr('href', url);
        $a.html(
            '<h1>'+ info.title +'</h1>'+
            '<div class="entry-thumb-container">'+
                '<img src="'+info.thumbnail_medium+'"></img>'+
            '</div>'+
            '<p class="entry-description">'+ info.description +'</p>'+
            '<span class="entry-upload-date">'+
                uploadDate.format('MMM Do YYYY')+
            '</span>'
        );
        $a.data('info', info);
        return $a;
    };

    /**
     * createModal is run every time a video is clicked.
     * It creates a modal with an iframe connected to vimeo.
     * @param {jqEvent} e - standard jquery event
     */
    function createModal(e) {
        var $this = $(this),
            info  = $this.data('info');
        if (width < 750) {
            return
        }
        $modal.html(
            '<iframe src="https://player.vimeo.com/video/'+info.id+
                '?title=0&byline=0&portrait=0" width="750" '+
                'height="396" frameborder="0" webkitallowfullscreen '+
                'mozallowfullscreen allowfullscreen>'+
            '</iframe>'
        );
        $container.append($modal);
        $modal.click(function(e) {
            $(this).remove();
        });
        e.preventDefault();
    };

    /**
     * handleVimeo is a basic function to process vimeo JSON data
     * @param data - a jqXHR object
     * @param {string} status - standard jquery status
     */
    function handleVimeo(data, status) {
        var response, $a,
            $container = $container || $('.container');

        if (status !== 'success') {
            $('<div>').html('<h1>No response from Vimeo...</h1>'+
               'try reloading.');
            return;
        }
        var response = data.responseJSON || [];
        response.forEach(function(info) {
            $a = createEntryHTML(info);
            $container.append($a);
        });
    };
}(jQuery, moment, window);
