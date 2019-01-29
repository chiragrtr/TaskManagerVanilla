var listId = 1;
var taskId = 1;

var showText = function(event) {
  var node = event.target.parentNode;
  node.classList.remove("hide-text");
  node.classList.add("show-text");
};

var hideText = function(node) {
  node.classList.remove("show-text");
  node.classList.add("hide-text");
  var input = node.querySelector("input");
  input.focus();
};

var hideTextOnHeading = function(event) {
  var heading = event.target.closest(".heading");
  hideText(heading);
};

var hideTextOnTask = function(event) {
  var task = event.target.closest(".task");
  hideText(task);
};

var saveTask = function(event, isHeading) {
  var parent = event.target.closest("button").closest("div");
  var span = parent.querySelector(isHeading ? "h5" : "span");
  var input = parent.querySelector("input");
  span.innerText = input.value;
};

var saveHeading = function(event) {
  saveTask(event, true);
};

var _delete = function(event, selector) {
  var parent = event.target.parentNode;
  var element = parent.closest(selector);
  var parent = element.parentNode;
  parent.removeChild(element);
};

var deleteTask = function(event) {
  _delete(event, ".task");
};

var deleteList = function(event) {
  _delete(event, ".list");
};

var hideInputBoxOnHeading = function(event) {
  var parent = event.target.parentNode;
  hideInputAndShowElem(parent, "h5");
};

var showInputBoxForHeading = function(event) {
  showInputBox(event, true);
};

var addListeners = function(event, elements, listener) {
  Array.from(elements).forEach(function(element) {
    element.addEventListener(event, listener);
  });
};

var addTask = function(event) {
  var anchor = event.target;
  var list = anchor.closest(".list");
  var node = document.createElement("div");
  node.innerHTML = document.getElementById("dummyTask").innerHTML;
  node = node.querySelector("div");
  node.id = "task" + taskId++;
  list.insertBefore(node, anchor);
  attachListenersForTasks(node);
};

var addList = function(event) {
  var list = event.target.closest(".list");
  var listContainer = list.closest(".lists-container");
  var node = document.createElement("div");
  node.innerHTML = document.getElementById("dummyList").innerHTML;
  node = node.querySelector("div");
  node.id = "list" + listId++;
  listContainer.insertBefore(node, list);
  attachListenersForLists(node);
};

var attachListenersForTasks = function(task) {
  var taskInputs = (task || document).querySelectorAll(".task input");
  var taskButtons = (task || document).querySelectorAll(".task button");
  var deleteButtons = (task || document).querySelectorAll(".close-task");
  var tasks = task
    ? [task]
    : document.querySelectorAll(".task:not(.add-task):not(.add-list)");

  addListeners("click", tasks, hideTextOnTask);
  addListeners("blur", taskInputs, showText);
  addListeners("mousedown", taskButtons, saveTask);
  addListeners("click", deleteButtons, deleteTask);
};

var attachListenersForLists = function(list) {
  var addTaskButton = (list || document).querySelectorAll(".add-task");
  var headings = (list || document).querySelectorAll(".heading");
  var headingInputs = (list || document).querySelectorAll(".heading input");
  var headingButtons = (list || document).querySelectorAll(".heading button");
  var addListButton = (list || document).querySelectorAll(".add-list");
  var deleteButtons = (list || document).querySelectorAll(".close-list");

  addListeners("click", addTaskButton, addTask);
  addListeners("click", headings, hideTextOnHeading);
  addListeners("blur", headingInputs, showText);
  addListeners("mousedown", headingButtons, saveHeading);
  addListeners("click", addListButton, addList);
  addListeners("click", deleteButtons, deleteList);
};

var attachListeners = function() {
  attachListenersForTasks();
  attachListenersForLists();
};

function allowDrop(event) {
  event.preventDefault();
}

function drag(ev) {
  event.dataTransfer.setData("taskId", event.target.id);
}

function drop(event) {
  event.preventDefault();
  var id = event.dataTransfer.getData("taskId");
  var task = document.getElementById(id);
  var sourceList = task.closest(".list");
  var targetList = event.target.closest(".list");
  if (sourceList !== targetList) {
    var addTaskLink = targetList.querySelector(".add-task");
    targetList.insertBefore(task, addTaskLink);
  }
}

attachListeners();
