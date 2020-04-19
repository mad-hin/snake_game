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
    unitSize: 20,
    unitGap: 5,
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
        switch (this.direction) {
            case 'left': this.head.col -= 1; this.body.unshift('r'); break;
            case 'right': this.head.col += 1; this.body.unshift('l'); break;
            case 'up': this.head.row -= 1; this.body.unshift('b'); break;
            case 'down': this.head.row += 1; this.body.unshift('t'); break;
        }
        this.body.pop();
    }
};

/* Main Function */
$(document).ready(function () {
    init();
    initSnake();
    if ($canvas.element.getContext) {
        $ctx = $canvas.element.getContext('2d');
        drawGrid();
        $snake.draw();

        var setGameInterval = function () {
            $gameIntervalID = setInterval(function () {
                $canvas.clear();
                drawGrid();
                $snake.draw();
                $snake.next();
            }, 200);
        }
        setGameInterval();
        setKeyboard(); 
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
    } else {
        $snake.head.row = Math.floor($grid.maxRow / 2);
        $snake.head.col = Math.floor($grid.maxCol / 2);
    }
    $snake.body = bodyArray ? bodyArray : ['r', 'r', 'r', 'r', 'r'];
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
    Mousetrap.bind('left', function () { if ($snake.direction != 'right') { $snake.direction = 'left'; } });
    Mousetrap.bind('right', function () { if ($snake.direction != 'left') { $snake.direction = 'right'; } });
    Mousetrap.bind('up', function () { if ($snake.direction != 'down') { $snake.direction = 'up'; } });
    Mousetrap.bind('down', function () { if ($snake.direction != 'up') { $snake.direction = 'down'; } });
}