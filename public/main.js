/* Self-executing function to give ourselves a clean namespace
 * to work in.
 */
!function($, moment, window) {
    // Used to measure width of mobile screen
    // source - http://stackoverflow.com/a/6850319
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    
    /* jQuery on ready call. Figures out current page
     * and sets up event listeners for pagination.
     */
    $(function() {
        var page = window.location.hash.substr(1) || 1;

        // set up event listeners
        $('.container').on('click', '.entry', createModal);
        $('body').on('click', '.page-button', function(e) {
            var page = $(this).attr('href').substr(1);
            fetchVideos(page);
        });

        fetchVideos(page);
    });

    /**
     * fetchVideos asynchronously fetches videos from
     * Vimeo and displays them.
     * @param {number} page - the number of the Vimeo page
     */
    function fetchVideos(page) {
        var url = 'http://vimeo.com/api/v2/whitneymuseum/videos.json';
        url += '?page=' + page;

        $('.entry').remove();
        $('.page').children().
            removeClass('active').
            eq(page - 1).addClass('active');
        $.ajax(url, {complete: handleVimeo});
    }

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
        var $modal = $('<div>').addClass('modal'),
            $this  = $(this),
            info   = $this.data('info');

        // if we're on a small screen, send users straight to Vimeo.
        if (width < 750) {
            return;
        }

        $modal.html(
            '<iframe src="https://player.vimeo.com/video/'+info.id+
                '?title=0&byline=0&portrait=0" width="750" '+
                'height="396" frameborder="0" webkitallowfullscreen '+
                'mozallowfullscreen allowfullscreen>'+
            '</iframe>'
        );
        $('.container').append($modal);

        $modal.click(function(e) {
            $(this).remove();
        });

        e.preventDefault();
    };

    /**
     * handleVimeo is a basic function to process vimeo JSON data.
     * @param data - a jqXHR object
     * @param {string} status - standard jquery status
     */
    function handleVimeo(data, status) {
        var response;
        if (status !== 'success') {
            $('<div>').html('<h1>No response from Vimeo...</h1>'+
               'please try reloading.').appendTo($('.container'));
            window.location.reload();
        }

        response = data.responseJSON || [];
        response.forEach(function(info) {
            createEntryHTML(info).appendTo($('.container'));
        });
    };
}(jQuery, moment, window);
