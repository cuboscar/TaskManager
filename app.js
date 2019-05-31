$(document).ready(function() {
    $('select').material_select();
});
let loadFile = function(event) {
    let image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
};

/**
 * 
 * Clear
 * 
 */
const clearButtonID = "clear";
const materialLocationInput= "";
const materialWeightID= "weight";
const bodyNode = document.body

function clear(e) {
    document.getElementById("task-form").reset();
    let image = document.getElementById('output');
    image.src = "placeholder.png";

}
document.getElementById(clearButtonID).addEventListener("click",clear)
