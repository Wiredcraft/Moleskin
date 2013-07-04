
/*
 * Lightweight RTE - jQuery Plugin, version 1.2
 * Copyright (c) 2009 Andrey Gayvoronsky - http://www.gayvoronsky.com
 *
 * 2013 - Overidded by Alexandre Strzelewicz <as@unitech.io>
 */

Moleskin = {};

;(function($, global, undefined) {
  
  $.fn.moleskine = function(options) {
    return new lwRTE (this, options || {});;
  };

  var lwRTE = function (textarea, options) {
    this.width		= options.width  || $(textarea).width() || '100%';
    this.height		= options.height || $(textarea).height() || 350;
    this.change         = this.onChange = options.change || function() {};
    this.output         = options.output || null;
    this.input          = options.input  || null;
    this.defaultMode    = options.defaultMode || 'html';
    this.autoGrow       = options.autoGrow || true;
    this.mode           = 'html';

    this.main_el        = textarea;
    this.iframe		= null;
    this.iframe_doc	= null;
    this.textarea	= null;
    this.event		= null;
    this.range		= null;
    
    this.toolbars	= {
      rte: '', html : '', md : ''
    };
      
    if (typeof Showdown === 'undefined')
      throw new Error('Showdown.js must be included');

    if (typeof reMarked === 'undefined')
      throw new Error('Remarked.js must be included');

    this.showdown = new Showdown.converter();

    /**
     * @description HTML to Markdown config
     *
     * @api private
     */
    this.reMarked = new reMarked({
      link_list : false,  // render links as references
      h1_setext : false,  // underline h1 headers
      h2_setext : false,  // underline h2 headers
      h_atx_suf : false,  // header suffixes (###)
      gfm_code  : false,  // gfm code blocks (```)
      li_bullet : "-",    // list item bullet style
      hr_char   : "-",    // hr style
      indnt_str : "    ", // indentation string
      bold_char : "*",    // char used for strong
      emph_char : "_",    // char used for em
      gfm_del   : true,   // ~~strikeout~~ for <del>strikeout</del>
      gfm_tbls  : true,   // markdown-extra tables
      tbl_edges : false,  // show side edges on tables
      hash_lnks : false,  // anchors w/hash hrefs as links
      br_only   : false   // avoid using "  " as line break indicator
    });

    this.controls	= {
      rte: {
        "md-enable" : {hint : 'Markdown'},
        disable: {hint: 'Source editor'}
      },
      html: {
        enable: {hint: 'Visual editor'}
      },
      md : {
        "md-disable" : { hint: 'Switch to html' }
      }
    };
    
    $.extend(this.controls.rte  , MoleskinConf.rte_toolbar || {});
    $.extend(this.controls.html , MoleskinConf.html_toolbar || {});
    $.extend(this.controls.md   , MoleskinConf.md_toolbar || {});

    this.init(textarea);
  };

  lwRTE.prototype.init = function(textarea) {
    if (document.designMode || document.contentEditable) {
      $(textarea).wrap($('<div></div>').addClass('rte-zone').width(this.width));
      //$('<div class="rte-resizer rte-resize-icon"><a href="#"></a></div>').insertAfter(textarea);      
      $(textarea).parents('.rte-zone').append(this.info_el);
      
      this.info_el = $(textarea).parent().find('rte-infos').html();
      this.textarea	= textarea;
      
      this.enable_design_mode();
      if (this.defaultMode == 'markdown')
        this.html_to_markdown();
    }
  };

  lwRTE.prototype.get_markdown = function() {
    var self = this;
    
    if (this.mode == 'markdown')
      return $(self.textarea).val();
    else if (this.mode == 'rawhtml')
      return self.reMarked.render($(self.textarea).val());
    else
      return self.reMarked.render($('body', self.iframe_doc).html());
  };

  lwRTE.prototype.get_html = function() {
    var self = this;
    
    if (this.mode == 'markdown')
      return this.showdown.makeHtml($(self.textarea).val());
    else if (this.mode == 'rawhtml')
      return $(self.textarea).val();
    else
      return $('body', self.iframe_doc).html();
  };


  /*
   * HTML Raw -> HTML Preview
   */
  lwRTE.prototype.enable_design_mode = function() {
    var content = $(this.textarea).val();

    this.mode = 'html';    
    this.put_in_iframe(content);
  };

  /*
   * Markdown -> HTML
   */
  lwRTE.prototype.markdown_to_html = function(submit) {
    var content     = $(this.textarea).val();
    var htmlContent = this.showdown.makeHtml(content);

    this.mode = 'html';    
    this.put_in_iframe(htmlContent);
  };
  
  /*
   * HTML -> Markdown
   */
  lwRTE.prototype.html_to_markdown = function(submit) {
    var markdown;

    if (this.iframe_doc)
      markdown = this.reMarked.render($('body', this.iframe_doc).html());
    else
      markdown = $(this.textarea).val();
    
    this.mode = 'markdown';
    this.create_textarea(markdown, this.toolbars.md, this.controls.md);
  };

  /*
   * HTML Preview -> HTML Raw
   */
  lwRTE.prototype.disable_design_mode = function(submit) {
    var content = $('body', this.iframe_doc).html();

    this.mode = 'rawhtml';
    this.create_textarea(content, this.toolbars.md, this.controls.md);  
  };


  /*
   *
   * INTERNAL METHODS TO MANIPULATE THE IFRAME & STUFF
   *
   */


  /*
   * Send command to iframe
   */
  lwRTE.prototype.editor_cmd = function(command, args) {
    var self = this;
    this.iframe.contentWindow.focus();
    try {
      this.iframe_doc.execCommand(command, false, args);
    } catch(e) {
      console.log(e);
    }
    this.iframe.contentWindow.focus();
    self.change(null, self.get_content());
  };


  lwRTE.prototype.create_textarea = function(content, toolbar, controls, submit) {
    var self = this;

    this.textarea = (submit) ?
      $('<input type="hidden" />').get(0) : $('<textarea></textarea>');

    this.textarea.width(self.width).height(this.height).get(0);
    
    $(this.textarea).val(content);
    $(this.iframe).before(this.textarea);

    if (self.autoGrow == true)
      $(this.textarea).autogrow();
    
    $(this.textarea).keyup(function(event) {
      self.change(null, self.get_content());
    });
    
    if (!toolbar)
      toolbar	= this.create_toolbar(controls);

    if (submit != true) {
      $(this.iframe_doc).remove(); //fix 'permission denied' bug in IE7 (jquery cache)
      $(this.iframe).remove();
      this.iframe = this.iframe_doc = null;
      this.activate_toolbar(this.textarea, toolbar);
    }
    $(this.textarea).focus();
  };

  lwRTE.prototype.get_toolbar = function() {
    var editor = (this.iframe) ? $(this.iframe) : $(this.textarea);
    return (editor.prev().hasClass('rte-toolbar')) ? editor.prev() : null;
  };

  lwRTE.prototype.activate_toolbar = function(editor, tb) {
    var old_tb = this.get_toolbar();    
    if (old_tb) old_tb.remove();
    $(editor).before($(tb).clone(true));
  };

  lwRTE.prototype.update_iframe = function(content) {  
    var doc = "<html><head></head>" +
          '<body style="font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; padding : 0; margin : 0; overflow:hidden;">' +
          content +
          "</body></html>";

    this.iframe_doc.open();
    this.iframe_doc.write(doc);
    this.iframe_doc.close();
  };

  lwRTE.prototype.put_in_iframe = function(content) {
    var self = this;

    self.iframe = null;
    
    // need to be created this way
    self.iframe	= document.createElement("iframe");
    self.iframe.frameBorder  = 0;
    self.iframe.frameMargin  = 0;
    self.iframe.framePadding = 0;
    self.iframe.width        = '100%';
    self.iframe.height       = self.height || '100%';
    self.iframe.src	= "javascript:void(0);";

    $(self.textarea).hide().after(self.iframe).remove();
    self.textarea	= null;
    self.iframe_doc	= self.iframe.contentWindow.document;

    try {
      self.iframe_doc.designMode = 'on';
    } catch ( e ) {
      // Will fail on Gecko if the editor is placed in an hidden container element
      // The design mode will be set ones the editor is focused
      $(self.iframe_doc).focus(function() { self.iframe_doc.designMode(); } );
    }

    self.update_iframe(content);
    
    if(!self.toolbars.rte)
      self.toolbars.rte	= self.create_toolbar(self.controls.rte);
    self.activate_toolbar(self.iframe, self.toolbars.rte);

    // $(self.iframe).parents('form').submit( 
    //   function() { self.disable_design_mode(true); }
    // );

    $(self.iframe_doc).mouseup(function(event) { 
      if(self.iframe_doc.selection)
        self.range = self.iframe_doc.selection.createRange();  //store to restore later(IE fix)
      self.set_selected_controls( (event.target) ? event.target : event.srcElement, self.controls.rte); 
    });

    $(self.iframe_doc).blur(function(event){ 
      if(self.iframe_doc.selection) 
        self.range = self.iframe_doc.selection.createRange(); // same fix for IE as above
    });

    $(self.iframe_doc).keyup(function(event) {
      var iframe_height = $(self.iframe_doc).contents().find('body').height();
      var current_iframe_height = $(self.iframe).height();
      if (self.autoGrow == true && iframe_height > current_iframe_height) {
        $(self.iframe).height(iframe_height);
      }
      self.change(null, self.get_content());
      self.set_selected_controls( self.get_selected_element(), self.controls.rte);
    });

    // Mozilla CSS styling off
    if(!navigator.userAgent.match(/msie/i))
      self.editor_cmd('styleWithCSS', false);
  };

  lwRTE.prototype.toolbar_click = function(obj, control) {
    var fn        = control.exec;
    var args      = control.args || [];
    var self      = this;
    var is_select = (obj.tagName.toUpperCase() == 'SELECT');
    
    $('.rte-panel', this.get_toolbar()).remove();
    
    if(fn) {
      if(is_select)
        args.push(obj);

      try {
        fn.apply(this, args);
      } catch(e) {

      }
    } else if(this.iframe && control.command) {
      if(is_select) {
        args = obj.options[obj.selectedIndex].value;

        if(args.length <= 0)
	  return;
      }

      this.editor_cmd(control.command, args);
    }
  };

  lwRTE.prototype.create_toolbar = function(controls) {
    var self = this;
    var tb = $("<div></div>").addClass('rte-toolbar').width('100%').append($("<ul></ul>")).append($("<div></div>").addClass('clear'));
    self.tb = tb.get(0);
    var obj, li;

    for (var key in controls){
      if(controls[key].separator) {
        li = $("<li></li>").addClass('separator');
      } else {
        if(controls[key].init) {
	  try {
	    controls[key].init.apply(controls[key], [this]);
	  } catch(e) {
	  }
        }
        
        if(controls[key].select) {
	  obj = $(controls[key].select)
	    .change( function(e) {
	      self.event = e;
	      self.toolbar_click(this, controls[this.className]); 
	      return false;
	    });
        } else {
	  obj = $("<a href='#'></a>")
	    .attr('title', (controls[key].hint) ? controls[key].hint : key)
	    .attr('rel', key)
	    .click( function(e) {
	      self.event = e;
	      self.toolbar_click(this, controls[this.rel]); 
	      return false;
	    });
        }

        li = $("<li></li>").append(obj.addClass(key));
      }

      $("ul",tb).append(li);
    }


    $('.md-enable', tb).click(function() {
      self.html_to_markdown();
      return false;
    });

    $('.md-disable', tb).click(function() {
      self.markdown_to_html();
      return false;
    });

    $('.enable', tb).click(function() {
      self.enable_design_mode();
      return false; 
    });

    $('.disable', tb).click(function() {
      self.disable_design_mode();
      return false; 
    });

    return tb.get(0);
  };

  lwRTE.prototype.create_panel = function(title, width) {
    var self = this;
    var tb = self.get_toolbar();

    if(!tb)
      return false;

    $('.rte-panel', tb).remove();
    var drag, event;
    var left = self.event.pageX;
    var top = self.event.pageY;
    
    var panel	= $('<div></div>').hide().addClass('rte-panel').css({left: left, top: top});
    $('<div></div>')
      .addClass('rte-panel-title')
      .html(title)
      .append($("<a class='close' href='#'>X</a>")
	      .click( function() { panel.remove(); return false; }))
      .mousedown( function() { drag = true; return false; })
      .mouseup( function() { drag = false; return false; })
      .mousemove( 
        function(e) {
	  if(drag && event) {
	    left -= event.pageX - e.pageX;
	    top -=  event.pageY - e.pageY;
	    panel.css( {left: left, top: top} ); 
	  }

	  event = e;
	  return false;
        } 
      )
      .appendTo(panel);

    if(width)
      panel.width(width);

    tb.append(panel);
    return panel;
  };

  lwRTE.prototype.get_content = function() {
    var content;
    
    if (this.output == 'markdown')
      content = this.get_markdown();
    else if (this.output == 'html')
      content = this.get_html();
    else
      content = (this.iframe) ? $('body', this.iframe_doc).html() : $(this.textarea).val();
    
    return content;    
  };

  lwRTE.prototype.set_content = function(content) {
    var self = this;

    if (this.input == 'markdown') { 
      (this.iframe) ? $('body', this.iframe_doc).html(this.showdown.makeHtml(content)):$(this.textarea).val(content);
    }
    else if (this.input == 'html')
      (this.iframe) ? $('body', this.iframe_doc).html(content):$(this.textarea).val(content);
    else
      throw new Error('input not defined in options [markdown, html]');

    if (self.autoGrow == true)
      $(self.iframe).height($(self.iframe_doc).contents().find('body').height());
  };

  lwRTE.prototype.set_selected_controls = function(node, controls) {
    var toolbar = this.get_toolbar();

    if(!toolbar)
      return false;
    
    var key, i_node, obj, control, tag, i, value;

    try {
      for (key in controls) {
        control = controls[key];
        obj = $('.' + key, toolbar);

        obj.removeClass('active');

        if(!control.tags)
	  continue;

        i_node = node;
        do {
	  if(i_node.nodeType != 1)
	    continue;

	  tag	= i_node.nodeName.toLowerCase();
	  if($.inArray(tag, control.tags) < 0 )
	    continue;

	  if(control.select) {
	    obj = obj.get(0);
	    if(obj.tagName.toUpperCase() == 'SELECT') {
	      obj.selectedIndex = 0;

	      for(i = 0; i < obj.options.length; i++) {
	        value = obj.options[i].value;
	        if(value && ((control.tag_cmp && control.tag_cmp(i_node, value)) || tag == value)) {
		  obj.selectedIndex = i;
		  break;
	        }
	      }
	    }
	  } else
	    obj.addClass('active');
        }  while(i_node = i_node.parentNode)
      }
    } catch(e) {
    }
    
    return true;
  };

  lwRTE.prototype.get_selected_element = function () {
    var node, selection, range;
    var iframe_win	= this.iframe.contentWindow;
    
    if (iframe_win.getSelection) {
      try {
        selection = iframe_win.getSelection();
        range = selection.getRangeAt(0);
        node = range.commonAncestorContainer;
      } catch(e){
        return false;
      }
    } else {
      try {
        selection = iframe_win.document.selection;
        range = selection.createRange();
        node = range.parentElement();
      } catch (e) {
        return false;
      }
    }

    return node;
  };

  lwRTE.prototype.get_selection_range = function() {
    var rng	= null;
    var iframe_window = this.iframe.contentWindow;
    this.iframe.focus();
    
    if(iframe_window.getSelection) {
      rng = iframe_window.getSelection().getRangeAt(0);
      if(navigator.userAgent.match(/opera/i)) { 
        var s = rng.startContainer;
        if(s.nodeType === Node.TEXT_NODE)
	  rng.setStartBefore(s.parentNode);
      }
    } else {
      this.range.select(); //Restore selection, if IE lost focus.
      rng = this.iframe_doc.selection.createRange();
    }

    return rng;
  };

  lwRTE.prototype.get_selected_text = function() {
    var iframe_win = this.iframe.contentWindow;

    if(iframe_win.getSelection)	
      return iframe_win.getSelection().toString();

    this.range.select(); //Restore selection, if IE lost focus.
    return iframe_win.document.selection.createRange().text;
  };

  lwRTE.prototype.get_selected_html = function() {
    var html = null;
    var iframe_window = this.iframe.contentWindow;
    var rng	= this.get_selection_range();

    if(rng) {
      if(iframe_window.getSelection) {
        var e = document.createElement('div');
        e.appendChild(rng.cloneContents());
        html = e.innerHTML;		
      } else {
        html = rng.htmlText;
      }
    }

    return html;
  };

  lwRTE.prototype.selection_replace_with = function(html) {
    var rng	= this.get_selection_range();
    var iframe_window = this.iframe.contentWindow;

    if (!rng) return;
    
    this.editor_cmd('removeFormat'); // we must remove formating or we will get empty format tags!

    if (iframe_window.getSelection) {
      rng.deleteContents();
      rng.insertNode(rng.createContextualFragment(html));
      this.editor_cmd('delete');
    } else {
      this.editor_cmd('delete');
      rng.pasteHTML(html);
    }
  };

  /**
   * @description Iframe resize
   *
   * @api private
   */
  var lwRTE_resizer = function(textarea) {
    this.drag = false;
    this.rte_zone = $(textarea).parents('.rte-zone');
  };

  lwRTE_resizer.mousedown = function(resizer, e) {
    resizer.drag = true;
    resizer.event = (typeof(e) == "undefined") ? window.event : e;
    resizer.rte_obj = $(".rte-resizer", resizer.rte_zone).prev().eq(0);
    $('body', document).css('cursor', 'se-resize');
    return false;
  };

  lwRTE_resizer.mouseup = function(resizer, e) {
    resizer.drag = false;
    $('body', document).css('cursor', 'auto');
    return false;
  };

  lwRTE_resizer.mousemove = function(resizer, e) {
    if(resizer.drag) {
      e = (typeof(e) == "undefined") ? window.event : e;
      var w = Math.max(1, resizer.rte_zone.width() + e.screenX - resizer.event.screenX);
      var h = Math.max(1, resizer.rte_obj.height() + e.screenY - resizer.event.screenY);
      resizer.rte_zone.width(w);
      resizer.rte_obj.height(h);
      resizer.event = e;
    }
    return false;
  };
  
})(jQuery, typeof window === "undefined" ? this : window);

// var resizer = new lwRTE_resizer(textarea);

// $(".rte-resizer a", $(textarea).parents('.rte-zone')).mousedown(function(e) {
//   $(document).mousemove(function(e) {
//     return lwRTE_resizer.mousemove(resizer, e);
//   });

//   $(document).mouseup(function(e) {
//     return lwRTE_resizer.mouseup(resizer, e);
//   });

//   return lwRTE_resizer.mousedown(resizer, e);
// });

