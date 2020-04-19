var $canvas = { element: null, width: null, height: null };
var $ctx = null;

$(document).ready(function () {
    $canvas.element = document.getElementById('main-canvas');
    $canvas.element.width = $canvas.width;
    $canvas.element.height = $canvas.height;
    if ($canvas.element.getContext) {
        $ctx = $canvas.element.getContext('2d');
    }
});