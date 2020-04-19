// grid part
var $canvas = { element: null, width: null, height: null };
var $ctx = null;
var $grid = {
    maxRow: 30,
    maxCol: 50,
    unitSize: 20,
    unitGap: 5,
    drawSquare: function (row, col, style) {
        var position = {
            top: (row - 1) * this.unitSize + row * this.unitGap,
            left: (col - 1) * this.unitSize + col * this.unitGap,
            bottom: row * (this.unitSize + this.unitGap),
            right: col * (this.unitSize + this.unitGap)
        }
        $ctx.strokeStyle = style ? style : '#ddd';
        $ctx.beginPath();
        $ctx.moveTo(position.left, position.top);
        $ctx.lineTo(position.right, position.top);
        $ctx.lineTo(position.right, position.bottom);
        $ctx.lineTo(position.left, position.bottom);
        $ctx.closePath();
        $ctx.stroke();
    }
};

$(document).ready(function () {
    init();
    if ($canvas.element.getContext) {
        $ctx = $canvas.element.getContext('2d');
        drawGrid();
    }
});

function init() {
    $canvas.element = document.getElementById('main-canvas');
    $canvas.width = $grid.maxCol * $grid.unitSize + ($grid.maxCol + 1) * $grid.unitGap;
    $canvas.height = $grid.maxRow * $grid.unitSize + ($grid.maxRow + 1) * $grid.unitGap;
    $canvas.element.width = $canvas.width;
    $canvas.element.height = $canvas.height;
}

function drawGrid() {
    for (var row = 1; row <= $grid.maxRow; row++) {
        for (var col = 1; col <= $grid.maxCol; col++) {
            $grid.drawSquare(row, col);
        }
    }
}
