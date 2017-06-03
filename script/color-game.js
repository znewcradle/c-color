/**
 * Created by Xu on 2017/6/1.
 */

var loadGame = function (param) {
    var hsv_or_rgb = param;
    var numberOfSquares = 6;
    var colors = generateRandomColors(numberOfSquares);

    if (hsv_or_rgb === 0) {
        var squares = document.querySelectorAll("div.rgb div.square");
        var resetBtn = document.querySelector("div.rgb button.reset");
        var h1 = document.querySelectorAll("div.rgb h1");
        var h2 = document.querySelector("div.rgb h2");
        var headingContainer = document.querySelector("div.rgb div.headingContainer");
        var easyBtn = document.querySelector("div.rgb button.easyBtn");
        var hardBtn = document.querySelector("div.rgb button.hardBtn");
        var zone = document.querySelector("div.rgb.game.content-zone");
    } else {
        var squares = document.querySelectorAll("div.hsv div.square");
        var resetBtn = document.querySelector("div.hsv button.reset");
        var h1 = document.querySelectorAll("div.hsv h1");
        var h2 = document.querySelector("div.hsv h2");
        var headingContainer = document.querySelector("div.hsv div.headingContainer");
        var easyBtn = document.querySelector("div.hsv button.easyBtn");
        var hardBtn = document.querySelector("div.hsv button.hardBtn");
        var zone = document.querySelector("div.hsv.game.content-zone");
    }

    var pickedColor = pickColor();

    var colorDisplay = document.getElementsByClassName("colorDisplay")[hsv_or_rgb];
    var messageDisplay = document.getElementsByClassName("color-message")[hsv_or_rgb];
    colorDisplay.textContent = colorContent(pickedColor);


    function colorContent(rgbStr) {
        if (rgbStr == "" || rgbStr === undefined) {
            return "";
        }
        if (hsv_or_rgb === 0) {
            return rgbStr;
        }
        var coStr = rgbStr.slice(4, -1);
        var cos = coStr.split(",");
        var color = {};
        color["r"] = parseInt(cos[0]);
        color["g"] = parseInt(cos[1]);
        color["b"] = parseInt(cos[2]);

        var hsv_obj = rgb2hsv(color["r"] / 255, color["g"] / 255, color["b"] / 255);
        return "HSV(" + Math.floor(hsv_obj.h) + "," + Math.floor(hsv_obj.s) + "," + Math.floor(hsv_obj.v) + ")";
    }

//定义各种button的handlers
    var easyHandler = function () {
        //toggle button class
        numberOfSquares = 3;
        hardBtn.classList.remove("selected");
        easyBtn.classList.add("selected");
        //generate 3 random colors
        colors = generateRandomColors(numberOfSquares);
        //select one color for game
        pickedColor = pickColor();
        //display the rgb value
        colorDisplay.textContent = colorContent(pickedColor);
        for (var i = 0; i < squares.length; i++) {
            //if theres is another color
            if (colors[i]) {
                squares[i].style.background = colors[i];
            } else {
                squares[i].style.display = "none";
            }
        }
        headingContainer.style.background = "#8aaad5";
        messageDisplay.textContent = "";
        messageDisplay.style.color = "#d62000";
        zone.style.paddingBottom = "11rem";
    };

    var hardHandler = function () {
        numberOfSquares = 6;
        easyBtn.classList.remove("selected");
        hardBtn.classList.add("selected");
        //generate 3 random colors
        colors = generateRandomColors(numberOfSquares);
        //select one color for game
        pickedColor = pickColor();
        //display the rgb value
        colorDisplay.textContent = colorContent(pickedColor);
        for (var i = 0; i < squares.length; i++) {
            squares[i].style.background = colors[i];
            squares[i].style.display = "block";
        }
        headingContainer.style.background = "#8aaad5";
        messageDisplay.textContent = "";
        messageDisplay.style.color = "#d62000";
        zone.style.paddingBottom = "2rem";
    };

    var resetHandler = function () {
        //generate random colors
        colors = generateRandomColors(numberOfSquares);
        //pick new color
        pickedColor = pickColor();

        //change colorDisplay with rgb value
        colorDisplay.textContent = colorContent(pickedColor);
        //change colors of squares
        for (var i = 0; i < squares.length; i++) {
            squares[i].style.background = colors[i];
        }
        //Reset display color to default;
        //document.querySelector(".highlight").style.background = #8aaad5;
        headingContainer.style.background = "#8aaad5";
        messageDisplay.textContent = "";
        resetBtn.textContent = "New Colors";
        messageDisplay.style.color = "#d62000";
    };
///////////////////////////////
//BUTTON LISTENERS
///////////////////////////////

//East and Hard Mode listeners
    //easyBtn.removeEventListener("click", easyHandler);
    easyBtn.addEventListener("click", easyHandler);

    //hardBtn.removeEventListener("click", hardHandler);
    hardBtn.addEventListener("click", hardHandler);

    //resetBtn.removeEventListener("click", resetHandler);
    resetBtn.addEventListener("click", resetHandler);

///////////////////////////////
//FUNCTION DECLASRAIONS
///////////////////////////////

//MAIN FUNCTION WITH GAME LOGIC
    for (var i = 0; i < squares.length; i++) {
        //add initial colors to squares
        squares[i].style.background = colors[i];
        //add click eventListener to every square
        squares[i].addEventListener("click", function () {
            //Get the color of picked square
            var clickedColor = this.style.background;

            //Compare color with picked color
            if (clickedColor === pickedColor) {
                messageDisplay.textContent = "Correct!!";
                changeColors(pickedColor);

                resetBtn.textContent = "Play again?";
                // headingColor.style.background = pickedColor;
                headingContainer.style.background = pickedColor;
                // Change color of "correct" message
                messageDisplay.style.color = pickedColor;

            } else {
                messageDisplay.textContent = "Incorrect";
                this.style.background = "#ffffff";
            }
        });
    }

//generate random colors function
    function generateRandomColors(num) {
        function randomRGBColor() {
            return Math.floor(Math.random() * 255) + 1;
        }

        function randomHSVColor() {
            var H = Math.random();
            var S = Math.random();
            var V = Math.random();
            var rgb_obj = hsv2rgb(H, S, V);
            var rgb_str = "rgb(" + rgb_obj.r + ", " + rgb_obj.g + ", " + rgb_obj.b + ")";
            return rgb_str;
        }

        var colorArray = [];
        if (hsv_or_rgb === 0) {
            for (var i = 0; i < num; i++) {
                colorArray[i] = "rgb(" + randomRGBColor() + ", " + randomRGBColor() + ", " + randomRGBColor() + ")";
            }
        } else {
            for (var j = 0; j < num; ++j) {
                colorArray[j] = randomHSVColor();
            }
        }
        return colorArray;
    }

//Change the colors of other squares
    function changeColors(color) {
        for (var i = 0; i < squares.length; i++) {
            squares[i].style.background = color;
        }
    }

//Select one random color to be displayed
    function pickColor() {
       // alert("pickColor is invoked");
        var random = Math.floor(Math.random() * colors.length);
        return colors[random];
    }
};