var $canvas = {
    element: null,
    width: null,
    height: null
};

var $ctx = null;

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
    }
};

/* Main Function */
$(document).ready(function () {
    initializeGridSystem();
    initializeSnake();
    if ($canvas.element.getContext) {
        $ctx = $canvas.element.getContext('2d');
        drawFullGridSystem();
        $snake.draw();
    }
});

function initializeGridSystem() {
    $canvas.element = document.getElementById('main-canvas');
    $canvas.width = $grid.maxCol * $grid.unitSize + ($grid.maxCol + 1) * $grid.unitGap;
    $canvas.height = $grid.maxRow * $grid.unitSize + ($grid.maxRow + 1) * $grid.unitGap;
    $canvas.element.width = $canvas.width;
    $canvas.element.height = $canvas.height;
}

function initializeSnake(direction, headPosition, bodyArray) {
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

function drawFullGridSystem() {
    for (var row = 1; row <= $grid.maxRow; row++) {
        for (var col = 1; col <= $grid.maxCol; col++) {
            $grid.drawSquare(row, col);
        }
    }
}