/*
 * jquery.autogrow.js
 *
 * A plugin written for UserVoice that makes it easy to create textareas
 * that automatically resize to fit their contents.
 *
 * Based on Scott Moonen's original code for Prototype.js:
 *
 * <http://scottmoonen.com/2008/07/08/unobtrusive-javascript-expandable-textareas/>
 *
 * Author: John W. Long <john@uservoice.com>
 *
 */
;(function($) {
  var properties = ['-webkit-appearance', '-moz-appearance', '-o-appearance', 'appearance', 'font-family', 'font-size', 'font-weight', 'font-style', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'box-sizing', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'min-height', 'max-height', 'line-height']
  ,   escaper    = $('<span />')
  ;

  function escape(string) {
    return escaper.text(string).text().replace(/\n/g, '<br>');
  }

  $.fn.autogrow = function() {
    return this.filter('textarea').each(function() {
      if (!$(this).data('autogrow-applied')) {
        var textarea      = $(this)
        ,   initialHeight = textarea.innerHeight()
        ,   expander      = $('<div />')
        ,   timer         = null
        ;

        // Setup expander
        expander.css({'position': 'absolute', 'visibility': 'hidden', 'top': '-99999px'})
        $.each(properties, function(i, p) { expander.css(p, textarea.css(p)); });
        textarea.after(expander);

        // Setup textarea
        textarea.css({'overflow-y': 'hidden', 'resize': 'none', 'box-sizing': 'border-box'});

        // Sizer function
        function sizeTextarea() {
          clearTimeout(timer);
          timer = setTimeout(function() {
            var value = escape(textarea.val()) + '<br>z';
            expander.html(value);
            expander.css('width', textarea.innerWidth() + 2 + 'px');
            textarea.css('height', Math.max(expander.innerHeight(), initialHeight) + 2 + 'px');
          }, 100); // throttle by 100ms
        }

        // Bind sizer to IE 9+'s input event and Safari's propertychange event
        textarea.on('input.autogrow propertychange.autogrow', sizeTextarea);

        // Set the initial size
        sizeTextarea();

        // Record autogrow applied
        textarea.data('autogrow-applied', true);
      }
    });
  };
}(jQuery));
