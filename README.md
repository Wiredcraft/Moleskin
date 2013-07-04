# Moleskin

Usable with jQuery and Angular

- 34kb - 2 files to include (and jQuery)
- multi inclusion
- autogrow
- markdown to html
- html to markdown

## Quick start

### Angular

```html
<!-- don't forget jquery -->
<script type="text/javascript" src="./jquery-1.9.1.min.js"></script>

<script type="text/javascript" src="./dist/angular-moleskin.min.js"></script>
<link rel="stylesheet" href="./moleskine.css" />
    
<moleskine bind-data="content2"
   base-content="static_content"
   class="hey"
   width="550"
   css-class="mole"
   default-mode="markdown"
   input="markdown"
   output="html"
   height="450"></moleskine>
```

Example in example/angular/index.html

### jQuery

```html
<script type="text/javascript" src="./jquery-1.9.1.min.js"></script>

<script type="text/javascript" src="./dist/moleskin.min.js"></script>

<script type="text/javascript">
  $(document).ready(function() {
    el = $('.rte1').moleskine({
      width         : 800,
      height        : 500,
      defaultMode : 'markdown',
      onChange : function(err, data) {
        console.log(data);
      }
    });
  });
</script>
```

Example in example/jquery/index.html

## API

### Angular

```javascript
    scope    : { 
      bindData    : '=',
      baseContent : '=',
      width       : '@',
      height      : '@',
      input       : '@',
      output      : '@',
      defaultMode : '@',
      cssClass    : '@',
      autoGrow    : '@'
    },
```

### jQuery

```javascript
    this.width		= options.width  || $(textarea).width() || '100%';
    this.height		= options.height || $(textarea).height() || 350;
    this.change         = this.onChange = options.change || function() {};
    this.output         = options.output || null;
    this.input          = options.input  || null;
    this.defaultMode    = options.defaultMode || 'html';
    this.autoGrow       = options.autoGrow || true;
    this.mode           = 'html';
``` 

## Build

```bash
$ grunt compile
```

## Ideas

- Localstorage (in case of refresh)

# LICENSE

