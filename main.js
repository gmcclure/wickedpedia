(function($, w, d, undefined) {
  
  $('#search-button').on('click', function() {
    $(this).css('visibility', 'hidden');
    $('#search-form').css('visibility', 'visible');
    $('#search-box').addClass('full-search');
    $('#close-button').css('visibility', 'visible');
    $('#button-caption').css('visibility', 'hidden')
    $('#search-box').focus();
  });

  $('#close-button').on('click', function() {
    $('#results-list li').fadeOut(1200, function(){
      $(this).remove();
    });
    $('#search-box').val('');
    $('#search-box').removeClass('full-search');
    $(this).css('visibility', 'hidden');
    $('#search').removeClass('in-search');
    
    var evtString = 
        'webkitTransitionEnd otransitionend oTransitionEnd \
         msTransitionEnd transitionend';
    
    $('#search-box').on(evtString, function() {
      $('#search-form').css('visibility', 'hidden');
      $('#search-button').css('visibility', 'visible');
      $('#button-caption').css('visibility', 'visible');
      $('#search-box').off(evtString);
    });
  });
  
  $('#search-box').on('keyup', function(evt) {
    if (evt.keyCode === 13) {
      $('#search').addClass('in-search');
      $('#search-box').select();
    }
  });
  
  var app = angular.module('wicked', ['ngSanitize']);
  
  app.controller('LookupController', ['$http', '$sce', function($http, $sce) {
    var evilTerms = ['evil', 'wicked', 'satan', 'halloween', 'devil', 
                     'demon', 'horror', 'ghost', 'goblin', 'death'];
    var wicked = this;
    wicked.results = [ ];
        
    this.lookup = function(q) {
      var qStr = 
        `https://en.wikipedia.org/w/api.php?
        action=query&
        list=search&
        format=json&
        srsearch=${encodeURI(q)}%20
        ${evilTerms[ Math.floor(Math.random() * 10) ]}&
        srprop=snippet&
        callback=JSON_CALLBACK`;

      $http.jsonp(qStr).success(function(data) {
        var r = [];
        data.query.search.forEach(function(el) {
          r.push({title: el.title, linkText: el.title.replace(/ /, '_'), snippet: '&ldquo; &hellip; &nbsp;' + el.snippet + '&nbsp; &hellip; &rdquo;'});
        });
        wicked.results = r;
      });
    };
    
  }]);
  
})($, window, document);
