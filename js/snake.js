// grid part
var $canvas = { element: null, width: null, height: null };
var $ctx = null;
var $grid = { maxRow: 30, maxCol: 50, unitSize: 20, unitGap: 5 };

$(document).ready(function () {
    init();
    if ($canvas.element.getContext) {
        $ctx = $canvas.element.getContext('2d');
    }
});

function init() {
    $canvas.element = document.getElementById('main-canvas');
    $canvas.width = $grid.maxCol * $grid.unitSize + ($grid.maxCol + 1) * $grid.unitGap;
    $canvas.height = $grid.maxRow * $grid.unitSize + ($grid.maxRow + 1) * $grid.unitGap;
    $canvas.element.width = $canvas.width;
    $canvas.element.height = $canvas.height;
}
