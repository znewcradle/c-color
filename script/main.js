/**
 * Created by Xu on 2017/5/19.
 */
$(function(){
    //整体的动态呈现效果
    $("nav#nav").addClass("animated fadeInDown");
    $("div#main").addClass("animated fadeInUp");
    //锁定颜色和解锁颜色的功能
    $("div.color-bar span.islock").click(function(){
        $(this).toggleClass("color-lock").toggleClass("color-unlock");
    });
    //选定颜色
    var selectColor = function($cur) {
        var coStr = $cur.css("background-color");
        var is_changed = false;
        $("div.color-item div.color-demo-item").each(function(){
            if($(this).next().hasClass("color-unlock") && is_changed === false) {
                $(this).css("background-color", coStr);
                is_changed = true;
            }
        })
    };

    $(".color-label").click(function(){
        selectColor($(this));
    });
    $("div.color-dropdown-content ul li").click(function(){
        var coStr = $("#color-preview").css("background-color");
        console.log(coStr);
        var colors = generateColors(coStr, $(this).attr("id"));
        var $tabs = $("div.re-colors");
        $tabs.empty();
        $("span.option-title").text($(this).text());
        if (colors !== null) {
            for(var i = 0; i < colors.length; ++ i) {
                var R = colors[i].r, G = colors[i].g, B = colors[i].b;
                var r = R.toString(16), g = G.toString(16), b = B.toString(16);
                var rgbStr = "rgb(" + R + "," +G + "," + B + ")";
                var $tab = $("<div class='color-tabs'></div>");
                var $label = $("<div class='co-tab color-label'></div>");
                $label.css("background-color", rgbStr);
                var $hex = $("<div class='co-tabs-hex'></div>");
                $hex.text("#" + r + g + b);
                var $rgb = $("<div class='co-tabs-rgb'></div>");
                $rgb.text(R + ", " + G + ", " + B);
                var $data = $("<div></div>");
                //注册事件
                $label.click(function(){
                    selectColor($(this));
                });
                //组装组件
                $data.append($hex);
                $data.append($rgb);
                $tab.append($label);
                $tab.append($data);
                $tabs.append($tab);
            }
        }
    });
    /**
     * 固定header
     */
    var is_fixed = false;
    $(document).scroll(function(){
        var top =  parseInt($("div.main").css("top"));
        var $header = $("div.color-header");
        if($(document).scrollTop() > top && is_fixed === false) {
            $header.addClass("fixed-header");
            is_fixed = true;
        } else if($(document).scrollTop() <= top && is_fixed === true){
            $header.removeClass("fixed-header");
            is_fixed = false;
        }
    });
    /**
     * 为recommend-color.html添加色块
     */
    function addCBlocks() {
        var labels = ['RED', 'PINK', 'PICK TWO COLORS', 'PURPLE', 'DEEP PURPLE', 'INDIGO', 'BLUE', 'LIGHT BLUE', 'CYAN', 'TEAL', 'GREEN', 'LIGHT GREEN', 'LIME', 'YELLOW', 'AMBER', 'ORANGE', 'DEEP ORANGE', 'BROWN', 'GREY', 'BLUE GREY'];
        var colors = ['#f34336', '#e91e63', '#f7f7f7', '#deb7e5', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#7a5548', '#9e9e9e', '#607d8b'];
        var $blocks = $("div.color-blocks");

        for(var i = 0; i < labels.length; ++ i) {
            var $cblock = $("<div class='cblock'></div>");
            if (i != 2) {
                var $svg = $(' <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" style="&#10;&#10;"><path d="M18 32.34L9.66 24l-2.83 2.83L18 38l24-24-2.83-2.83z"/></svg>');
                var $inner = $("<div class='inner-cblock'></div>");
                $inner.append("<label>" + labels[i] + "</label>");

                $inner.append($svg);
                $inner.css("background-color", colors[i]);
                $cblock.append($inner);

                $inner.click(function(){
                    clickColor($(this));
                });
            } else {
                $cblock.append("<label>" + labels[i] + "</label>");
                $cblock.addClass("explaination");
            }
            $blocks.append($cblock);
        }
    }
    addCBlocks();
    /**
     * 选择配色，搭配配色功能
     */
    var svg_times = false;
    var c_colors =[];
    /**
     * 处理点击事件
     * @param $inner
     */
    var addInnerClick = function($inner) {
        $inner.addClass("svg-click");
            var coStr = $inner.css("background-color");
            coStr = coStr.slice(4, -1);
            var cos = coStr.split(",");
            var color = {};
            color["r"] = parseInt(cos[0]);
            color["g"] = parseInt(cos[1]);
            color["b"] = parseInt(cos[2]);
            c_colors.push(color);
    };
    var clickColor = function($inner) {
        if (c_colors.length < 2) {
            addInnerClick($inner);
            if (c_colors.length === 2 && svg_times === false) {
                svg_times = true;
                showDemo();
            } else if(c_colors.length === 2 && svg_times === true) {
                reMainColor(c_colors[1]);
            }
        } else {
            c_colors = [];
            $("div.color-blocks div.cblock div.inner-cblock").each(function(){
                if($(this).hasClass("svg-click")) {
                    $(this).removeClass("svg-click");
                }
            });
            addInnerClick($inner);
              if(c_colors.length == 1 && svg_times === true) {
                reSubColor(c_colors[0]);
            }
        }
    };
    /**
     * 展示app的demo
     */
    var showDemo = function() {
        $("div.re-sidebar").css("width", "50%");
        $("div.cblock div.inner-cblock svg").css("left", "60%");
        $("div.app-demo div.app-toolbar div.app-toolbar-heading").css("width", "100%").show();
        $("div.app-button").show();
        $("div.app-content ul.app-list").show();
        $("div.re-color-zone div.re-color-toolbar").show();
        $("div.color-blocks").css("width", "50%");

        reMainColor(c_colors[0]);
        reSubColor(c_colors[1]);
    };
    /**
     * 推荐颜色：主色和副色
     * 副色，#212121（主文本色）, #757575（次文本色）, #BDBDBD（分界线颜色）
     * 深主色（状态栏色），主色（背景），浅主色（），text/icons（上半部分字的颜色）
     */
    var reMainColor = function(main_color) {
        var darks = generateMixColor(main_color, "shades", 6);
        var lights = generateMixColor(main_color, "tints", 6);

        darks = darks[2];
        lights = lights[2];
        var main_text, main_text_rgb = {};

        var hsv = rgb2hsv(main_color.r / 255, main_color.g / 255, main_color.b / 255);
        if(hsv.s > 75 && hsv.v > 75) {
            main_text = "#FFFFFF";
            main_text_rgb["r"] = main_text_rgb["g"] = main_text_rgb["b"] = 255;
        } else {
            main_text = "#212121";
            main_text_rgb["r"] = main_text_rgb["g"] = main_text_rgb["b"] = 33;
        }
        $("div.app-demo div.app-header div.app-status").css("background-color", "rgb(" + darks.r + "," + darks.g + "," + darks.b + ")");
        $("div.app-demo div.app-header div.app-toolbar").css("background-color", "rgb(" + main_color.r + "," + main_color.g + "," + main_color.b + ")")
                                                                                        .css("color", main_text);

        generateReCBlocks(darks, 1);
        generateReCBlocks(main_color, 2);
        generateReCBlocks(lights, 3);
        generateReCBlocks(main_text_rgb, 4);
    };
    var reSubColor = function(sub_color) {
        $("ul.app-list li:nth-child(1)").css("border-color", "#BDBDBD");
        $("div.app-button").css("background-color", "rgb(" + sub_color.r + "," + sub_color.g + "," + sub_color.b + ")");
        $("div.app-content ul.app-list li p.primary-text").css("color", "#212121");
        $("div.app-content ul.app-list li p.secondary-text").css("color", "#757575");

        generateReCBlocks(sub_color, 5);
    };
    /**
     * 针对re-color-zone
     */
    $("div.re-color-toolbar svg.hide-toolbar").click(clickHide);

    var is_click = false;
    function clickHide() {
        if (is_click === false) {
            $(this).css("transform", "rotate(360deg)").css("-webkit-transform", "rotate(360deg)");
            $("span.hide-toolbar").text("hide");
            $("div.re-color-list").show();
            $("div.re-color-zone").css("height", "32%");
            is_click = true;
        } else {
            $(this).css("transform", "rotate(180deg)").css("-webkit-transform", "rotate(180deg)");
            $("span.hide-toolbar").text("show");
            $("div.re-color-list").hide();
            $("div.re-color-zone").css("height", "12%");
            is_click = false;
        }
    }

    /**
     * 生成推荐色块
     */
    function generateReCBlocks(color, position) {
        if(color == null && position === -1) {
            var sub_colors = ["#374046", "#212121", "#757575", "#BDBDBD"];
            var tips = ['DARK PRIMARY COLOR', 'PRIMARY COLOR', 'LIGHT PRIMARY COLOR', 'TEXT/ICONS', 'ACCENT COLOR', 'PRIMARY TEXT', 'SECONDARY TEXT', 'DIVIDER COLOR'];
            var $parent = $("div.re-color-zone div.re-color-list");
            for(var i = 0; i < 8; ++ i) {
                var $div = $("<div class='re-cblock'></div>");
                $div.append("<label class='color-tip'>"+ tips[i] +"</label>");
                if(i < 4) {
                    $div.css("background-color", "#374046");
                } else {
                    $div.css("background-color", sub_colors[i - 4]);
                }
                $parent.append($div);
            }
        } else {
            $("div.re-color-zone div.re-cblock:nth-child(" + position +")").css("background-color", "rgb(" + color.r + "," + color.g + "," + color.b + ")");
        }
    }
    generateReCBlocks(null, -1);

});






















