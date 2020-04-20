var $canvas = {
    element: null,
    width: null,
    height: null,
    clear: function () { $ctx.clearRect(0, 0, this.width, this.height); }
};
var $ctx = null;

var $gameIntervalID = null;

var $grid = {
    maxRow: 30,
    maxCol: 50,
    unitSize: 10,
    unitGap: 1,
    drawSquare: function (row, col, style, type) {
        type = type ? type : 'stroke';
        var position = {
            top: (row - 1) * this.unitSize + row * this.unitGap,
            left: (col - 1) * this.unitSize + col * this.unitGap,
            bottom: row * (this.unitSize + this.unitGap),
            right: col * (this.unitSize + this.unitGap)
        }
        if (type === 'stroke') {
            $ctx.strokeStyle = style ? style : '#ddd';
        } else if (type === 'fill') {
            $ctx.fillStyle = style ? style : '#ddd';
        }
        $ctx.beginPath();
        $ctx.moveTo(position.left, position.top);
        $ctx.lineTo(position.right, position.top);
        $ctx.lineTo(position.right, position.bottom);
        $ctx.lineTo(position.left, position.bottom);
        $ctx.closePath();
        if (type === 'stroke') {
            $ctx.stroke();
        } else if (type === 'fill') {
            $ctx.fill();
        }
    }
};

var $snake = {
    head: { row: NaN, col: NaN },
    body: [],
    bodyPart: [],
    direction: null,
    draw: function () {
        var currentRow = this.head.row, currentCol = this.head.col;
        var currentOpacity = 1, minimumOpacity = 0.4;
        var whiteColor = function (opacity) { return 'rgba(255, 255, 255, ' + opacity + ')'; };
        $grid.drawSquare(currentRow, currentCol, 'white', 'fill');

        for (var i = 0; i < this.body.length; i++) {
            currentOpacity = (this.body.length - i) / this.body.length;
            currentOpacity = currentOpacity > minimumOpacity ? currentOpacity : minimumOpacity;
            switch (this.body[i]) {
                case 'l': currentCol -= 1; break;
                case 'r': currentCol += 1; break;
                case 't': currentRow -= 1; break;
                case 'b': currentRow += 1; break;
            }
            $grid.drawSquare(currentRow, currentCol, whiteColor(currentOpacity), 'fill');
        }
    },
    next: function () {
        if (hitBoundary() && hitItself()) {
            switch (this.direction) {
                case 'left': this.head.col -= 1; this.body.unshift('r'); break;
                case 'right': this.head.col += 1; this.body.unshift('l'); break;
                case 'up': this.head.row -= 1; this.body.unshift('b'); break;
                case 'down': this.head.row += 1; this.body.unshift('t'); break;
            }
            this.body.pop();
            this.updateBodyPartDistribution();
        }
        else {
            gameover();
        }
    },
    updateBodyPartDistribution: function () {
        $snake.bodyPart = [];
        for (var row = 1; row <= $grid.maxRow; row++) {
            $snake.bodyPart.push([]);
            for (var col = 1; col <= $grid.maxCol; col++) {
                $snake.bodyPart[row - 1].push(0);
            }
        }

        var currentRow = $snake.head.row, currentCol = $snake.head.col;
        $snake.bodyPart[currentRow - 1][currentCol - 1] = 1;

        for (var bodyPartDirection of $snake.body) {
            switch (bodyPartDirection) {
                case 'l': currentCol -= 1; break;
                case 'r': currentCol += 1; break;
                case 't': currentRow -= 1; break;
                case 'b': currentRow += 1; break;
            }
            $snake.bodyPart[currentRow - 1][currentCol - 1] = 1;
        }
    },
    eatapple: function () {
        if ($snake.head.row === $apple.coor.row && $snake.head.col === $apple.coor.col) {
            $apple.drawApple();
            var new_ele = $snake.body[$snake.body.length - 1];
            $snake.body.push(new_ele);
            $score++;
        }
    }
};

var $apple = {
    coor: { row: NaN, col: NaN },
    drawApple: function () {
        var appRow = Math.floor(Math.random() * ($grid.maxRow + 1));
        var appCol = Math.floor(Math.random() * ($grid.maxCol + 1));
        $apple.coor.row = appRow;
        $apple.coor.col = appCol;
        $grid.drawSquare($apple.coor.row, $apple.coor.col, 'red', 'fill');
    }
}

var $score = 0;

//check the device using
function isMobileTablet() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

//adjust the grid size according to the device
if (!isMobileTablet()) {
    $grid.unitSize = 20;
    $grid.unitGap = 5;
} else {
    $grid.unitSize = 10;
    $grid.unitGap = 1;
}

/* Main Function */
$(document).ready(function () {
    init();
    initSnake();
    initapple();
    if ($canvas.element.getContext) {
        $ctx = $canvas.element.getContext('2d');
        drawGrid();
        $snake.draw();

        var setGameInterval = function () {
            $gameIntervalID = setInterval(function () {
                $canvas.clear();
                drawGrid();
                $snake.draw();
                $grid.drawSquare($apple.coor.row, $apple.coor.col, 'red', 'fill');
                $snake.next();
                $snake.eatapple();
            }, 200);
        }
        setGameInterval();
        setKeyboard();
        setMobileEvents();
    }
});

//initialize grid
function init() {
    $canvas.element = document.getElementById('main-canvas');
    $canvas.width = $grid.maxCol * $grid.unitSize + ($grid.maxCol + 1) * $grid.unitGap;
    $canvas.height = $grid.maxRow * $grid.unitSize + ($grid.maxRow + 1) * $grid.unitGap;
    $canvas.element.width = $canvas.width;
    $canvas.element.height = $canvas.height;
}

//initialize snake
function initSnake(direction, headPosition, bodyArray) {
    $snake.direction = direction ? direction : 'left';
    if (headPosition && headPosition.row && headPosition.col) {
        $snake.head.row = headPosition.row;
        $snake.head.col = headPosition.col;
    }
    else {
        $snake.head.row = Math.floor($grid.maxRow / 2);
        $snake.head.col = Math.floor($grid.maxCol / 2);
    }

    $snake.body = bodyArray ? bodyArray : ['r', 'r', 'r', 'r', 'r'];
    $snake.updateBodyPartDistribution();
}

//draw grid element
function drawGrid() {
    for (var row = 1; row <= $grid.maxRow; row++) {
        for (var col = 1; col <= $grid.maxCol; col++) {
            $grid.drawSquare(row, col);
        }
    }
}

//keybord control
function setKeyboard() {
    Mousetrap.bind('left', function () {
        if ($snake.direction != 'right') {
            $snake.direction = 'left';
        }
    });
    Mousetrap.bind('right', function () {
        if ($snake.direction != 'left') {
            $snake.direction = 'right';
        }
    });
    Mousetrap.bind('up', function () {
        if ($snake.direction != 'down') {
            $snake.direction = 'up';
        }
    });
    Mousetrap.bind('down', function () {
        if ($snake.direction != 'up') {
            $snake.direction = 'down';
        }
    });
}

//check if the snake hit the boundary
function hitBoundary() {
    var nextRow = $snake.head.row, nextCol = $snake.head.col;
    switch ($snake.direction) {
        case 'left': nextCol -= 1; break;
        case 'right': nextCol += 1; break;
        case 'up': nextRow -= 1; break;
        case 'down': nextRow += 1; break;
    }
    return !(nextCol <= 0 || nextRow <= 0 || nextCol > $grid.maxCol || nextRow > $grid.maxRow);
}

//check if the snake hit itself
function hitItself() {
    var nextRow = $snake.head.row, nextCol = $snake.head.col;
    switch ($snake.direction) {
        case 'left': nextCol -= 1; break;
        case 'right': nextCol += 1; break;
        case 'up': nextRow -= 1; break;
        case 'down': nextRow += 1; break;
    }

    return $snake.bodyPart[nextRow - 1][nextCol - 1] === 0;
}

function gameover() {
    clearInterval($gameIntervalID);
    $gameIntervalID = null;
    if (!window.alert('Game Over! \nScore: ' + $score)) {
        window.location.reload();
    }
}

//initialize apple
function initapple() {
    $apple.coor.row = Math.floor(Math.random() * ($grid.maxRow + 1));
    $apple.coor.col = Math.floor(Math.random() * ($grid.maxCol + 1));
}

//mobile control
function setMobileEvents() {
    var hammer = new Hammer($canvas.element);
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL })
    hammer.on('swipeleft', function () {
        if ($snake.direction != 'right') {
            $snake.direction = 'left';
        }
    });
    hammer.on('swiperight', function () {
        if ($snake.direction != 'left') {
            $snake.direction = 'right';
        }
    });
    hammer.on('swipeup', function () {
        if ($snake.direction != 'down') {
            $snake.direction = 'up';
        }
    });
    hammer.on('swipedown', function () {
        if ($snake.direction != 'up') {
            $snake.direction = 'down';
        }
    });
}
