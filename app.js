/**
 * 
 * Adding New Tasks
 * 
 */

// Find form
const newText = document.querySelector("form");
// Find Add Task button 
const taskInput = document.getElementById("inputText");
// Find list of elements
const list = document.querySelector("ul.collection");

newText.addEventListener("submit", function (e) {


    if (taskInput.value != "" && taskInput.value != "Enter new task") {
        console.log(taskInput.value)
        let li = document.createElement("li");
        li.setAttribute("class", "collection-item");
        li.innerHTML = `${taskInput.value}<a href="#" class="delete-item secondary-content" ><i id="new-li-item" title="customMade" class="fa fa-times"></i ></a >`
        list.appendChild(li);
        storedTasks.push(taskInput.value);
        let stringyObject = JSON.stringify(storedTasks);
        localStorage.setItem("Appended Tasks", stringyObject);



    }
    e.preventDefault();

})

/**
 * 
 * Removing previous tasks
 * 
 */
const toBeRemovedButtonClass = "fa fa-times";
const taskClearButtonClass = "clear-tasks btn red";
const bodyNode = document.body
window.addEventListener("load", reload);

function eraser(e) {

    if (e.target.className === toBeRemovedButtonClass) {
        console.log(e.target.parentElement.parentElement.innerText);
        e.target.parentElement.parentElement.remove();
        let index = storedTasks.indexOf(e.target.parentElement.parentElement.innerText)
        console.log(index)
        storedTasks.splice(index, 1);
        let stringyObject = JSON.stringify(storedTasks);
        localStorage.setItem("Appended Tasks", stringyObject);
        e.preventDefault()


    }
    if (e.target.className === taskClearButtonClass) {
        e.preventDefault();
        console.log(e.target.parentElement);
        let a = confirm("ALL TASKS WILL BE REMOVED! IS IT OKAY?")
        if (a) {
            e.target.previousSibling.previousSibling.innerHTML = null;
            /**
           * The following code portion would remove the local storage
           * upon the 'click' event for button CLEAR ALL TASKS 
           */
            localStorage.removeItem("Appended Tasks");
            storedTasks = [];
        }

        //#endregion
    }
}
// toBeRemovedButton.addEventListener("click", eraser);
bodyNode.addEventListener("click", eraser);
function reload(e) {
    console.log("reloaded!");
    let b = localStorage.getItem("Appended Tasks");
    b = JSON.parse(b);
    b.forEach(element => {
        console.log(element);
        let li = document.createElement("li");
        li.setAttribute("class", "collection-item");
        li.innerHTML = `${element}<a href="#" class="delete-item secondary-content" ><i id="new-li-item" title="customMade" class="fa fa-times"></i ></a >`
        list.appendChild(li);
        storedTasks.push(element)
    });


}
/**
 * 
 * Storage of Tasks within Local Storage
 * 
 */
let storedTasks = [];//see submitting function

//NO falta borrar uno por uno de la lista del local storage 
//NO falta guardar tasks despues de cerrar aplicacion load- https://developer.mozilla.org/en-US/docs/Web/Events/load 
//NO faltan filtros

function filtering() {
    let input = document.getElementById("filterText");
    let filter = input.value;
    console.log(filter)
    //  
    let elements = document.getElementsByClassName("collection-item")
    console.log(elements)
    elements = [].slice.call(elements)
    console.log(elements)
    elements.forEach(element => {
        if (element.innerText.indexOf(filter) > -1) {
            console.log(element.innerText.indexOf(filter) > -1)
            element.style.display = "";
        } else {
            element.style.display = "none";

        }
    }
    )
    //console.log(elements)
}





