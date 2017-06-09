/**
 * Created by Xu on 2017/5/17.
 * This script is used to deal with color, like RGB and HSB
 */
(function iniColor() {
    //处理颜色部分
    var H = 354, S = 42, V = 58;
    var $showH = $(".color-show-h"), $showS = $(".color-show-s"), $showV = $(".color-show-v");
    var $showHex = $(".color-show-hex"), $slWrap = $("#color-hs");
    var $showR = $(".color-show-r"), $showG = $(".color-show-g"), $showB = $(".color-show-b");
    var $preview = $("#color-preview");
    var $demo = $("div.color-demo");


    /*
     色轮共0-359，从255,0,0 -> 255,255,0 -> 0,255,0 -> 0,255,255 -> 0,0,255 -> 255,0,255->255,0,0
     该函数用来获得色轮任意一度的颜色，色轮就是H，hue色相，取值0-359
     */
    function getHcolor(top, height) {
        var oneHeight = height / 6;                                                        //色轮有个6个阶段的颜色变化
        var d = 0, rgbStr;
        if (top < 1 * oneHeight) {                                                           //以下6个条件语句对应6个颜色变化阶段
            d = (top / oneHeight) * 255;
            rgbStr = "rgb(255, 0, " + Math.round(d) + ")";

        } else if (top >= 1 * oneHeight && top < 2 * oneHeight) {
            d = 255 - ((top - oneHeight) / oneHeight) * 255;
            rgbStr = "rgb( " + Math.round(d) + ", 0, 255)";

        } else if (top >= 2 * oneHeight && top < 3 * oneHeight) {
            d = 255 - ((top - 2 * oneHeight) / oneHeight) * 255;
            rgbStr = "rgb(0, " + Math.round(d) + ", 255)";

        } else if (top >= 3 * oneHeight && top < 4 * oneHeight) {
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
     让滑块滑动，计算HSB的值，定义可以拖动的元素的通用属性和方法
     */
    var Draggable = function (options) {
        var defaults = {
            onStart: "",                      //开始滑动回调
            onMove: "",                    //滑动过程回调
            onEnd: "",                      //滑动结束回调
            moveX: false,                 //仅在X轴滑动
            moveY: false,                  //仅在Y轴滑动
            container: "",                   //父容器
            offsetX: 0,                       //X方向的偏移
            offsetY: 0,                       //Y方向的偏移
            handler: ""                    //滑动的元素
        };
        var settings = $.extend(defaults, options);
        var $container = $(settings.container);
        var container = $container.get(0);
        var hasContainer = $container.length == 1 ? true : false;
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
        //触点left,top范围。保证移动范围是container的宽高范围内
        var dx = Math.floor($handler.width() / 2), dy = Math.floor($handler.height() / 2);
        var range = {
            left: {max: containerWidth - dx, min: -dx},
            top: {max: containerHeight - dy, min: -dy}
        };

        var lastPos, hasMoved = false;

        //鼠标按下时的操作
        $handler.on("mousedown", function (e) {
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
                settings.onStart.call(handler, {left: oldLeft, top: oldTop}, {
                    left: dx,
                    top: dy
                }, container, {width: containerWidth, height: containerHeight});
            }
        });
        $(document).on("mousemove mouseup", function (e) {
            e.stopPropagation();
            e.preventDefault();
            if (e.type == "mouseup") {
                isDown = false;
                if (hasMoved && $.isFunction(settings.onEnd)) {
                    settings.onEnd.call(handler, lastPos, {left: dx, top: dy}, container, {
                        width: containerWidth,
                        height: containerHeight
                    });
                }
            } else if (e.type === "mousemove") {
                if (!isDown) {
                    return;
                }
                hasMoved = true;
                var currentLeft = oldLeft + e.pageX - mouseX;
                var currentTop = oldTop + e.pageY - mouseY;
                currentLeft = Math.min(currentLeft, range.left.max);
                currentLeft = Math.max(currentLeft, range.left.min);
                currentTop = Math.min(currentTop, range.top.max);
                currentTop = Math.max(currentTop, range.top.min);

                if (settings.moveX === true && settings.moveY === false) {
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
                if ($.isFunction(settings.onMove)) {
                    settings.onMove.call(handler, {left: oldLeft, top: currentTop}, {
                        left: dx,
                        top: dy
                    }, container, {width: containerWidth, height: containerHeight});
                }
            }
        });
    };

    var getPosition = function (elem, parent) {
        var x = 0, y = 0, stop = null;
        if (parent) {
            stop = parent;
        }
        while (elem !== stop) {
            x += elem.offsetLeft;
            y += elem.offsetTop;
            elem = elem.offsetParent;
        }
        return {left: x, top: y};
    };

    window.Draggable = Draggable;

    /*
     S是 saturation饱和度，B是Brightnesss明度，或者是Value
     这个函数通过选中的点距离容器边框的距离来确定饱和度和明度，
     其中从左到右饱和度0~100，从上到下透明度从100~0
     */
    new Draggable({
        container: "#color-hs",
        handler: "#color-hs-value",
        moveX: true,
        moveY: true,
        onMove: function (elemPos, dPos, container, containerWH) {
            S = (100 / containerWH.width) * (elemPos.left + dPos.left);
            $showS.text(Math.round(S));
            V = 100 - (100 / containerWH.height) * (elemPos.top + dPos.top);
            $showV.text(Math.round(V));
            var rgb = hsv2rgb(H / 360, S / 100, V / 100);
            var rgbStr = "(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
            $showR.text(rgb.r);
            $showB.text(rgb.b);
            $showG.text(rgb.g);
            $preview.css("background-color", "rgb" + rgbStr);
            $demo.css("background-color", "rgb" + rgbStr);
            $showHex.text(rgb.r.toString(16) + rgb.g.toString(16) + rgb.b.toString(16));

            $("span.hex").text("#" + rgb.r.toString(16) + rgb.g.toString(16) + rgb.b.toString(16));
            $("span.rgb").text(rgb.r + "," + rgb.g + "," + rgb.b);
            $("span.hsv").text(Math.round(H) + "," + Math.round(S) + "%," + Math.round(V) + "%");
        }
    });

    /*
     获取色盘的色相Hue
     */
    new Draggable({
        container: "#color-v",
        handler: "#color-v-value",
        moveY: true,
        onStart: function (elemPos, dPos, container, containerWH) {
            var Hcolor = getHcolor(elemPos.top + dPos.top, containerWH.height);
            H = 360 - (360 / containerWH.height) * (elemPos.top + dPos.top);
            if (H === 360) {
                H = 0;
            }
            $showH.text(Math.round(H));
            $slWrap.css("background-color", Hcolor);
            $("span.hsv").text(Math.round(H) + "," + Math.round(S) + "%," + Math.round(V) + "%");
        },
        onMove: function (elemPos, dPos, container, containerWH) {
            var Hcolor = getHcolor(elemPos.top + dPos.top, containerWH.height);
            H = 360 - (360 / containerWH.height) * (elemPos.top + dPos.top);
            if (H == 360) {
                H = 0;
            }
            $showH.text(Math.round(H));
            var rgb = hsv2rgb(H / 360, S / 100, V / 100);
            var rgbStr = "(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
            $showR.text(rgb.r);
            $showG.text(rgb.g);
            $showB.text(rgb.b);
            $preview.css("background-color", "rgb" + rgbStr);
            $demo.css("background-color", "rgb" + rgbStr);
            $slWrap.css("background-color", Hcolor);
            $showHex.text(rgb.r.toString(16) + rgb.g.toString(16) + rgb.b.toString(16));

            $("span.hex").text("#" + rgb.r.toString(16) + rgb.g.toString(16) + rgb.b.toString(16));
            $("span.rgb").text(rgb.r + "," + rgb.g + "," + rgb.b);
            $("span.hsv").text(Math.round(H) + "," + Math.round(S) + "%," + Math.round(V) + "%");
        }
    });
})();
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
        if (_H == 6) {
            _H = 0;
        }
        var i = Math.floor(_H);
        var v1 = V * ( 1 - S );
        var v2 = V * ( 1 - S * (_H - i ) );
        var v3 = V * ( 1 - S * (1 - (_H - i) ) );

        if (i === 0) {
            R = V;
            G = v3;
            B = v1;
        } else if (i == 1) {
            R = v2;
            G = V;
            B = v1;
        } else if (i == 2) {
            R = v1;
            G = V;
            B = v3;
        } else if (i == 3) {
            R = v1;
            G = v2;
            B = V;
        } else if (i == 4) {
            R = v3;
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
 将RGB转化为HSB(V), R, G, B的值需要在0-1之间
 */
function rgb2hsv(R, G, B) {
    var max = Math.max(R, G, B);
    var min = Math.min(R, G, B);
    var h, s, v;
    //计算h
    if (max === min) {
        h = 0;
    } else if (max === R && G >= B) {
        h = 60 * (G - B) / (max - min);
    } else if (max === R && G < B) {
        h = 60 * (G - B) / (max - min) + 360;
    } else if (max === G) {
        h = 60 * (B - R) / (max - min) + 120;
    } else if (max === B) {
        h = 60 * (R - G) / (max - min) + 240;
    }
    //计算s
    if (max === 0) {
        s = 0;
    } else {
        s = 1 - min / max;
    }
    v = max;
    return {h: h, s: s * 100, v: v * 100};
}

/*
 以下部分用于生成各种推荐色彩,对照表如下：
 complementary 互补色
 triadic 三色系
 tetradic  四色系
 analogous 类似色
 neutral  中性色
 shades   色度
 tints      色彩
 tones     色调
 */
/*
 产生色度，色彩和色调
 */
function generateColors(coStr, type) {
    var colors = [];
    if(coStr == "") {
        return null;
    }
    var coStr = coStr.slice(4, -1);
    var cos = coStr.split(",");
    var color = {};
    color["r"] = parseInt(cos[0]);
    color["g"] = parseInt(cos[1]);
    color["b"] = parseInt(cos[2]);

    var hsv_color = rgb2hsv(color.r / 255, color.g / 255, color.b / 255);

    if(type === "shades" || type === "tints" || type === "tones") {
        colors = generateMixColor(color, type, 6);
    } else {
        colors = generateAngleColor(hsv_color, type);
    }
    return colors;
}
function generateMixColor(color, type, amount) {
    var standard = 0;
    var vary = 5;
    var colors = [];
    var standardList = {};
    var index = ['r', 'g', 'b'];
    var ratio = [1, color.g / color.r, color.b / color.r];

    if (type === "shades") {
        standard = 10;
    } else if (type === "tints") {
        standard = 228;
    } else if (type === "tones") {
        standard = 127;
    } else {
        return null;
    }
    if (amount <= 0) {
        return null;
    }


    for (var i in index) {
        var c = index[i];
        standardList[c] = Math.round(standard + 2 * Math.random() * vary - vary);
        standardList[c] = Math.round(( standardList[c] - color[c] ) / amount);
    }

    for (var k = 0; k < amount; ++k) {
        var co = {};
        for (var j in index) {
            j = index[j];
            co[j] = standardList[j] * k + color[j];
        }
        colors.push(co);
    }
    return colors;
}

function generateMixColor2(color, type, amount) {
    var varyH = 0;
    var varyS = Math.round((color.s - Math.round(10 * Math.random())) / amount);
    var varyV = Math.round(( Math.round(10 * Math.random()) + 90 - color.v) / amount);
    var colors = [];

    for (var i = 0; i < amount; ++i) {
        var co = hsv2rgb(color.h / 360, (color.s + varyS * i) / 100, (color.v + varyV * i) / 100);
        colors.push(co);
    }
    return colors;
}
/*
 根据选择的要求，生成色环上的角度数组
 该处参数color必须以hsv的格式给出，并且是对象
 */
function generateAngleColor(color, type) {
    var anglearr = [];
    if (type === 'complementary') {
        anglearr = [0, 180];
    } else if (type === 'triadic') {
        anglearr = [0, 120, 240];
    } else if (type === 'tetradic') {
        anglearr = [0, 90, 180, 270];
    } else if (type === 'analogous') {
        anglearr = [0, 30, 60, 120, 150, 180];
    } else if (type === 'neutral') {
        anglearr = [0, 15, 30, 45, 60, 75];
    } else {
        console.log("type error");
        return null;
    }
    return generateColorArr(color, anglearr);
}
/*
 根据角度数组和给定的颜色生成颜色数组
 */
function generateColorArr(color, anglearr) {
    var colors = [];
    for (var i = 0; i < anglearr.length; ++i) {
        var H = color.h + anglearr[i];

        if (H > 360) {
            H -= 360;
        }

        colors.push(hsv2rgb(H / 360, color.s / 100, color.v / 100));
    }
    return colors;
}

/**
 * 测试用的函数
 */
function test() {
    var colors = generateAngleColor({h: 124, s: 82, v: 26}, 'tetradic');
    for (var i = 0; i < colors.length; ++i) {
        var $div = $("<div></div>");
        $div.css("width", "50px");
        $div.css("height", "50px");
        $div.css("float", "left");
        $div.css("margin-left", "20px");

        var rgbStr = "rgb( " + colors[i].r + ", " + colors[i].g + " , " + colors[i].b + ")";
        $div.css("background-color", rgbStr);
        $("div#wrap").append($div);
    }
}
function testMix() {
    var colors = generateMixColor({r: 74, g: 35, b: 77}, 'tints', 8);
    for (var i = 0; i < colors.length; ++i) {
        var $div = $("<div></div>");
        $div.css("width", "50px");
        $div.css("height", "50px");
        $div.css("float", "left");
        $div.css("margin-left", "20px");

        var rgbStr = "rgb( " + colors[i].r + ", " + colors[i].g + " , " + colors[i].b + ")";
        $div.css("background-color", rgbStr);
        $("div#wrap").append($div);
    }
}


































