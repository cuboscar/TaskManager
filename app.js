$(document).ready(function() {
    $('select').material_select();
});
let loadFile = function(event) {
    let image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
};

