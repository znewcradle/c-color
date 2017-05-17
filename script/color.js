/**
 * Created by Xu on 2017/5/17.
 * This script is used to deal with color, like RGB and HSB
 */
/*
色轮共0-359，从255,0,0 -> 255,255,0 -> 0,255,0 -> 0,255,255 -> 0,0,255 -> 255,0,255->255,0,0
该函数用来获得色轮任意一度的颜色，色轮就是H，hue色相，取值0-359
 */
function getHcolor(top, height){
    var oneHeight = height / 6;                                                        //色轮有个6个阶段的颜色变化
    var d = 0, rgbStr;
    if (top < 1 * oneHeight) {                                                           //以下6个条件语句对应6个颜色变化阶段
        d = (top / oneHeight) * 255;
        rbgStr = "rgb(255, 0, " + Math.round(d) + ")";

    } else if(top >= 1 * oneHeight && top < 2 * oneHeight) {
        d = 255 - ((top - oneHeight)  / oneHeight) * 255;
        rgbStr = "rgb( " + Math.round(d) + ", 0, 255)";

    } else if(top >= 2 * oneHeight && top < 3 * oneHeight) {
        d = 255 - ((top - 2 * oneHeight) / oneHeight) * 255;
        rgbStr = "rgb(0, " + Math.round(d) + ", 0, 255)";

    } else if(top >= 3 * oneHeight && top < 4 * oneHeight) {
        d = 255 - ((top - 3 * oneHeight) / oneHeight) * 255;
        rgbStr = "rgb(0, 255, " + Math.round(d) + ")";

    } else if (top >= 4 * oneHeight && top < 5 * oneHeight) {
        d = 255 - ((top - 4 * oneHeight) / oneHeight) * 255;
        rgbStr = "rgb(" + Math.round(d) + ", 255, 0)";

    } else {
        d = 255 - ((top - oneHeight * 5) / oneHeight ) * 255;
        rgbStr = "rgb(255, " + Math.round(d) + ",0)";
    }
    return rgbStr;
}

/*
将HSB(V)转换为RGB，0 <= H < 1, 0 <= S, V <= 1，
算法来自https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4,维基百科的解释
 */
function hsv2rgb(H, S, V) {
    var R, G, B;
    if (S == 0) {
        R = G = B = V;
    } else {
        var _H = H * 6;
        if ( _H == 6) {
            _H = 0;
        }
        var i  = Math.floor(_H);
        var v1 = V * ( 1 - S );
        var v2 = V * ( 1 - S * (_H - i ) );
        var v3 = V * ( 1 - S * (1 - (_H - i) ) );

        if (i === 0) {
            R = V;
            G = v3;
            B = v1;
        } else if (i == 1) {
            R = v2;
            G = v;
            B = v1;
        } else if(i == 2) {
            R = v1;
            G = V;
            B = v3;
        } else if(i == 3) {
            R  = v1;
            G = v2;
            B = V;
        } else if (i == 4) {
            R  = v3;
            G = v1;
            B = V;
        } else {
            R = V;
            G = v1;
            B = v2;
        }
    }
    return {r: Math.round(R * 255), g: Math.round(G * 255), b: Math.round(B * 255)};
}
/*
让滑块滑动，计算HSB的值
 */
var Draggable = function(options) {
    var defaults = {
        onStart: "",                      //开始滑动回调
        onMove: "",                    //滑动过程回调
        onEnd: "",                      //滑动结束回调
        moveX: false,                 //仅在X轴滑动
        moveY: false,                  //仅在Y轴滑动
        container: "",                   //父容器
        handler: ""                      //滑动的元素
    };
    var settings = $.extend(defaults, options);
    var $container = $(settings.container);
    var container = $container.get(0);
    var hasContainer = $container.length  == 1 ? true : false;
    if (hasContainer) {
        console.log('hasContainer');
        var $handler = $container.find(settings.handler);
    } else {
        var $handler = $(settings.handler);
    }
    var handler = $handler.get(0);

    var oldLeft, oldTop, mouseX, mouseY, oldWidth, oldHeight, isDown = false;
    var containerWidth = hasContainer ? $container.width() : window.innerWidth;
    var containerHeight = hasContainer ? $container.height() : window.innerHeight;
    var containerLeft = hasContainer ? getPosition(container).left : 0;
    var containerTop = hasContainer ? getPosition(container).top : 0;
     //触点left,top范围。保证移动范围是container的宽高
    var dx = Math.floor($handler.width() / 2), dy = Math.floor($handler.height() / 2);
    var range = {
        left: {max: containerWidth - dx, min: -dx},
        top: {max: containerHeight - dy, min: -dy}
    };

    var lastPos, hasMoved = false;

    console.log(range);

    $handler.on("mousedown", function(e){
        e.stopPropagation();
        e.preventDefault();
        isDown = true;
        var position = getPosition(this, this.parentNode);
        oldLeft = position.left;
        oldTop = position.top;
        $(this).css({
            position: "absolute",
            left: oldLeft,
            top: oldTop,
            margin: 0
        });
        mouseX = e.pageX;
        mouseY = e.pageY;
        oldWidth = $handler.width();
        oldHeight = $handler.height();
        if ($.isFunction(settings.onStart)) {
            settings.onStart.call(handler, {left: oldLeft, top: oldTop}, {left: dx, top: dy }, container, {width: containerWidth, height: containerHeight});
        }
    });
    $(document).on("mousemove mouseup", function(e){
        e.stopPropagation();
        e.preventDefault();
        if (e.type == "mouseup") {
            isDown = false;
            if (hasMoved && $.isFunction(settings.onEnd)){
                settings.onEnd.call(handler, lastPos, {left: dx, top: dy}, container, {width: containerWidth, height: containerHeight});
            }
        } else if (e.type === "mousemove") {
            if (! isDown) {
                return;
            }
            hasMoved = true;
            var currentLeft = oldLeft + e.pageX - mouseX;
            var currentTop = oldTop + e.pageY - mouseY;
            currentLeft = Math.min(currentLeft, range.left.max);
            currentLeft = Math.min(currentLeft, range.left.min);
            currentTop = Math.min(currentTop, range.top.max);
            currentTop = Math.max(currentTop, range.top.min);

            if(settings.moveX === true && setttings.moveY === false) {
                $handler.css({
                    left: currentLeft
                });
            } else if (settings.moveX === false && settings.moveY === true) {
                $handler.css({
                    top: currentTop
                });
            } else {
                $handler.css({
                    top: currentTop,
                    left: currentLeft
                });
            }
            lastPos = {left: currentLeft, top: currentTop};
            if( $.isFunction(settings.onMove)) {
                settings.onMove.call(handler, {left: oldLeft, top: oldTop}, {left: dx, top: dy }, container, {width: containerWidth, height: containerHeight});
            }
        }
    });
    var getPosition = function(elem, parent) {
        var x = 0, y = 0, stop = null;
        if (parent) {
            stop = parent;
        }
        while (elem !== stop ) {
            x += elem.offsetLeft;
            y += elem.offsetTop;
            elem = elem.offsetParent;
        }
        return {left: x, top: y};
    }
};
/*
S是 saturation饱和度，B是Brightnesss明度，或者是Value
这个函数通过选中的点距离容器边框的距离来确定饱和度和明度，
其中从左到右饱和度0~100，从上到下透明度从100~0
 */
new Draggable({
    contianer: "#color-hs",
    handler: "#color-hs-value",
    moveX: true,
    moveY: true,
    onMove: function(elemPos, dPos, container, containerWH) {
        S  = (100 / containerWH.width) *(elemPos.left + dPos.left);
        $showS.text(S);
        B = 100 - (100/containerWH.height) * (elemPos.top + dPos.top);
        $showB.text(B);
        var rgb = hsvrgb(H/360, S/100, B/100);
        var rgbStr = "(" + rgb.r  + ", " + rgb.g + ", " + rgb.b + ")";
        $showRGB.text(rgbStr);
        $preview.css("background-color", "rgb" + rgbStr);
        $showHex.text("#" + rgb.r.toString(16) + rgb.g.toString(16) + rgb.b.toString(16));
    }
});

/*
获取色盘的色相Hue
 */
new Draggable({
    container: "#color-1",
    handler: "#color-1-value",
    moveY: true,
    onStart: function(elemPos, dPos, container, containerWH) {
        var Hcolor = getHcolor(elemePos.top + dPos.top, containerWH.height);
        H = 360 - (360 / containerWH.height) * (elemPos.top + dPos.top);
        if (H === 360) {
            H = 0;
        }
        $showH.text(H);
        $slWrap.css("background-color", Hcolor);
    },
    onMove: function(elemPos, dPos, container, containerWH) {
        var Hcolor = getHcolor(elemPos.top + dPos.top, containerWH.height);
        H = 360 - (360 / containerWH.height) * (elemPos.top + dPos.top);
        if(H == 360) {
            H = 0;
        }
        $showH.text(H);
        var rgb = hsv2rgb(H/360, S/100, L/100);
        var rgbStr = "(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
        $showRGB.text(rgbStr);
        $preview.css("background-color", "rgb" + rgbStr);
        $slWrap.css("background-color", Hcolor);
        $showHex.text("#" + rgb.r.toString(16) + rgb.g.toString(16) + rgb.b.toString(16));
    }
});






















