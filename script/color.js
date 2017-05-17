/**
 * Created by Xu on 2017/5/17.
 * This script is used to deal with color, like RGB and HSB
 */
/*
色轮共0-359，从255,0,0 -> 255,255,0 -> 0,255,0 -> 0,255,255 -> 0,0,255 -> 255,0,255->255,0,0
该函数用来获得色轮任意一度的颜色，色轮就是H，hue色相，取值0-359
 */
function getHcolor(top, height){
    var oneHeight = height / 6;
    var d = 0, rgbStr;
    if (top < 1 * oneHeight) {
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
S是 saturation饱和度，B是Brightnesss明度，或者是Value
这个函数通过选中的点距离容器边框的距离来确定饱和度和明度，
其中从左到右饱和度0~100，从上到下透明度从100~0
 */

/*
将HSB(V)转换为RGB，0 <= H < 1, 0 <= S, V <= 1，算法来自https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4,维基百科的解释
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
};























