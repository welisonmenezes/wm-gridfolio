/*!
 * jquery.wm-gridfolio - v 1.0
 * desenvolvido por Welison Menezes
 * email : welisonmenezes@gmail.com
 * 
 *
 * Copyright 2014 Welison Menezes
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License 
 */

;(function ($) {
    'use strict';
    $.fn.extend({
        WMGridfolio: function (options) {
            /**
             *  default configurations
             */
            var defaults = {
                selectors : {
                    item            : 'wmg-item',
                    thumbnail       : 'wmg-thumbnail',
                    details         : 'wmg-details',
                    close           : 'wmg-close',
                    arrow           : 'wmg-arrow'
                },
                thumbnail : {
                    columns : 6,
                    minSize : 100,
                    margin   : 5
                },
                details : {
                    minHeight : 400,
                    speed  : 350,
                    full_w : false
                },
                config : {
                    open          : 'open',
                    openToTop     : true,
                    hasImg        : true,
                    keepOpen      : false,
                    onlyThumb     : false
                },
                callbacks : {
                    CB_LoadGrid     : false,
                    CB_ResizeGrid   : false,
                    CB_OpenDetail   : false,
                    CB_CloseDetail  : false,
                    CB_CloseAll     : false
                }
            },
            /**
             *  merge default configurations with custom user configurations
             */
            options = $.extend(true, defaults, options),

            /**
             *  callbacks
             */
            callbacks = {
                container : false,
                element   : false,
                thumbnail : false,
                details   : false,
                close     : false,
                /**
                 * callback to load grid
                 *
                 * @return void
                 */
                CB_LoadGrid : function(){
                    if($.isFunction( options.callbacks.CB_LoadGrid ))
                    {
                        options.callbacks.CB_LoadGrid.apply(this, arguments);
                    }
                },
                /**
                 * callback to resize grid
                 *
                 * @return void
                 */
                CB_ResizeGrid : function(){
                    if($.isFunction( options.callbacks.CB_ResizeGrid ))
                    {
                        options.callbacks.CB_ResizeGrid.apply(this, arguments);
                    }
                },
                /**
                 * callback to open detail
                 *
                 * @return void
                 */
                CB_OpenDetail : function(){
                    if($.isFunction( options.callbacks.CB_OpenDetail ))
                    {
                        options.callbacks.CB_OpenDetail.apply(this, arguments);
                    }
                },
                /**
                 * callback to close detail
                 *
                 * @return void
                 */
                CB_CloseDetail : function(){
                    if($.isFunction( options.callbacks.CB_CloseDetail ))
                    {
                        options.callbacks.CB_CloseDetail.apply(this, arguments);
                    }
                },
                /**
                 * callback to close all details
                 *
                 * @return void
                 */
                CB_CloseAll : function(){
                    if($.isFunction( options.callbacks.CB_CloseAll ))
                    {
                        options.callbacks.CB_CloseAll.apply(this, arguments);
                    }
                }
            },
            /**
             *  utility functions
             */
            util = {
                /**
                 * get width column dynamically
                 *
                 * @param htmlElement container of all 
                 * 
                 * @return int - the width column
                 */
                getWidthColumn : function(el){
                    var $e          = el, 
                        full_w      = $e.width(),
                        opt_col     = options.thumbnail.columns,
                        w           = full_w/opt_col;

                        while(w <= options.thumbnail.minSize)
                        {
                            if(full_w <= options.thumbnail.minSize) return false;
                            opt_col = opt_col-1;
                            w       = full_w/opt_col;
                        }

                    return w;
                },
                /**
                 * open the detail of item clicked
                 *
                 * @param htmlElement the thumbnail 
                 * 
                 * @return void
                 */
                openContent : function(thumb){
                    var $el     = thumb,
                        $parent = $el.parent(),
                        d       = options.selectors.details,
                        a       = options.selectors.arrow,
                        open    = options.config.open,
                        speed   = options.details.speed,
                        auto_h  = $('.'+d).find('> div').height(),
                        close   = options.selectors.close,
                        nauto_h = auto_h+(30-(options.thumbnail.margin*2));

                    $el.addClass(open);
                    $el.parent().addClass(open);

                    if(options.config.keepOpen===true)
                    {
                        $parent.css({
                            'margin-bottom' : nauto_h+'px'
                        }).addClass('wm-margin');

                        $parent.find('.'+d).css({
                            'height' : nauto_h+'px'
                        }).addClass(open);

                        callbacks.CB_OpenDetail();
                    }
                    else
                    {
                        $parent.animate({
                            'margin-bottom' : nauto_h+'px'
                        }, speed).addClass('wm-margin');
                        
                        $parent.find('.'+d).stop().animate({
                            height : nauto_h+'px',
                        }, speed, function(){
                            callbacks.CB_OpenDetail();
                        }).addClass(open);

                        $parent.find('.'+a).show();
                    }

                    if(options.config.openToTop)
                    {
                        if($parent.offset())
                        {
                            var top = $parent.offset().top;
                            $("html, body").animate({scrollTop:top}, '500');
                        }
                    }

                    // callback open detail
                    callbacks.container  = $parent.parent();
                    callbacks.element    = $parent;
                    callbacks.thumbnail  = $el;
                    callbacks.details    = $parent.find('.'+d);
                    callbacks.close      = $parent.find('.'+close);
                    
                },
                /**
                 * close the detail of item opened
                 *
                 * @param htmlElement container of all
                 * @param htmlElement the thumbnail 
                 * 
                 * @return void
                 */
                closeContent : function(el, thumb){
                    var $el     = el, 
                        $th     = thumb, 
                        d       = options.selectors.details,
                        t       = options.selectors.thumbnail,
                        i       = options.selectors.item,
                        a       = options.selectors.arrow,
                        close   = options.selectors.close,
                        open    = options.config.open,
                        speed   = options.details.speed;

                    $el.find('.'+t).removeClass(open);
                    $el.find('.'+i).removeClass(open);

                    if(options.config.keepOpen===true)
                    {
                        var em =  $el.find('.wm-margin')
                        var op = $el.find('.'+open);

                        em.removeClass('wm-margin');

                        op.removeClass(open);

                        if($th) util.openContent($th);

                        em.css({
                            'margin-bottom' : '0px'
                        });

                        op.css({
                            'height' : '0px'
                        });

                        callbacks.CB_CloseDetail();
                    }
                    else
                    {
                        $el.find('.wm-margin').animate({
                            'margin-bottom' : '0px'
                        }, (speed+50)).removeClass('wm-margin');

                        $el.find('.'+d+'.'+open).stop().animate({
                            height : '0px'
                        },speed, function(){

                            $(this).removeClass(open);
                            if($th) util.openContent($th);

                            callbacks.CB_CloseDetail();
                        });
                    }

                    $el.parent().find('.'+a).hide();

                    // callback close detail
                    callbacks.container  = $el;
                    callbacks.element    = ($th===false) ? $el.find('.'+i) : $th.parent();
                    callbacks.thumbnail  = ($th===false) ? $el.find('.'+t) : $th;
                    callbacks.details    = ($th===false) ? $el.find('.'+d) : $th.parent().find('.'+d);
                    callbacks.close      = ($th===false) ? $el.find('.'+close) : $th.parent().find('.'+close);
                    
                }
            },
            /**
             *  validation roles
             */
            funcs = {
                /**
                 * set dimension of columns and arrow position
                 *
                 * @param htmlElement container of all
                 * @param htmlElement the item 
                 * @param htmlElement the thumbnail 
                 * @param htmlElement the box arrow 
                 * 
                 * @return void
                 */
                dynamicCSS : function(el, item, thumb, arrow){
                    var $e      = el, 
                        $i      = item, 
                        $t      = thumb, 
                        $a      = arrow,
                        d       = options.selectors.details,
                        size    = util.getWidthColumn($e),
                        open    = options.config.open,
                        margin  = options.thumbnail.margin,
                        ar_pos  = ($t.width()/2) - (margin*2),
                        auto_h  = $('.'+d).find('> div').height(),
                        nauto_h = auto_h+(30-(margin*2));

                    if($('.'+d).hasClass(open))
                    {
                        $('.'+options.selectors.item+'.'+open).css({
                            'margin-bottom' : nauto_h+'px'
                        });
                        
                        $('.'+d+'.'+open).css({
                            height : nauto_h+'px',
                        });
                    }

                    $i.css({
                        width : size+'px',
                        height : size+'px',
                    });

                    $a.css({
                        left : ar_pos+'px'
                    });

                    if(options.config.hasImg)
                    {
                        $t.css({
                            'line-height' : Math.floor((size-margin*2)-1)+'px'
                        });

                        $t.find('img').css({
                            'max-width'  : Math.ceil((size-margin*2))+'px',
                            'max-height' : Math.ceil((size-margin*2))+'px'
                        });
                    }
                    
                },
                /**
                 * open and change opened item on click event
                 *
                 * @param htmlElement container of all
                 * @param htmlElement the thumbnail 
                 * 
                 * @return void
                 */
                toogleContent : function(el, thumb){
                    var $e = el, 
                        $t = thumb;

                    $t.each(function(){
                        var $self   = $(this), 
                            open    = options.config.open;

                        $self.on('click', function(){

                            if($(this).hasClass(open)) return false;

                            if($self.parent().parent().hasClass(open))
                            {
                                util.closeContent($e, $self);
                            }
                            else
                            {   
                                util.openContent($self);
                            }

                            $self.parent().parent().addClass(open);
                            
                            return false;
                        });
                    });
                },
                /**
                 * close opened item on click buttom of to close
                 *
                 * @param htmlElement the buttom close 
                 * 
                 * @return void
                 */
                hideContent : function(close){
                    close.on('click', function(){
                        var $t      = $(this), 
                            $parent = $t.parent().parent().parent(),
                            open    = options.config.open;

                        util.closeContent($parent, false);
                        $parent.removeClass(open);

                        // callback close all details
                        callbacks.CB_CloseAll();
                    });
                },
                /**
                 * set styles to elements
                 *
                 * @param htmlElement container of all
                 * @param htmlElement the item 
                 * @param htmlElement the thumbnail,
                 * @param htmlElement the box details 
                 * @param htmlElement the box arrow 
                 * 
                 * @return void
                 */
                staticCSS : function(el, item, thumb, details, arrow){
                    var $e      = el, 
                        $i      = item, 
                        $t      = thumb, 
                        $d      = details, 
                        $a      = arrow,
                        margin  = options.thumbnail.margin;

                    $d.css({
                        height   : '0px',
                    });

                    $d.find('> div').css({
                        'min-height' : options.details.minHeight
                    });

                    if(!options.details.full_w)
                    {
                        $d.find('> div').css({
                            'margin-left' : margin,
                            'margin-right' : margin
                        });
                    }

                    $i.css({
                        padding : margin+'px'
                    });
                }
            };

            return this.each(function () {
                var $el         = $(this), 
                    $item        = $el.find('.'+options.selectors.item),
                    $thumb       = $el.find('.'+options.selectors.thumbnail),
                    $details     = $el.find('.'+options.selectors.details),
                    $close       = $el.find('.'+options.selectors.close),
                    $arrow       = $el.find('.'+options.selectors.arrow);

                callbacks.container  = $el;
                callbacks.element    = $item;
                callbacks.thumbnail  = $thumb;
                callbacks.details    = $details;
                callbacks.close      = $close;

                funcs.staticCSS($el, $item, $thumb, $details, $arrow);

                if(options.config.onlyThumb===false)
                {
                    funcs.toogleContent($el, $thumb);
                    funcs.hideContent($close);
                }
                
                
                // set columns in ready document
                funcs.dynamicCSS($el, $item, $thumb, $arrow);

                // delay to set columns 
                setTimeout(function(){
                    funcs.dynamicCSS($el, $item, $thumb, $arrow);

                    // callback load
                    callbacks.CB_LoadGrid();
                    $el.css({'filter':'alpha(opacity=100)', 'zoom':'1', 'opacity':'1'});
                }, 100);

                // set columns in resize element
                $(window).resize(function(){
                    funcs.dynamicCSS($el, $item, $thumb, $arrow);

                    // delay to set columns in resize
                    setTimeout(function(){
                        funcs.dynamicCSS($el, $item, $thumb, $arrow);

                        // callback resize
                        callbacks.CB_ResizeGrid();
                    }, 100);

                });
            });
        }
    });
})(jQuery);