/*
 * Lightweight RTE - jQuery Plugin, v1.2
 * Basic Toolbars
 * Copyright (c) 2009 Andrey Gayvoronsky - http://www.gayvoronsky.com
 */
var rte_tag		= '-rte-tmp-tag-';

var	rte_toolbar = {
  s1		: {separator: true},
  bold		: {command: 'bold', tags:['b', 'strong']},
  italic	: {command: 'italic', tags:['i', 'em']},
  //strikeThrough	: {command: 'strikethrough', tags: ['s', 'strike'] },
  //underline	: {command: 'underline', tags: ['u']},
  s2		: {separator : true },
  indent	: {command: 'indent'},
  // outdent	: {command: 'outdent'},
  s3		: {separator : true },
  orderedList	: {command: 'insertorderedlist', tags: ['ol'] },
  unorderedList	: {command: 'insertunorderedlist', tags: ['ul'] },
  s4		: {separator : true },
  h1            : {command : 'formatblock', args : '<h1>'},
  h2            : {command : 'formatblock', args : '<h2>'},
  h3            : {command : 'formatblock', args : '<h3>'},
  s5		: {separator : true },
  image		: {exec: function(){}, tags: ['img'] },
  link		: {exec: lwrte_link, tags: ['a'] },
  s6		: {separator : true },
  removeFormat	: {exec: lwrte_unformat},
  word		: {exec: lwrte_cleanup_word},
  clear		: {exec: lwrte_clear}
};

var html_toolbar = {
  s1	: {separator: true},
  word	: {exec: lwrte_cleanup_word},
  clear	: {exec: lwrte_clear}
};

var md_toolbar = {
  s1     : {separator: true},
  image		: {exec: function(){}, tags: ['img'] },
  unlink : {exec : moleskine_fullscreen },
  clear  : {exec: lwrte_clear}
};

function moleskine_fullscreen() {
  $(this.textarea).toggleClass('fullscreen');
  $(this.textarea).prev().toggleClass('fullscreen');
}

function md_add_title() {
  
}

// function lwrte_image() {
//   var self = this;
//   var panel = self.create_panel('Insert image', 385);
//   panel.append('\
//       <p><label>URL</label><input type="text" id="url" size="30" value=""><button id="file">Upload</button><button id="view">View</button></p>\
//       <div class="clear"></div>\
//       <p class="submit"><button id="ok">Ok</button><button id="cancel">Cancel</button></p>'
//               ).show();

//   var url = $('#url', panel);
//   var upload = $('#file', panel).upload( {
//     autoSubmit: false,
//     action: 'uploader.php',
//     onSelect: function() {
//       var file = this.filename();
//       var ext = (/[.]/.exec(file)) ? /[^.]+$/.exec(file.toLowerCase()) : '';
//       if(!(ext && /^(jpg|png|jpeg|gif)$/.test(ext))){
// 	alert('Invalid file extension');
// 	return;
//       }

//       this.submit();
//     },
//     onComplete: function(response) { 
//       if(response.length <= 0)
// 	return;

//       response	= eval("(" + response + ")");
//       if(response.error && response.error.length > 0)
// 	alert(response.error);
//       else
// 	url.val((response.file && response.file.length > 0) ? response.file : '');
//     }
//   });

//   $('#view', panel).click( function() {
//     (url.val().length >0 ) ? window.open(url.val()) : alert("Enter URL of image to view");
//     return false;
//   }
// 	                 );
  
//   $('#cancel', panel).click( function() { panel.remove(); return false;} );
//   $('#ok', panel).click( 
//     function() {
//       var file = url.val();
//       self.editor_cmd('insertImage', file);
//       panel.remove(); 
//       return false;
//     }
//   )
// }

function lwrte_unformat() {
  this.editor_cmd('removeFormat');
  this.editor_cmd('unlink');
}


function lwrte_clear() {
  if (confirm('Clear Document?')) 
    this.set_content('');
}

function lwrte_cleanup_word() {
  this.set_content(cleanup_word(this.get_content(), true, true, true)); 
  
  function cleanup_word(s, bIgnoreFont, bRemoveStyles, bCleanWordKeepsStructure) {
    s = s.replace(/<o:p>\s*<\/o:p>/g, '') ;
    s = s.replace(/<o:p>[\s\S]*?<\/o:p>/g, '&nbsp;') ;

    // Remove mso-xxx styles.
    s = s.replace( /\s*mso-[^:]+:[^;"]+;?/gi, '' ) ;

    // Remove margin styles.
    s = s.replace( /\s*MARGIN: 0cm 0cm 0pt\s*;/gi, '' ) ;
    s = s.replace( /\s*MARGIN: 0cm 0cm 0pt\s*"/gi, "\"" ) ;

    s = s.replace( /\s*TEXT-INDENT: 0cm\s*;/gi, '' ) ;
    s = s.replace( /\s*TEXT-INDENT: 0cm\s*"/gi, "\"" ) ;

    s = s.replace( /\s*TEXT-ALIGN: [^\s;]+;?"/gi, "\"" ) ;

    s = s.replace( /\s*PAGE-BREAK-BEFORE: [^\s;]+;?"/gi, "\"" ) ;

    s = s.replace( /\s*FONT-VARIANT: [^\s;]+;?"/gi, "\"" ) ;

    s = s.replace( /\s*tab-stops:[^;"]*;?/gi, '' ) ;
    s = s.replace( /\s*tab-stops:[^"]*/gi, '' ) ;

    // Remove FONT face attributes.
    if (bIgnoreFont) {
      s = s.replace( /\s*face="[^"]*"/gi, '' ) ;
      s = s.replace( /\s*face=[^ >]*/gi, '' ) ;

      s = s.replace( /\s*FONT-FAMILY:[^;"]*;?/gi, '' ) ;
    }

    // Remove Class attributes
    s = s.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3") ;

    // Remove styles.
    if (bRemoveStyles)
      s = s.replace( /<(\w[^>]*) style="([^\"]*)"([^>]*)/gi, "<$1$3" ) ;

    // Remove style, meta and link tags
    s = s.replace( /<STYLE[^>]*>[\s\S]*?<\/STYLE[^>]*>/gi, '' ) ;
    s = s.replace( /<(?:META|LINK)[^>]*>\s*/gi, '' ) ;

    // Remove empty styles.
    s =  s.replace( /\s*style="\s*"/gi, '' ) ;

    s = s.replace( /<SPAN\s*[^>]*>\s*&nbsp;\s*<\/SPAN>/gi, '&nbsp;' ) ;

    s = s.replace( /<SPAN\s*[^>]*><\/SPAN>/gi, '' ) ;

    // Remove Lang attributes
    s = s.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3") ;

    s = s.replace( /<SPAN\s*>([\s\S]*?)<\/SPAN>/gi, '$1' ) ;

    s = s.replace( /<FONT\s*>([\s\S]*?)<\/FONT>/gi, '$1' ) ;

    // Remove XML elements and declarations
    s = s.replace(/<\\?\?xml[^>]*>/gi, '' ) ;

    // Remove w: tags with contents.
    s = s.replace( /<w:[^>]*>[\s\S]*?<\/w:[^>]*>/gi, '' ) ;

    // Remove Tags with XML namespace declarations: <o:p><\/o:p>
    s = s.replace(/<\/?\w+:[^>]*>/gi, '' ) ;

    // Remove comments [SF BUG-1481861].
    s = s.replace(/<\!--[\s\S]*?-->/g, '' ) ;

    s = s.replace( /<(U|I|STRIKE)>&nbsp;<\/\1>/g, '&nbsp;' ) ;

    s = s.replace( /<H\d>\s*<\/H\d>/gi, '' ) ;

    // Remove "display:none" tags.
    s = s.replace( /<(\w+)[^>]*\sstyle="[^"]*DISPLAY\s?:\s?none[\s\S]*?<\/\1>/ig, '' ) ;

    // Remove language tags
    s = s.replace( /<(\w[^>]*) language=([^ |>]*)([^>]*)/gi, "<$1$3") ;

    // Remove onmouseover and onmouseout events (from MS Word comments effect)
    s = s.replace( /<(\w[^>]*) onmouseover="([^\"]*)"([^>]*)/gi, "<$1$3") ;
    s = s.replace( /<(\w[^>]*) onmouseout="([^\"]*)"([^>]*)/gi, "<$1$3") ;

    if (bCleanWordKeepsStructure) {
      // The original <Hn> tag send from Word is something like this: <Hn style="margin-top:0px;margin-bottom:0px">
      s = s.replace( /<H(\d)([^>]*)>/gi, '<h$1>' ) ;

      // Word likes to insert extra <font> tags, when using MSIE. (Wierd).
      s = s.replace( /<(H\d)><FONT[^>]*>([\s\S]*?)<\/FONT><\/\1>/gi, '<$1>$2<\/$1>' );
      s = s.replace( /<(H\d)><EM>([\s\S]*?)<\/EM><\/\1>/gi, '<$1>$2<\/$1>' );
    } else {
      s = s.replace( /<H1([^>]*)>/gi, '<div$1><b><font size="6">' ) ;
      s = s.replace( /<H2([^>]*)>/gi, '<div$1><b><font size="5">' ) ;
      s = s.replace( /<H3([^>]*)>/gi, '<div$1><b><font size="4">' ) ;
      s = s.replace( /<H4([^>]*)>/gi, '<div$1><b><font size="3">' ) ;
      s = s.replace( /<H5([^>]*)>/gi, '<div$1><b><font size="2">' ) ;
      s = s.replace( /<H6([^>]*)>/gi, '<div$1><b><font size="1">' ) ;

      s = s.replace( /<\/H\d>/gi, '<\/font><\/b><\/div>' ) ;

      // Transform <P> to <DIV>
      var re = new RegExp( '(<P)([^>]*>[\\s\\S]*?)(<\/P>)', 'gi' ) ;	// Different because of a IE 5.0 error
      s = s.replace( re, '<div$2<\/div>' ) ;

      // Remove empty tags (three times, just to be sure).
      // This also removes any empty anchor
      s = s.replace( /<([^\s>]+)(\s[^>]*)?>\s*<\/\1>/g, '' ) ;
      s = s.replace( /<([^\s>]+)(\s[^>]*)?>\s*<\/\1>/g, '' ) ;
      s = s.replace( /<([^\s>]+)(\s[^>]*)?>\s*<\/\1>/g, '' ) ;
    }

    return s;
  }
}

function lwrte_link() {
  var self = this;
  var panel = self.create_panel("Create link / Attach file", 385);

  panel.append('\
      <p><label>URL</label><input type="text" id="url" size="30" value=""><button id="file">Attach File</button><button id="view">View</button></p>\
      <div class="clear"></div>\
      <p><label>Title</label><input type="text" id="title" size="30" value=""><label>Target</label><select id="target"><option value="">default</option><option value="_blank">new</option></select></p>\
      <div class="clear"></div>\
      <p class="submit"><button id="ok">Ok</button><button id="cancel">Cancel</button></p>').show();

  $('#cancel', panel).click( function() { panel.remove(); return false; } );

  var url = $('#url', panel);
  var upload = $('#file', panel).upload( {
    autoSubmit: true,
    action: 'uploader.php',
    onComplete: function(response) { 
      if(response.length <= 0)
	return;

      response	= eval("(" + response + ")");

      if(response.error && response.error.length > 0)
	alert(response.error);
      else
	url.val((response.file && response.file.length > 0) ? response.file : '');
    }
  });

  $('#view', panel).click(function() {
    (url.val().length >0 ) ? window.open(url.val()) : alert("Enter URL to view");
    return false;
  });

  $('#ok', panel).click( function() {
    var url = $('#url', panel).val();
    var target = $('#target', panel).val();
    var title = $('#title', panel).val();

    if(self.get_selected_text().length <= 0) {
      alert('Select the text you wish to link!');
      return false;
    }

    panel.remove(); 

    if(url.length <= 0)
      return false;

    self.editor_cmd('unlink');

    // we wanna well-formed linkage (<p>,<h1> and other block types can't be inside of link due to WC3)
    self.editor_cmd('createLink', rte_tag);
    var tmp = $('<span></span>').append(self.get_selected_html());

    if(target.length > 0)
      $('a[href*="' + rte_tag + '"]', tmp).attr('target', target);

    if(title.length > 0)
      $('a[href*="' + rte_tag + '"]', tmp).attr('title', title);

    $('a[href*="' + rte_tag + '"]', tmp).attr('href', url);
    
    self.selection_replace_with(tmp.html());
    return false;
  });
}
