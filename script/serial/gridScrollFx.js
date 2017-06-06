/**
 * gridScrollFx.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
;( function( window ) {

	'use strict';
	//返回DOM树根结点html
	var docElem = window.document.documentElement,
		support = { animations : Modernizr.cssanimations },
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];

	//得到视窗的高度，取html高度和window高度的最大值
	function getViewportH() {
		var client = docElem['clientHeight'],
			inner = window['innerHeight'];

		if( client < inner )
			return inner;
		else
			return client;
	}

	//返回滚动的高度
	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	// stackOverflow给出的计算元素相当于html/window的位置，因为一般只能得到相对于父结点的高度
	function getOffset( el ) {
		var offsetTop = 0, offsetLeft = 0;
		do {
			if ( !isNaN( el.offsetTop ) ) {
				offsetTop += el.offsetTop;
			}
			if ( !isNaN( el.offsetLeft ) ) {
				offsetLeft += el.offsetLeft;
			}
		} while( el = el.offsetParent );

		return {
			top : offsetTop,
			left : offsetLeft
		}
	}

    //判断该元素在视窗内的情况
	function inViewport( el, h ) {
		var elH = el.offsetHeight,         //元素本身的高度
			scrolled = scrollY(),                //已经滚动的高度
			viewed = scrolled + getViewportH(),    //视窗高度+已经滚动的高度，已经看过的高度
			elTop = getOffset(el).top,                    //元素顶部距离html的高度
			elBottom = elTop + elH,                   //元素底部距离html的高度
			// if 0, the element is considered in the viewport as soon as it enters.
			// if 1, the element is considered in the viewport only when it's fully inside
			// value in percentage (1 >= h >= 0)
			h = h || 0;

		return (elTop + elH * h) <= viewed && (elBottom - elH * h) >= scrolled;           //是否刚好卡在视窗，将要出来
	}
   //用b来扩展a，使得a具有b所有的元素
	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}
    //得到瀑布流中的每一项
	function GridItem( el ) {
		this.el = el;
		this.anchor = el.querySelector( 'a' );
		this.image = el.querySelector( 'img' );
		this.desc = el.querySelector( 'h3' );
	}
    //原型类，增加addCurtain方法，也就是加上颜色幕布，排除白色幕布
	GridItem.prototype.addCurtain = function() {
		if( !this.image ) return;
		//添加一个幕布对象
		this.curtain = document.createElement( 'div' );
		this.curtain.className = 'curtain';
		//获得rgb，通过colorFinder
		var rgb = new ColorFinder( function favorHue(r,g,b) {
			// exclude white
			//if (r>245 && g>245 && b>245) return 0;
			return (Math.abs(r-g)*Math.abs(r-g) + Math.abs(r-b)*Math.abs(r-b) + Math.abs(g-b)*Math.abs(g-b))/65535*50+1;
		} ).getMostProminentColor( this.image );
		//增加该元素的幕布背景色
		if( rgb.r && rgb.g && rgb.b ) {
			this.curtain.style.background = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
		}
		//在锚点连接中加入幕布div
		this.anchor.appendChild( this.curtain );
	};
    //变换动态延迟时间，利用Modernizer中得到的动态对象，通过style来添加幕布，图片和描述文字的延迟
	GridItem.prototype.changeAnimationDelay = function( time ) {
		if( this.curtain ) {
			this.curtain.style.WebkitAnimationDelay = time + 'ms';
			this.curtain.style.animationDelay = time + 'ms';
		}
		if( this.image ) {
			this.image.style.WebkitAnimationDelay = time + 'ms';
			this.image.style.animationDelay = time + 'ms';
		}
		if( this.desc ) {
			this.desc.style.WebkitAnimationDelay = time + 'ms';
			this.desc.style.animationDelay = time + 'ms';
		}
	};

	//定义GridScrollFx对象，el是从html传入的获得的对象，option通过json的方式
	function GridScrollFx( el, options ) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this._init();
	}

	GridScrollFx.prototype.options = {
		// Minimum and maximum delay of the animation (random value is chosen)
		minDelay : 0,
		maxDelay : 500,
		// The viewportFactor defines how much of the appearing item has to be visible in order for the animation to start
		// if we'd use a value of 0, this would mean that it would add the animation class as soon as the item is in the viewport.
		// If we were to use the value of 1, the animation would only be triggered when we see all of the item in the viewport (100% of it)
        //定义刚开始显示的项的数量
		viewportFactor : 0
	};

	GridScrollFx.prototype._init = function() {
		var self = this, items = [];

		//Array.prototype对象的slice方法将this.el.children方法转化为数组，然后对数组进行forEach方法
		[].slice.call( this.el.children ).forEach( function( el, i ) {
		    //得到瀑布流中每一项
			var item = new GridItem( el );
			items.push( item );
		} );

		this.items = items;
		this.itemsCount = this.items.length;
		this.itemsRenderedCount = 0;
		this.didScroll = false;

		//imagesLoaded就是imagesloaded.pkgd.min.js中的方法，绑定回调事件
		imagesLoaded( this.el, function() {
			// show grid，添加loaded类
			classie.add( self.el, 'loaded' );

			// initialize masonry
			new Masonry( self.el, {
				itemSelector : 'li',
				isFitWidth : true,
				transitionDuration : 0
			} );

			// the items already shown...
			self.items.forEach( function( item ) {
				if( inViewport( item.el ) ) {
					++self.itemsRenderedCount;
					classie.add( item.el, 'shown' );
				}
				else {
					item.addCurtain();
					// add random delay
					item.changeAnimationDelay( Math.random() * ( self.options.maxDelay - self.options.minDelay ) + self.options.minDelay );
				}
			} );

			var onScrollFn = function() {
				if( !self.didScroll ) {
					self.didScroll = true;
					//设定时间调用_scrollPage()
					setTimeout( function() { self._scrollPage(); }, 200 );
				}

				if( self.itemsRenderedCount === self.itemsCount ) {
					window.removeEventListener( 'scroll', onScrollFn, false );
				}
			};

			// animate the items inside the viewport (on scroll)
			window.addEventListener( 'scroll', onScrollFn, false );
			// check if new items are in the viewport after a resize
			window.addEventListener( 'resize', function() { self._resizeHandler(); }, false );
		});
	};

	GridScrollFx.prototype._scrollPage = function() {
		var self = this;
		this.items.forEach( function( item ) {
			if( !classie.has( item.el, 'shown' ) && !classie.has( item.el, 'animate' ) && inViewport( item.el, self.options.viewportFactor ) ) {
				++self.itemsRenderedCount;

				if( !item.curtain ) {
					classie.add( item.el, 'shown' );
					return;
				}

				classie.add( item.el, 'animate' );

				// after animation ends add class shown
				var onEndAnimationFn = function( ev ) {
					if( support.animations ) {
						this.removeEventListener( animEndEventName, onEndAnimationFn );
					}
					classie.remove( item.el, 'animate' );
					classie.add( item.el, 'shown' );
				};

				if( support.animations ) {
					item.curtain.addEventListener( animEndEventName, onEndAnimationFn );
				}
				else {
					onEndAnimationFn();
				}
			}
		});
		this.didScroll = false;
	};

	GridScrollFx.prototype._resizeHandler = function() {
		var self = this;
		function delayed() {
			self._scrollPage();
			self.resizeTimeout = null;
		}
		if ( this.resizeTimeout ) {
			clearTimeout( this.resizeTimeout );
		}
		this.resizeTimeout = setTimeout( delayed, 1000 );
	};

	// add to global namespace
	window.GridScrollFx = GridScrollFx;

} )( window );