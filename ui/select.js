var classes = [];
var restrictions = [];

$(document).ready(() => {
  createRestrictionInput();
})

function addList(list, item){
  if(item){
    list.push(item);
  }
}

function deleteItem(list, itemIndex, callback){
  if(itemIndex >= 0){
    list.splice(itemIndex,1);
  }
  callback();
}

function updateClassTable(){
  var table = createListTable(classes, 'classes', "updateClassTable");
  $('#class-table').html(table);
}

function updateRestrictionTable(){
  var table = createListTable(restrictions, 'restrictions', 'updateRestrictionTable');
  $('#restriction-table').html(table);
}

function addClass(){
  addList(classes, $('#class-name').val());
  $('#class-name').val('');
  updateClassTable();
}

function addRestriction(){
  addList(restrictions, getRestriction());
  updateRestrictionTable();
}

function createListTable(list, listName, callbackName){
  var table = document.createElement('table');
  table.classList.add('table')
  for(var index in list){
    item = list[index]
    var row = document.createElement('tr');
    var itemName = document.createElement('td');
    itemName.innerHTML = item;
    var deleteButton = document.createElement('button');
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-danger')
    deleteButton.innerHTML = "<span class=\"oi oi-trash\"></span>&nbsp;"
    deleteButton.setAttribute("onclick", "deleteItem("+ listName + ", " + index +", " + callbackName + ")")
    var buttonContainer = document.createElement('td');
    deleteButton.classList.add('float-right')
    buttonContainer.appendChild(deleteButton)
    row.appendChild(itemName)
    row.appendChild(buttonContainer)
    table.appendChild(row)
  }
  return table;
}

function getRestriction(){
  var type = $('#restriction-type').val();
  output = ""
  if(type == "before" || type == "after"){
    output += type + " " + $('#time1').val() + " ";
  }
  else if(type == "between"){
    output += type + " " + $('#time1').val() + " and " + $('#time2').val() + " ";
  }
  output += "on " + $('#day-select').val();
  return output;
}

function createRestrictionInput(){
  var type = $("#restriction-type").val();
  console.log(type);
  $('#restriction-input').empty()
  if(type == 'before' || type == 'after'){
    var timeInput = document.createElement('input')
    timeInput.classList.add('form-control');
    timeInput.id = "time1"
    timeInput.setAttribute('type', 'time')
    $('#restriction-input').append(timeInput);
  }
  else if(type == 'between'){
    var timeInput = document.createElement('input')
    timeInput.classList.add('form-control');
    timeInput.id = "time1"
    timeInput.setAttribute('type', 'time')
    $('#restriction-input').append(timeInput);
    var label = document.createElement('h4');
    label.innerHTML = 'and'
    $('#restriction-input').append(label);
    var timeInput = document.createElement('input')
    timeInput.id = "time2"
    timeInput.classList.add('form-control');
    timeInput.setAttribute('type', 'time')
    $('#restriction-input').append(timeInput);
  }

  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  if(type != 'on'){
    var daySelectHeader = document.createElement('h4');
    daySelectHeader.innerHTML = 'on'
    $('#restriction-input').append(daySelectHeader)
  }

  var daySelect = document.createElement('select');
  daySelect.classList.add('form-control');
  daySelect.id = "day-select"
  for(var day of days){
    var dayOption = document.createElement('option');
    dayOption.innerHTML = day;
    daySelect.appendChild(dayOption);
  }
  $('#restriction-input').append(daySelect);

}
