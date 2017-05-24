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
        var colors = ['red', 'pink', '#f7f7f7', 'purple', 'darkviolet', 'indigo', 'blue', 'lightblue', 'cyan', 'teal', 'green', 'lightgreen', 'lime', 'yellow', 'amber', 'orange', 'orangered', 'brown', 'grey', 'cadetblue'];
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
    var svg_times = 1;
    var c_colors =[];
    var clickColor = function($inner) {
        if (svg_times < 2) {
             ++svg_times;
            $inner.addClass("svg-click");
            var coStr = $inner.css("background-color");
            var coStr = coStr.slice(4, -1);
            var cos = coStr.split(",");
            var color = {};
            color["r"] = parseInt(cos[0]);
            color["g"] = parseInt(cos[1]);
            color["b"] = parseInt(cos[2]);
            c_colors.push(color);
        } else{
            reColor();
        }
    };
    var reColor = function() {
        // $("div.re-sidebar").show();
        $("div.re-sidebar").css("width", "50%");
        $("div.cblock div.inner-cblock svg").css("left", "60%");
        $("div.app-demo div.app-toolbar div.app-toolbar-heading").css("width", "100%").show();
        $("div.color-blocks").css("width", "50%");
    };
});






















