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