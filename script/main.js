/**
 * Created by Xu on 2017/5/19.
 */
$(function () {
    //检测是否登陆
    if (localStorage.getItem("userid")) {
        $("div.header-user-entrance").hide();
        $("div.header-user-entrance.after-login").show().prop('hidden', false);
    }
    //整体的动态呈现效果
    $("nav#nav").addClass("animated fadeInDown");
    $("div#main").addClass("animated fadeInUp");
    //锁定颜色和解锁颜色的功能
    $("div.color-bar span.islock").click(function () {
        $(this).toggleClass("color-lock").toggleClass("color-unlock");
    });
    //选定颜色
    var selectColor = function ($cur) {
        var coStr = $cur.css("background-color");
        var is_changed = false;
        var index = -1;

        $("div.color-item div.color-demo-item").each(function () {
            ++index;
            if ($(this).next().hasClass("color-unlock") && is_changed === false) {
                $(this).css("background-color", coStr);
                is_changed = true;
                return false;
            }
        });

        if (is_changed == true) {
            index = index % 6;
            console.log(index);
            $("div#color-download-bar div.color-item div.color-demo-item").each(function (ind) {
                if (ind === index) {
                    $(this).css("background-color", coStr);
                }
            });
        }
    };

    $(".color-label").click(function () {
        selectColor($(this));
    });
    $("div.color-dropdown-content ul li").click(function () {
        var coStr = $("#color-preview").css("background-color");
        console.log(coStr);
        var colors = generateColors(coStr, $(this).attr("id"));
        var $tabs = $("div.re-colors");
        $tabs.empty();
        $("span.option-title").text($(this).text());
        if (colors !== null) {
            for (var i = 0; i < colors.length; ++i) {
                var R = colors[i].r, G = colors[i].g, B = colors[i].b;
                var r = R.toString(16), g = G.toString(16), b = B.toString(16);
                var rgbStr = "rgb(" + R + "," + G + "," + B + ")";
                var $tab = $("<div class='color-tabs'></div>");
                var $label = $("<div class='co-tab color-label'></div>");
                $label.css("background-color", rgbStr);
                var $hex = $("<div class='co-tabs-hex'></div>");
                $hex.text("#" + r + g + b);
                var $rgb = $("<div class='co-tabs-rgb'></div>");
                $rgb.text(R + ", " + G + ", " + B);
                var $data = $("<div></div>");
                //注册事件
                $label.click(function () {
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
    $(document).scroll(function () {
        var top = parseInt($("div.main").css("top"));
        var $header = $("div.color-header");
        if ($(document).scrollTop() > top && is_fixed === false) {
            $header.addClass("fixed-header");
            is_fixed = true;
        } else if ($(document).scrollTop() <= top && is_fixed === true) {
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

        for (var i = 0; i < labels.length; ++i) {
            var $cblock = $("<div class='cblock'></div>");
            if (i != 2) {
                var $svg = $(' <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" style="&#10;&#10;"><path d="M18 32.34L9.66 24l-2.83 2.83L18 38l24-24-2.83-2.83z"/></svg>');
                var $inner = $("<div class='inner-cblock'></div>");
                $inner.append("<label>" + labels[i] + "</label>");

                $inner.append($svg);
                $inner.css("background-color", colors[i]);
                $cblock.append($inner);

                $inner.click(function () {
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
    var c_colors = [];

    /**
     * 处理点击事件
     * @param $inner
     */
    function splitColor(coStr) {
        var color = {};
        coStr = coStr.slice(4, -1);
        var cos = coStr.split(",");
        color["r"] = parseInt(cos[0]);
        color["g"] = parseInt(cos[1]);
        color["b"] = parseInt(cos[2]);
        return color;
    }

    var addInnerClick = function ($inner) {
        $inner.addClass("svg-click");
        var coStr = $inner.css("background-color");
        c_colors.push(splitColor(coStr));
    };
    var clickColor = function ($inner) {
        if (c_colors.length < 2) {
            addInnerClick($inner);
            if (c_colors.length === 2 && svg_times === false) {
                svg_times = true;
                showDemo();
            } else if (c_colors.length === 2 && svg_times === true) {
                reMainColor(c_colors[1]);
            }
        } else {
            c_colors = [];
            $("div.color-blocks div.cblock div.inner-cblock").each(function () {
                if ($(this).hasClass("svg-click")) {
                    $(this).removeClass("svg-click");
                }
            });
            addInnerClick($inner);
            if (c_colors.length == 1 && svg_times === true) {
                reSubColor(c_colors[0]);
            }
        }
    };
    /**
     * 展示app的demo
     */
    var showDemo = function () {
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
    var reMainColor = function (main_color) {
        var darks = generateMixColor(main_color, "shades", 6);
        var lights = generateMixColor(main_color, "tints", 6);

        darks = darks[2];
        lights = lights[2];
        var main_text, main_text_rgb = {};

        var hsv = rgb2hsv(main_color.r / 255, main_color.g / 255, main_color.b / 255);
        if (hsv.s > 75 && hsv.v > 75) {
            main_text = "#FFFFFF";
            // $("div.re-cblock label").css("color", "#414141");
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
    var reSubColor = function (sub_color) {
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
        if (color == null && position === -1) {
            var sub_colors = ["#374046", "#212121", "#757575", "#BDBDBD"];
            var tips = ['DARK PRIMARY COLOR', 'PRIMARY COLOR', 'LIGHT PRIMARY COLOR', 'TEXT AND ICONS', 'ACCENT COLOR', 'PRIMARY TEXT', 'SECONDARY TEXT', 'DIVIDER COLOR'];
            var $parent = $("div.re-color-zone div.re-color-list");
            for (var i = 0; i < 8; ++i) {
                var $div = $("<div class='re-cblock'></div>");
                $div.append("<label class='color-tip'>" + tips[i] + "</label>");
                if (i < 4) {
                    $div.css("background-color", "#374046");
                } else {
                    $div.css("background-color", sub_colors[i - 4]);
                }
                $parent.append($div);
            }
        } else {
            var $block = $("div.re-color-zone div.re-cblock:nth-child(" + position + ")");
            $block.css("background-color", "rgb(" + color.r + "," + color.g + "," + color.b + ")");
            if (position === 4) {
                if (color.r > 33) {
                    $block.find("label").css("color", "#414141");
                } else {
                    $block.find("label").css("color", "white");
                }
            }
        }
    }

    generateReCBlocks(null, -1);

    /**
     * 针对了解颜色的页面
     */
    $(document).scroll(function () {
        var $tips = $("div.content-tips");
        $tips.addClass("fixed-tips");
        if ($(document).scrollTop() === 0) {
            $tips.removeClass("fixed-tips");
        }
    });


    $("div.content-tips li").each(function (index) {
        $(this).attr("pos", index + 1);
        $(this).click(function () {
            var $sec_content = $("div.content-zone section.content:nth-child(" + $(this).attr("pos") + ")");
            if ($sec_content) {
                var top = $sec_content[0].offsetTop;
                $("html, body").animate({scrollTop: top + 200}, 1000);
            }
        });
    });

    $("h3.know-rgb").click(function () {
        $("div.introduction-zone").hide();
        $("div.hsv.game").hide();
        $("div.rgb.game").show();
        loadGame(0);
        return false;
    });
    $("h3.know-hsv").click(function () {
        $("div.introduction-zone").hide();
        $("div.rgb.game").hide();
        $("div.hsv.game").show();
        loadGame(1);
        return false;
    });
    $("div.text-introduction").click(function () {
        $("div.rgb.game").hide();
        $("div.hsv.game").hide();
        $("div.introduction-zone").show();
        return false;
    });


    /********************下载模态框 **********************/
    $("div.color-download").click(function () {
        var color_arr = [];
        var color_str_arr = [];

        var hex_list = $("div.download-data-item.download-hex ul");
        var rgb_list = $("div.download-data-item.download-rgb ul");
        var html_list = $("div.download-data-item.download-html ul");

        hex_list.empty();
        rgb_list.empty();
        html_list.empty();

        $("div.color-bar.fixed div.color-item div.color-demo-item").each(function () {
            var coStr = $(this).css("background-color");
            color_str_arr.push(coStr);
            color_arr.push(splitColor(coStr));
        });
        for (var i = 0; i < color_arr.length; ++i) {
            var hex = "#" + color_arr[i].r.toString(16) + color_arr[i].g.toString(16) + color_arr[i].b.toString(16);
            hex_list.append("<li>" + hex + "</li>");
            rgb_list.append("<li>" + color_str_arr[i] + "</li>");
            html_list.append("<li>color: " + color_str_arr[i] + "</li>");
        }
    });
    var saveFile = function (data, filename) {
        var save_link = document.createElement('a');
        save_link.href = data;
        save_link.download = filename;

        save_link.click();
    };
    $("div#modal-select-download").click(function () {
        html2canvas(document.getElementById("body-select-download"), {

            onrendered: function (canvas) {
                var type = 'png';
                var imgData = canvas.toDataURL(type);

                var _fixType = function (type) {
                    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
                    var r = type.match(/png|jpeg|bmp|gif/)[0];
                    return 'image/' + r;
                };
                imgData = imgData.replace(_fixType(type), 'image/octet-stream');

                var filename = "color_bar" + "." + type;
                saveFile(imgData, filename);
            }
        });
    });
    /***********************导出模态框 **************************/
    $("div.export").click(function () {
        var color_arr = [];
        var color_str_arr = [];
        var $color_bar = $("div#recommend-bar");
        $color_bar.empty();

        var hex_list = $("div.download-data-item.download-hex ul");
        var rgb_list = $("div.download-data-item.download-rgb ul");
        var html_list = $("div.download-data-item.download-html ul");

        hex_list.empty();
        rgb_list.empty();
        html_list.empty();

        $("div.co-tab.color-label").each(function () {
            var coStr = $(this).css("background-color");
            color_str_arr.push(coStr);
            color_arr.push(splitColor(coStr));
        });

        for (var i = 0; i < color_arr.length; ++i) {
            var hex = "#" + color_arr[i].r.toString(16) + color_arr[i].g.toString(16) + color_arr[i].b.toString(16);
            hex_list.append("<li>" + hex + "</li>");
            rgb_list.append("<li>" + color_str_arr[i] + "</li>");
            html_list.append("<li>color: " + color_str_arr[i] + "</li>");

            var $item = $("<div class='color-item'></div>");
            var $demo = $("<div class='color-demo-item'></div>");

            $demo.css("background-color", color_str_arr[i]);
            if (i === 0) {
                $demo.addClass("first-item");
            } else if (i === color_arr.length - 1) {
                $demo.addClass("last-item");
            }
            $item.append($demo);
            $color_bar.append($item);
        }
    });
    $("div#modal-recommend-download").click(function () {
        html2canvas(document.getElementById("body-recommend-download"), {
            onrendered: function (canvas) {
                var type = 'png';
                var imgData = canvas.toDataURL(type);

                var _fixType = function (type) {
                    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
                    var r = type.match(/png|jpeg|bmp|gif/)[0];
                    return 'image/' + r;
                };
                imgData = imgData.replace(_fixType(type), 'image/octet-stream');

                var filename = "recommend_bar" + "." + type;
                saveFile(imgData, filename);
            }
        });
    });
    /*******************************推荐色导出 **********************/
    function addCBlockLabel() {
        $("div#re-color-list div.re-cblock label.hex-label").remove();

        //准备色彩块的HEX label
        $("div#re-color-list div.re-cblock").each(function () {
            var coStr = $(this).css("background-color");
            var color = splitColor(coStr);
            var hex = "#" + color.r.toString(16) + color.g.toString(16) + color.b.toString(16);
            $(this).append("<label class='hex-label'>" + hex + "</label>");
        });
    }

    function downloadAutoRecommend() {
        addCBlockLabel();
        html2canvas(document.getElementById("re-color-list"), {
            onrendered: function (canvas) {
                var type = 'png';
                var imgData = canvas.toDataURL(type);

                var _fixType = function (type) {
                    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
                    var r = type.match(/png|jpeg|bmp|gif/)[0];
                    return 'image/' + r;
                };
                imgData = imgData.replace(_fixType(type), 'image/octet-stream');

                var filename = "recommend_color" + "." + type;
                saveFile(imgData, filename);
            }
        });
    }

    $(".download-toolbar").click(function () {
        downloadAutoRecommend();
    });
    /*********************
     * 上传图片，拖放效果
     *******************/
    var imgContainer = document.getElementById("imgContainer");
    var result_uri;
    var color_list;

    if (imgContainer) {
        //若允许被放置元素，必须阻止其默认的处理方式
        imgContainer.ondragover = function (e) {
            e.preventDefault();
        };
        //监听拖拽的事件：设置 允许拖拽
        imgContainer.ondrop = function (e) {
            e.preventDefault();
            //创建file对象
            var f = e.dataTransfer.files[0];
            //创建fileReader 来读取信息
            var fileReader = new FileReader();
            //通过fileReader 来读取数据
            fileReader.readAsDataURL(f);
            //通过fileReaderl 来监听它的的事件
            fileReader.onload = function (e) {
                result_uri = fileReader.result;
                //在盒子中写入一个img标签，并将其读到的资源赋给src实现预览
                imgContainer.innerHTML = "<img src='" + result_uri + "' width='300px' height='300px'  id='upload_img'/>";
            }
        };
    }
    $("div#recognize_btn").click(function () {
        var formData = document.querySelector("#upload_img");
        var excluded = ['rgb(255, 255, 255)', 'rgb(0,0,0)', 'rgb(0,1,0)', 'rgb(1,0,0)', 'rgb(0,0,1)'];
        for (var i = 1; i < 10; ++i) {
            var rgb1 = 'rgb(' + (255 - i) + ',' + 255 + ',' + 255 + ')';
            var rgb2 = 'rgb(' + 255 + ',' + (255 - i) + ',' + 255 + ')';
            var rgb3 = 'rgb(' + 255 + ',' + 255 + ',' + (255 - i) + ')';
            var rgb4 = 'rgb(' + (255 - i) + ',' + (255 - i) + ',' + (255 - i) + ')';

            excluded.push(rgb1);
            excluded.push(rgb2);
            excluded.push(rgb3);
            excluded.push(rgb4);
        }
        if (formData) {
            RGBaster.colors(formData, {
                paletteSize: 6,
                exclude: excluded,
                success: function (payload) {
                    var li_arr = document.querySelectorAll("div.recognize-color ul li");
                    color_list = payload.palette;
                    for (var i = 0; i < payload.palette.length; ++i) {
                        li_arr[i].style.backgroundColor = payload.palette[i];
                    }
                }
            });
        }
        $(this).hide();
        $("#upload_btn").show();
    });
    //上传
    $("#upload_btn").click(function(){
        var colors = JSON.stringify(color_list);
        $.ajax({
            'url': 'http://localhost:3000/upload',
            'method': 'POST',
            'data': {
                'creatorid': 1,
                'uri': result_uri,
                'colors': colors
            },
            'success': function(data){
                $("#upload_btn").hide();
                $("#recognize_btn").show();
                $("#uploadModal").modal('hide');
                location.reload();
            }
        });
    });
    //注销
    $("span.glyphicon.glyphicon-log-out.log-out").click(function () {
        localStorage.removeItem("userid");
        location.reload();
    });
});

function login(name, pass) {
    $.ajax({
        'url': 'http://localhost:3000/login',
        'method': 'POST',
        'data': {
            username: name,
            password: pass
        },
        'success': function (data) {
            localStorage.setItem("userid", data.userid);
            console.log(data.userid);
            $("#loginModal").modal('hide');
            $("div.header-user-entrance").hide();
            $("div.header-user-entrance.after-login").show().prop('hidden', false);
        }
    });
}





















