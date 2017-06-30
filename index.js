window.TEST = 'tsetestsetestset';

(function (global, factory) {
    global.ImageViewer = factory();
}(window, function(){

    var DEFAULTS = {
        active: null,
        zoomable: true,
        scalable: true,
        fullscreen: true,
        maxLength: 8,
        zIndex: 999,
        _footerWidth: 560,
        maxRatio: 3,
    };

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };


    function _isObject(obj) {
        return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
    }

    // extend object
    function _extend(obj) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len-1 : 0), _key = 1;  _key < _len; _key++){
            args[_key-1] = arguments[_key];
        }

        if (_isObject(obj) && args.length > 0) {
            if (Object.assign) {
                return Object.assign.apply(Object, [obj].concat(args));
            }

            args.forEach(function(arg){
                if (_isObject(arg)) {
                    Object.keys(arg).forEach(function (key) {
                        obj[key] = arg[key];
                    })
                }
            })
        }

        return obj;
    }

    function _getNthChild(element, index) {
        var childArray = element.children || ele.childNodes;
        var result = [];
        for(var i=0, len=childArray.length; i<len; i++) {
            if(childArray[i].nodeType === 1) {
                result.push(childArray[i]);
            }
        }

        return result[index];
    }

    function _removeElement(element) {
        var parent = element.parentNode;
        if(parent){
            parent.removeChild(element);
        }
    }

    function _getByTag(element, tagName) {
        return element.getElementsByTagName(tagName);
    }

    function _getByClass(element, className) {
        return element.getElementsByClassName ? element.getElementsByClassName(className) : element.querySelectorAll('.' + className);
    }

    function _addClass(element, newClass) {
        if ( element.classList ) {
            element.classList.add(newClass);
            return;
        }

        var className = trim(element.className);

        if (!className) {
            element.className = newClass;
        } else if (className.indexOf(newClass) < 0) {
            element.className = className + ' ' + value;
        }
    }

    function _removeClass(element, oldClass) {
        if( element.classList ) {
            element.classList.remove(oldClass);
            return;
        }

        if (element.className.indexOf(oldClass) >=0 ) {
            element.className = element.className.replace(oldClass, '');
        }
    }

    function _hasClass(element, className) {
        if( element.classList ) {
            return element.classList.contains(className);
        }

        return element.className.indexOf(className)>=0;
    }

    function _getEvent(event) {
        var e = event || window.event;

        // Fix target property (IE8)
        if (!e.target) {
            e.target = e.srcElement || document;
        }

        function isNumber(num) {
            return typeof num === 'number' && !isNaN(num);
        }
        if (!isNumber(e.pageX) && isNumber(e.clientX)) {
            var eventDoc = event.target.ownerDocument || document;
            var doc = eventDoc.documentElement;
            var body = eventDoc.body;

            e.pageX = e.clientX + ((doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0));
            e.pageY = e.clientY + ((doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0));
        }

        return e;
     }

     function  _preventDefault (event) {  
        if(event.preventDefault){  
            event.preventDefault();  
        }else{  
            event.returnValue = false;  
        }  
    }


    function _addListener(element, evType, handler) {
        if(element.addEventListener) {
            element.addEventListener(evType, handler);
        } else if(element.attachEvent) {
            element.attachEvent('on' + evType, handler);
        }
    }

    /**
     * 节流函数
     * @param {*} fn 
     * @param {*} threshhold 
     */
    function _throttle(fn, threshhold) {

        // 记录上次执行的时间
        var last

        // 定时器
        var timer

        // 默认间隔为 250ms
        threshhold || (threshhold = 250)

        // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
        return function () {

            // 保存函数调用时的上下文和参数，传递给 fn
            var context = this
            var args = arguments

            var now = +new Date()

            // 如果距离上次执行 fn 函数的时间小于 threshhold，那么就放弃
            // 执行 fn，并重新计时
            if (last && now < last + threshhold) {
            clearTimeout(timer)

            // 保证在当前时间区间结束后，再执行一次 fn
            timer = setTimeout(function () {
                last = now
                fn.apply(context, args)
            }, threshhold)

            // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
            } else {
            last = now
            fn.apply(context, args)
            }
        }
    }

    /**
     * 防弹跳函数
     * @param {*} fn 
     * @param {*} delay 
     */ 
    function _debounce(fn, delay) {

        // 定时器，用来 setTimeout
        var timer

        // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
        return function () {

            // 保存函数调用时的上下文和参数，传递给 fn
            var context = this
            var args = arguments

            // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
            clearTimeout(timer)

            // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
            // 再过 delay 毫秒就执行 fn
            timer = setTimeout(function () {
            fn.apply(context, args)
            }, delay)
        }
    }

    function _createTemplate() {
        var template = '<div class="viewer-info" style="height: 30px;">'
                + '<span class="viewer-name">未知</span><span class="viewer-size">100*100</span>'
            + '</div>'
            + '<div class="viewer-container">'
            + '<div class="viewer-canvas"></div>'          
        + '</div>'
        + '<div class="viewer-footer">'
            + '<ul class="viewer-toolbar">'
                + '<li class="btn viewer-zoom-out"><span></span></li>'
                + '<li class="btn viewer-curratio"><span>100%</span></li>'
                + '<li class="btn viewer-zoom-in"><span></span></li>'          
                // + '<li class="btn viewer-prev"><i class="fa fa-angle-double-left"></i></li>'
                // + '<li class="btn viewer-next"><i class="fa fa-angle-double-right"></i></li>'
                + '<li class="btn viewer-toggle"><span></span></li>'
                + '<li class="btn viewer-new-page"><span></span></li>'
                + '<li class="btn viewer-download"><a href="#" download></a></li>'
                
            + '</ul>'
            + '<div class="viewer-navbar">'
                + '<ul class="viewer-list"></ul>'
            + '</div>'
            + '<div class="viewer-opt-prev"></div>'
            + '<div class="viewer-opt-next"></div>'
        + '</div>'

        var container = document.createElement('div');
        container.setAttribute('class', 'viewer-root');
        container.innerHTML = template;

        var prevbtn = document.createElement('div');
        prevbtn.setAttribute('class', 'viewer-opt-prev-lg');
        var nextbtn = document.createElement('div');
        nextbtn.setAttribute('class', 'viewer-opt-next-lg');
        document.body.appendChild(container);
        document.body.appendChild(prevbtn);
        document.body.appendChild(nextbtn);              
    }

    function _createShadow() {
        var _sv_w = _getViewSize()["w"];
		var _sv_h = _getViewSize()['h'];
        var elementShadow = document.createElement('div');
        var elementClose = document.createElement('div');
        elementShadow.setAttribute('class', 'viewer-shadow');
        elementShadow.style.width = _sv_w + 'px';
        elementShadow.style.height = _sv_h + 'px';   

        elementClose.setAttribute('class', 'viewer-opt-close');
        //elementClose.innerHTML = '<i class="fa fa-close"></i>';

        document.body.appendChild(elementShadow);     
        document.body.appendChild(elementClose);
    }

    function _createPrompt() {

    }

    function _getViewSize() {
        return {
            w: window['innerWidth'] || document.documentElement.clientWidth,
            h: window['innerHeight'] || document.documentElement.clientHeight
        }
    }

    function _getPosition(ev) {
        var event = ev || windows.event;
		if(event.pageX || event.pageY){
			return {x:event.pageX, y:event.pageY};
		}
		return {
			x:event.clientX + document.body.scrollLeft - document.body.clientLeft,
			y:event.clientY + document.body.scrollTop - document.body.clientTop
		};        
    }

    /**
     * 
     * @param {*} options 
     * @param {*} _originalEvent 
     * @param {*} _reset  指定是否reset图片的中心位置 还原和最大化的时候用
     */
    function _zoomTo(options, _originalEvent, _reset){
        var imageData = options.activeImg;
        var ratio = options.activeImg.curRatio;
        var center = {};
        if(_originalEvent) {
            center = _getPosition(_originalEvent);
        } else {
            center = {
                x: _getByClass(options.rootNode, 'viewer-container')[0].offsetLeft + options._canvas_width/2,
                y: _getByClass(options.rootNode, 'viewer-container')[0].offsetTop + options._canvas_height/2,
            }
        }

        // center = {
        //         x: _getByClass(options.rootNode, 'viewer-container')[0].offsetLeft + options._canvas_width/2,
        //         y: _getByClass(options.rootNode, 'viewer-container')[0].offsetTop + options._canvas_height/2,
        //     }

        _renderImage(options, center, _reset);

        

    }

    function _renderImage(options, center, reset){
      ///_renderImage(options, center);
        var imageData = options.activeImg;
        var ratio = imageData.curRatio;
        var elementRatio = _getByTag(_getByClass(options.rootNode, 'viewer-curratio')[0], 'span')[0];
        var elementContainer = _getByClass(options.rootNode, 'viewer-container')[0];
        var elmentCanvas = _getByClass(options.rootNode, 'viewer-canvas')[0];
        var elementImage = _getByTag(elmentCanvas, 'img')[0];
        var oldWidth = parseFloat(elementImage.style.width);
        var oldHeight = parseFloat(elementImage.style.height);
        var newWidth = imageData.width * ratio;
        var newHeight = imageData.height * ratio;
        
        
        var oldMarginLeft = parseFloat(elementImage.style.marginLeft);
        var oldMarginTop = parseFloat(elementImage.style.marginTop);
        var imageLeft= oldMarginLeft + elementContainer.offsetLeft; 
        var imageTop = oldMarginTop + elementContainer.offsetTop; 
        elementRatio.innerHTML = (ratio * 100).toFixed(0) + '%';
        elementImage.style.width = newWidth + 'px';
        elementImage.style.height = newHeight + 'px';
        if(reset){
            elementImage.style.marginLeft = (options._canvas_width - newWidth)/2 + 'px';
            elementImage.style.marginTop = (options._canvas_height - newHeight)/2 + 'px';
        }else{
            elementImage.style.marginLeft = (oldMarginLeft - (center.x-imageLeft) * (newWidth/oldWidth-1)) + 'px';
            elementImage.style.marginTop = (oldMarginTop - (center.y -imageTop) * (newWidth/oldWidth -1)) + 'px';
        }   
    }

    /**
     * 
     * @param {*} options 
     */
    function _setViewImage(options, resize) {
        options.clickable = false;
        _checkOptStyle(options);
        var elementRatio = _getByTag(_getByClass(options.rootNode, 'viewer-curratio')[0], 'span')[0];
        var element_canvas = _getByClass(options.rootNode, 'viewer-canvas')[0];
        var elementToggle = _getByClass(options.rootNode, 'viewer-toggle')[0];
        var _sv_w = _getViewSize()["w"];
		var _sv_h = _getViewSize()['h'];
		// var _sf_w = getFullSize()["w"];
		// var _sf_h = getFullSize()['h'];
		// var _w = _sv_w*0.9; //这里用视口的宽度，具体视情况
		// var _h = _sv_h-200;
        var _w = options._canvas_width;
        var _h = options._canvas_height;

        var imgTemp = new Image();
		imgTemp.src = options.activeImg.url;
        imgTemp.setAttribute('class', 'viewer-current-image');

        if(!resize) {
            var loadingImage = new Image();
            //loadingImage.src = './imgs/icons/loading.gif';
            loadingImage.setAttribute('class', 'viewer-loading');
            loadingImage.style.width = '80px';
            loadingImage.style.height = '80px';
            loadingImage.style.borderRadius = '10px';
            loadingImage.style.marginLeft = (options._canvas_width - 80)/2 + 'px';
            loadingImage.style.marginTop = (options._canvas_height - 80)/2 + 'px';
            element_canvas.innerHTML = '';
            element_canvas.appendChild(loadingImage);
        }
        


		imgTemp.onload = function() {
			var realWidth = this.width;
			var realHeight = this.height;
			var realRatio = realWidth/realHeight;
			var viewRatio = _w/_h;
		
			var style = {
				width: realWidth,
				height: realHeight,
			}

            options.activeImg.minRatio = 1;
			if(realRatio > viewRatio) {
				if (realWidth > _w) {
					style.width = _w;
					//style.height = 'auto';
                    style.height = (_w/realWidth) * realHeight;
                    options.activeImg.minRatio = parseFloat(_w/realWidth).toFixed(3);
				}
			} else {
				if (realHeight > _h) {
					style.height = _h;
					//style.width = 'auto';
                    style.width = (_h/realHeight) * realWidth;
                    options.activeImg.minRatio = parseFloat(_h/realHeight).toFixed(3);
				}
			}

            options.activeImg.curRatio = options.activeImg.minRatio;
            if(options.activeImg.curRatio == 1){
                _addClass(elementToggle, 'viewer-disabled');
                _removeClass(elementToggle, 'viewer-init');
                _removeClass(elementToggle, 'viewer-origin');
            } else {
                _addClass(elementToggle, 'viewer-origin');
                _removeClass(elementToggle, 'viewer-init');
                _removeClass(elementToggle, 'viewer-disabled');
            }

            imgTemp.style.marginLeft = (options._canvas_width - style.width)/2 + 'px';
            imgTemp.style.marginTop = (options._canvas_height - style.height)/2 + 'px';
            //imgTemp.style.marginTop = 

			imgTemp.style.width = style.width + 'px';
			imgTemp.style.height = style.height + 'px';
            
            elementRatio.innerHTML = (options.activeImg.curRatio * 100).toFixed(0) + '%';

            _getByClass(options.rootNode, 'viewer-name')[0].innerHTML = options.activeImg.name;
            _getByClass(options.rootNode, 'viewer-size')[0].innerHTML = '( ' + realWidth + 'x' + realHeight + ' )';

            options.activeImg.width = realWidth;
            options.activeImg.height = realHeight;
            options.images[options.activeImg.index].width = realWidth;
            options.images[options.activeImg.index].height = realHeight;

            
            // setTimeout(tempFunc, 2000);
			// function tempFunc(){
                options.clickable = true;
                element_canvas.innerHTML = '';
                element_canvas.appendChild(imgTemp);
            // }

            //  在非firefox浏览器中，滚轮向上滚动返回的数值是120，向下滚动返回-120
            // 而在firefox浏览器中，滚轮向上滚动返回的数值是-3，向下滚动返回3
            // firefox浏览器专用

            if(document.addEventListener){
                document.addEventListener('DOMMouseScroll',_wheelFunction,false);
            }
            imgTemp.onmousewheel = _wheelFunction;

            function _wheelFunction(e){
                var self = this;
                var ev = _getEvent(e);
                _preventDefault(e);

                self.wheeling = true;

                setTimeout(function () {
                    self.wheeling = false;
                }, 50);

                // var newRatio = Math.min((options.activeImg.curRatio*1.1).toFixed(3), options.maxRatio);
                // if(newRatio > 0.95 && newRatio < 1.05) {
                //     newRatio = 1;
                // }
                
                var delta = 1;

                if (ev.deltaY) {
                    delta = ev.deltaY > 0 ? 1 : -1;
                } else if (ev.wheelDelta) {
                    delta = -ev.wheelDelta / 120;
                } else if (ev.detail) {
                    delta = ev.detail > 0 ? 1 : -1;
                }
                // console.log('delta', delta);
                // console.log('deltaY', ev.deltaY);
                // console.log('ev.wheelDelta', ev.wheelDelta);
                // console.log('detail', ev.detail);

                
                var newRatio = Math.max(Math.min((options.activeImg.curRatio*(1-delta*0.1)).toFixed(3), options.maxRatio), options.activeImg.minRatio);
                if(newRatio > 0.95 && newRatio < 1.05) {
                    newRatio = 1;
                }
                // console.log('updateRatio', newRatio);
                options.activeImg.curRatio = newRatio;
                _zoomTo(options,e);
                //self.zoom(-delta * ratio, true, e);
            }
		}

        _setActiveStyle(options);
    }

    function _setActiveStyle(options) {
        var element_viewer_list = _getByClass(options.rootNode, 'viewer-list')[0];
        var isNavlistExist = !!_getByTag(element_viewer_list, 'li').length;
        if (isNavlistExist) {
            _removeClass(_getByClass(options.rootNode, 'viewer-active')[0], 'viewer-active');
            _addClass(_getNthChild(element_viewer_list, options.activeImg.index), 'viewer-active');
        }
    }

    function _setNavlist(options) {
        var activeImg = options.activeImg;
        var elementNavBar = _getByClass(options.rootNode, 'viewer-navbar')[0];
        var elementNavlist = _getByClass(options.rootNode, 'viewer-list')[0];
        //console.log('activeImg',activeImg);
        elementNavlist.innerHTML = '';

        if(options.images.length <=1) {
            elementNavBar.style.display = "none";
            return;
        }
        elementNavBar.style.display = "";
        options.images.forEach( function(image, index) {
            var li = document.createElement('li');
            
            if(image.index === activeImg.index) {
                li.setAttribute('class', 'viewer-active');
                //console.log(li);
            }

            var element_img = new Image();
            element_img.src = image.thumbUrl || image.url;

            var loadingImage = new Image();
            // loadingImage.src = './imgs/icons/loading.gif';
            loadingImage.setAttribute('class', 'viewer-loading-small');
            loadingImage.style.width = '56px';
            loadingImage.style.height = '44px';
            li.appendChild(loadingImage);
            elementNavlist.appendChild(li);

            if(index> options.showEndIndex) {
                li.style.display = 'none';
            }

            element_img.onload = function(){
                var width = this.width;
                var height = this.height;

                // var delayHandler = function(){
                    li.innerHTML = '';
                    li.appendChild(element_img);
                    li.onclick = (function(img){
                        return function(){
                            options.activeImg = img;
                            _setViewImage(options);
                        };
                    })(image);
                // }

                // setTimeout(delayHandler, 2000);
                
            }     
        })
    }

    function _checkOptStyle(options){
        var activeIndex = options.activeImg.index;
        
        if(activeIndex === 0) {
            options.hidePrev = true;
            _getByClass(options.rootNode, 'viewer-opt-prev')[0].style.visibility = 'hidden';
            _getByClass(document.body, 'viewer-opt-prev-lg')[0].style.visibility = 'hidden';

        }else {
            options.hidePrev = false;
            _getByClass(options.rootNode, 'viewer-opt-prev')[0].style.visibility = 'visible';
        }  

        if(activeIndex === options.images.length-1) {
            options.hideNext = true;
            _getByClass(options.rootNode, 'viewer-opt-next')[0].style.visibility = 'hidden';
            _getByClass(document.body, 'viewer-opt-next-lg')[0].style.visibility = 'hidden';
        }else {
            options.hideNext = false;
            _getByClass(options.rootNode, 'viewer-opt-next')[0].style.visibility = 'visible';
        }     

        //判断预览列表小图片的显示/隐藏情况
        var elementNavList = _getByClass(options.rootNode, 'viewer-list')[0];
        if (activeIndex > options.showEndIndex) {
            _getNthChild(elementNavList, activeIndex).style.display="";
            _getNthChild(elementNavList, options.showStartIndex).style.display="none";
            options.showStartIndex++;
            options.showEndIndex++;
        } else if (activeIndex < options.showStartIndex) {
            _getNthChild(elementNavList, activeIndex).style.display="";
            _getNthChild(elementNavList, options.showEndIndex).style.display="none";
            options.showStartIndex--;
            options.showEndIndex--;
        }


    }

    function _setLayoutSize(options) {
        var _sv_w = _getViewSize()['w'];
        var _sv_h = _getViewSize()['h'];

        options._canvas_width = _sv_w*0.9;
        options._canvas_height = _sv_h-200;

        if(options.images.length === 1) {
           options. _canvas_height += 80;
        }
        
    
        var elememtPrevLg = _getByClass(document.body, 'viewer-opt-prev-lg')[0];
        var elementNextLg = _getByClass(document.body, 'viewer-opt-next-lg')[0];
        var elementClostBtn = _getByClass(document.body, 'viewer-opt-close')[0];
        options.rootNode.style.height = _sv_h + 'px';
        _getByClass(options.rootNode, 'viewer-info')[0].style.width = _sv_w + 'px';
        _getByClass(document.body, 'viewer-shadow')[0].style.width = _sv_w + 'px';
        _getByClass(document.body, 'viewer-shadow')[0].style.height = _sv_h + 'px';
       _getByClass(options.rootNode, 'viewer-canvas')[0].style.height = options._canvas_height + 'px';
       _getByClass(options.rootNode, 'viewer-canvas')[0].style.width = options._canvas_width + 'px';

       _getByClass(document.body, 'viewer-footer')[0].style.left = parseFloat((_sv_w-options._footerWidth)/2) + 'px';
       //var offsetLeft = parseInt((_sv_w - realWidth*options.activeImg.minRatio)/2);
       _getByClass(options.rootNode, 'viewer-container')[0].style.left = parseFloat((_sv_w-options._canvas_width)/2) + 'px';
       elememtPrevLg.style.left = '60px';
       elementNextLg.style.right = '60px';
       elememtPrevLg.style.top = elementNextLg.style.top = (30+ options._canvas_height/2) + 'px';
       elememtPrevLg.style.zIndex = options.zIndex+1;
       elementNextLg.style.zIndex = options.zIndex+1;
       elementClostBtn.style.zIndex = options.zIndex+1;
       options.rootNode.style.zIndex = options.zIndex;
    }

    function _init(options) {

        //_checkOptStyle(options);
        _setLayoutSize(options);
             
        _setViewImage(options);
        _setNavlist(options);
        
    }

    /**
     * 可根据options.clickable判断是否可进行事件处理
     */
    function _bindEvents(options){

        /**
         * 鼠标上下图片切换事件绑定
         */
        var elementCanvas = _getByClass(options.rootNode, 'viewer-canvas')[0];
        _addListener(elementCanvas, 'click', function(e) {
            var flagLeft = _hasClass(elementCanvas, 'viewer-left');
            var flagRight = _hasClass(elementCanvas, 'viewer-right');
            if ( flagLeft ) {
                var newActiveIndex = options.activeImg.index>0 ? options.activeImg.index-1 : 0;
                var newActiveImage = options.images[newActiveIndex];
                options.activeImg = newActiveImage;
                _setViewImage(options);
            } else if ( flagRight ) {
                var newActiveIndex = options.activeImg.index<options.images.length-1 ? options.activeImg.index+1 : options.images.length-1;
                var newActiveImage = options.images[newActiveIndex];
                options.activeImg = newActiveImage;
                 _setViewImage(options);
            }
            
            //_checkOptStyle(options);
           
        });

    
        /**
         * 预览小图片列表中的上下切换事件绑定
         */
        _addListener(_getByClass(options.rootNode, 'viewer-opt-prev')[0], 'click', function(e) {
            var newActiveIndex = options.activeImg.index>0 ? options.activeImg.index-1 : 0;
            var newActiveImage = options.images[newActiveIndex];
            options.activeImg = newActiveImage;
            //_checkOptStyle(options);
            _setViewImage(options);
        });

        _addListener(_getByClass(options.rootNode, 'viewer-opt-next')[0], 'click', function(e){
            var newActiveIndex = options.activeImg.index<options.images.length-1 ? options.activeImg.index+1 : options.images.length-1;
            var newActiveImage = options.images[newActiveIndex];
            options.activeImg = newActiveImage;
            //_checkOptStyle(options);
            //_checkOptStyle(options);
            _setViewImage(options);
        })

        /**
         * 销毁组件
         */
        _addListener(_getByClass(document.body, 'viewer-opt-close')[0], 'click', function(e){
            _removeElement(options.rootNode);
            _removeElement(_getByClass(document.body, 'viewer-shadow')[0]);
            _removeElement(_getByClass(document.body, 'viewer-opt-close')[0]);
            _removeElement(_getByClass(document.body, 'viewer-opt-prev-lg')[0]);
            _removeElement(_getByClass(document.body, 'viewer-opt-next-lg')[0]);


        });

        // 放大
        _addListener(_getByClass(options.rootNode, 'viewer-zoom-in')[0], 'click', function(e){
            // console.log('viewer-zoom-in clicked')
            var newRatio = Math.min((options.activeImg.curRatio*1.1).toFixed(3), options.maxRatio);
            if(newRatio > 0.95 && newRatio < 1.05) {
                newRatio = 1;
            }
            options.activeImg.curRatio = newRatio;
            _zoomTo(options);

        });

        // 缩小
        _addListener(_getByClass(options.rootNode, 'viewer-zoom-out')[0], 'click', function(e){
            var newRatio = Math.max((options.activeImg.curRatio*0.9).toFixed(3), options.activeImg.minRatio);
            if(newRatio > 0.95 && newRatio < 1.05) {
                newRatio = 1;
            }
            options.activeImg.curRatio = newRatio;
            _zoomTo(options);

        });


        // 
        // 实际大小/初始尺寸切换
        _addListener(_getByClass(options.rootNode, 'viewer-toggle')[0], 'click', function(e){            
            var imageData = options.activeImg;
            var elementToggle = _getByClass(options.rootNode, 'viewer-toggle')[0];
            var elementToggleInit = _getByClass(options.rootNode, 'viewer-init')[0];
            var elementToggleOrgin = _getByClass(options.rootNode, 'viewer-origin')[0];
            //console.log('before minRatio', imageData.minRatio);
            //console.log('before: curRatio', imageData.curRatio);           
            if(elementToggleOrgin){
                imageData.curRatio = 1;  
                _addClass(elementToggle, 'viewer-init');
                _removeClass(elementToggle, 'viewer-origin');  
            }else if(elementToggleInit){
                imageData.curRatio = imageData.minRatio;
                //_addClass(elementToggle, 'real-view');
                _addClass(elementToggle, 'viewer-origin');
                _removeClass(elementToggle, 'viewer-init'); 
            }
            _zoomTo(options, null, true);


        });

        /**
         * 新标签打开图片
         */
        _addListener(_getByClass(options.rootNode, 'viewer-new-page')[0], 'click', function(e){            
            window.open(options.activeImg.url);
        });

        /**
         * 下载图片
         */
        _addListener(_getByClass(options.rootNode, 'viewer-download')[0], 'click', function(e){
            var elementDownLoad = _getByClass(options.rootNode, 'viewer-download')[0];
            //elementDownLoad.innerHTML = '<a href="#" ></a>';
            var odownLoad = _getByTag(elementDownLoad, 'a')[0];
            var browser = (function(){
                var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串 
                var isOpera = userAgent.indexOf("Opera") > -1; if (isOpera) { return "Opera" }; 
                if (userAgent.indexOf("Firefox") > -1) { return "FF"; } 
                if (userAgent.indexOf("Chrome") > -1){ return "Chrome"; } 
                if (userAgent.indexOf("Safari") > -1) { return "Safari"; } 
                if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) { return "IE"; }; 
                if (userAgent.indexOf("Trident") > -1) { return "Edge"; } 

            })();
            
            // console.log('浏览器：', browser);

            function saveAsFile(imageUrl){
                // console.log('save as ...', imageUrl)
                var oPop = window.open(imageUrl); 
                for(; oPop.document.readyState != "complete"; ) { 
                    if (oPop.document.readyState == "complete") break;
                } 
                oPop.document.execCommand("SaveAs"); 
                oPop.close();
            }

            if (browser==="IE"||browser==="Edge"){ 
                odownLoad.href="#"; 
                var oImg=document.createElement("img"); 
                oImg.style.display = 'none';
                oImg.src=options.activeImg.url; 
                oImg.id="downImg"; 
                //var odown=document.getElementById("down"); 
                document.body.appendChild(oImg); 
                saveAsFile(document.getElementById('downImg').src); 
            }else{ //!IE
                 odownLoad.href=options.activeImg.url; 
                 odownLoad.download="";
                 //odownLoad.click(); 
            }         
        });

        /**
         * 图片拖动
         */
        //var elementImage = _getByTag(elementCanvas, 'img')[0];
        _addListener(elementCanvas, 'mousedown', function(e){
            var target = _getEvent(e).target;
            // console.log('target-----------------------', target);
            var isImage = _hasClass(target, 'viewer-current-image');
            if(isImage) {
                var startPos = _getPosition(e);
                // console.log('startPos', startPos);
                _preventDefault(e);
                options.draggable = true;
                options.dragStart = startPos;
            }
            

            //_checkSwitchOpts(options, "none");
        });

        function _getAreaValue(num1, num2, value){
                var start = num1;
                var end = num2;
                if(num1>num2){
                    start = num2;
                    end = num1;
                }

                if(value >= start && value <=end) {
                    return value;
                }

                if(value> end) {
                    return end;
                }

                if(value < start){
                    return start;
                }
        }

        /**
         * 拖动图片
         */
        
        
        _addListener(elementCanvas, 'mousemove', function(e){ 
                       
            //e.preventDefault();
            if(!options.draggable) return;//开始拖动  
            // console.log('mousemove----------');
            var target = _getByTag(elementCanvas, 'img')[0];
            var pos = _getPosition(e);
            // console.log('currrent pos:', pos);  
            // console.log('offset-Left:', pos.x-options.dragStart.x);
            // console.log('offset-Top:', pos.y-options.dragStart.y);
            
            var oldMarginLeft = parseFloat(target.style.marginLeft);
            var oldMarginTop = parseFloat(target.style.marginTop);
            // var _sv_w = _getViewSize()['w'];
            // var _sv_h = _getViewSize()['h'];
            var canvas_width = options._canvas_width;
            var canvas_height = options._canvas_height;
            var width = parseFloat(target.style.width);
            var height = parseFloat(target.style.height);
            var marginLeft = oldMarginLeft + pos.x - options.dragStart.x;
            var marginTop = oldMarginTop + pos.y - options.dragStart.y;
            var finalMarginLeft = _getAreaValue(0, canvas_width - width, marginLeft);
            var finalMarginTop = _getAreaValue(0, canvas_height - height, marginTop);
            target.style.marginLeft = finalMarginLeft + 'px';
            target.style.marginTop = finalMarginTop + 'px';
            // options.draggable = false;
            options.dragStart.x = pos.x;
            options.dragStart.y = pos.y;

        });

        // document.body.addEventListener('mouseup', function(e){
        //     options.draggable = false;
        // });

        _addListener(document.body, 'mouseup', function(e){
            options.draggable = false;
        });


        /**
         * 鼠标移动事件 确定如何显示上下切换图片按钮
         */
        _addListener(_getByClass(options.rootNode, 'viewer-container')[0], 'mousemove', function(e){
            var elementCanvas = _getByClass(options.rootNode, 'viewer-canvas')[0];
            var elementInfo = _getByClass(options.rootNode, 'viewer-info')[0];
            //console.log('elementInfo', elementInfo.style.height);
            var pos = _getPosition(e);
            //console.log('position', pos);
            var _sv_w = _getViewSize()['w'];
            var _sv_h = _getViewSize()['h'];
            var _image_w = parseFloat(_getByTag(elementCanvas, 'img')[0].style.width);
            var _image_h = parseFloat(_getByTag(elementCanvas, 'img')[0].style.height);
            var _canvas_w = parseFloat(elementCanvas.style.width);
            var _canvas_h = parseFloat(elementCanvas.style.height);
            var _info_h = parseFloat(elementInfo.style.height);
            //console.log('_sv_w', _sv_w);
            //console.log('_sv_h', _sv_h);
            // console.log('_canvas_h', _canvas_h);
            // console.log('pos.y', pos.y);
            // console.log('_info_h', _info_h);
            // console.log('_info_h+_canvas_h', (_info_h+_canvas_h));

            var switchType = 'none';
            if(pos.y > _info_h && pos.y < (_info_h + _canvas_h)){
                if(pos.x < (_sv_w/2 - _image_w/2) && pos.x > (_sv_w - _canvas_w)/2 ) {
                    switchType = 'left';
                } else if(pos.x > (_sv_w/2 + _image_w/2) && pos.x < (_sv_w/2 + _canvas_w/2)) {
                    switchType = 'right';
                }
            }
           
            var isLeft = pos.x < _sv_w/2;
            _checkSwitchOpts(options, switchType, pos);
         });        

    }

    /**
     * 根据鼠标移动的位置改变鼠标指针的样式，是显示鼠标向左还是向右，引导用户进行图片切换
     * @param {*} switchPos 
     * @param {*} pos 
     */
    function _checkSwitchOpts(options, switchType, pos){
        var elementCanvas = _getByClass(options.rootNode, 'viewer-canvas')[0];
        if(switchType == 'left' && !options.hidePrev && !options.draggable) {
            _removeClass(elementCanvas, 'viewer-right');
            _addClass(elementCanvas, 'viewer-left');
        } else if(switchType === 'right' && !options.hideNext && !options.draggable) {
            _removeClass(elementCanvas, 'viewer-left');
            _addClass(elementCanvas, 'viewer-right');
        } else {
            _removeClass(elementCanvas, 'viewer-right');
            _removeClass(elementCanvas, 'viewer-left');
        }


    }




    /******
     * 
     * 
     * 分割线
     * 哈哈哈 
     * 
     * 
     * 
     *
     */

    function ImageViewer(options) {

        var options = _extend({}, DEFAULTS, options);
        
        _createShadow();
        _createTemplate();

        var rootNode = _getByClass(document.body, 'viewer-root')[0];

        if(rootNode) {
            options['rootNode'] = rootNode;
        }
        
        options.images.forEach( function(image, index) {
            image.index = index;
        });

        if ( !options.activeImg && options.images.length>0 ) {
            options.activeImg = options.images[0];
        }
        options.showStartIndex = 0;
        options.showEndIndex = Math.min(options.maxLength, options.images.length)-1;
        // console.log('startIndex', options.showStartIndex);
        // console.log('showEndIndex', options.showEndIndex)
        _init(options);
        _bindEvents(options);

        document.body.onresize = function(){
            var _sv_w = _getViewSize()['w'];
            var _sv_h = _getViewSize()['h'];
            //_checkOptStyle(options);
            _setLayoutSize(options);
                
            _setViewImage(options, true);
            //_init(options);
            //_bindEvents(options);
        };

    }

    return ImageViewer;
}))