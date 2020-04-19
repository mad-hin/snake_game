var $canvas = { element: null, width: null, height: null };
var $ctx = null;
var $grid = { maxRow: 20, maxCol: 28, unitSize: 20, unitGap: 5 };

$(document).ready(function () {
    $canvas.element = document.getElementById('main-canvas');
    $canvas.element.width = $canvas.width;
    $canvas.element.height = $canvas.height;
    if ($canvas.element.getContext) {
        $ctx = $canvas.element.getContext('2d');
    }
});
