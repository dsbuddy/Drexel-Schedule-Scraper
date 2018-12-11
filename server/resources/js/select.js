var allSchedules = [];
var classes = [];
var term = "";
var restrictions = [];
days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "each day"];
var defaultContent = "";



/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/

function sendPOSTRender(page){
  $.ajax({
    type: "POST",
    url : "render",
    data: {page : page},
    success:(res)=>{
      $("#content").html(res);
    },
    error:(res)=>{
      $("#content").html(res);
    }
  })
}






$(document).ready(() => {
  /* When user types a term and clicks enter, function is automatically called */
  $("#term-name").keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      selectTerm();
    }
  });

  /* When user types a class and clicks enter, function is automatically called */
  $("#class-name").keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      addClass();
    }
  });

  /* When user chooses a restriction and clicks enter, function is automatically called */
  $("#restriction-input").keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      addRestriction();
    }
  });

  /* When user types a second time and clicks enter, function is automatically called */
  $("#time1").keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      addRestriction();
    }
  });

  /* When user types a second time and clicks enter, function is automatically called */
  $("#time2").keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      addRestriction();
    }
  });

  /* When user chooses a day and clicks enter, function is automatically called */
  $("#day-select").keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      addRestriction();
    }
  });


/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/

  $.ajax({
    url: '/allTerms',
    type: 'GET',
    success: (rows) => {
      $("#termsList").html("");
      //$('#term-name').html('<option disabed selected>--Select a Term--</option>');
      for(term of rows){
        $("#termsList").append("<option value='"+term["term"]+"'>");
        //var option = document.createElement('option');
        //option.innerHTML = term["term"];
        //$('#term-name').append(option);
      }
    }
  })
  createRestrictionInput();
  defaultContent = $("#content").html();
});


/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/

function showCourseSelect(){
  if(term != ""){
    $("#content").html(defaultContent);
    $('#term-input-group').hide();
    $('#course-input-group').show();
    updateClassTable();
    updateRestrictionTable();
  }
}


/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/

function addList(list, item){
  if(item){
    list.push(item);
  }
}


/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/

function deleteItem(list, itemIndex, callback){
  if(itemIndex >= 0){
    list.splice(itemIndex,1);
  }
  callback();
}


/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/

function updateClassTable(){
  var table = createListTable(classes, 'classes', "updateClassTable");
  $('#class-table').html(table);
}


/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/

function updateRestrictionTable(){
  var table = createListTable(restrictions, 'restrictions', 'updateRestrictionTable');
  $('#restriction-table').html(table);
}


/* Checks if class user type is a valid class from the database */
function validClass(course) {
  course = course.replace(/ /g,'');
  var datalist = $("#courseList");
  var children = datalist[0].children;
  for (var i=0; i<children.length; i++) {
    if (course == children[i].value.replace(/ /g,'')) {
      return children[i].value;
    }
  }
  return false;
}


/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/

function addClass(){
  var className = validClass($('#class-name').val().toUpperCase());
  if (className != false) {
    addList(classes, className);
    $('#class-name').val('');
    updateClassTable();
  } else {
    alert("Not a valid class");
  }
}

/* Converts string to title case (ex: the boy went to the market -> The Boy Went To The Market) */
function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}



/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/
function selectTerm(){
  var termAttr = $('#term-name');
  if (termAttr.val() != "--Select a Term--") {
    termString = titleCase(termAttr.val());
    term = termString
    termAttr.val('');
    $.ajax({
      url: '/allClasses',
      type: 'GET',
      data: {
        term: termString
      },
      success: (rows) => {
        // $('#class-name').autocomplete({source: rows.map((x) => x["ID"])});
        $("#courseList").html("");
        for (course of rows) {
          $("#courseList").append("<option value='" + course["ID"] + "'>");
        }
        $('#term-input-group').hide();
        $('#course-input-group').show();
        defaultContent = $("#content").html();
      }
    })

  }
}



/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/
function addRestriction(){
  addList(restrictions, getRestriction());
  updateRestrictionTable();
  defaultContent = $("#content").html();
}



/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/
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



/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/
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



/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/
function createRestrictionInput(){
  var type = $("#restriction-type").val();
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

/* Converts time from HH:MM AM/PM to HHMM */
function convertTimeWithoutAMPM(time){
  times = time.split(":");
  return parseInt(times[0]) * 60 + parseInt(times[1]);
}



/*

  _   _ _      _         _____                                     _   
 | \ | (_)    | |       / ____|                                   | |  
 |  \| |_  ___| | __   | |     ___  _ __ ___  _ __ ___   ___ _ __ | |_ 
 | . ` | |/ __| |/ /   | |    / _ \| '_ ` _ \| '_ ` _ \ / _ \ '_ \| __|
 | |\  | | (__|   <    | |___| (_) | | | | | | | | | | |  __/ | | | |_ 
 |_| \_|_|\___|_|\_\    \_____\___/|_| |_| |_|_| |_| |_|\___|_| |_|\__|


                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                                  | |                                                              
                               __ | |  __                                                          
                               \ \| | / /                                                          
                                \ \_|/ /                                                           
                                 \ \/ /                                                            
                                  \  /                                                             
                                   \/                                                              
                                                
*/
function findSchedules(){
  $("#loader").toggle();
  $("#content").toggle();
  parsedRestrictions = [];
  for(var restriction of restrictions){
    var start = "";
    var end  = "";
    var keys = restriction.split(' ');
    var type = keys[0];
    if(type == "on"){
      start = 0;
      end = 23 * 60 + 59;
    }
    else if(type == "before"){
      start = 0;
      end = convertTimeWithoutAMPM(keys[1]);
    }
    else if(type == "after"){
      start = convertTimeWithoutAMPM(keys[1]);
      end = 23 * 60 + 59;
    }
    else{
      start = convertTimeWithoutAMPM(keys[1]);
      end = convertTimeWithoutAMPM(keys[3]);
    }
    if(keys[keys.length-1] == "day"){
      for(var offset = 0; offset < 5; offset++){
        dayOffset = offset * 24 * 60;
        parsedRestrictions.push({"startTime" : start + dayOffset, "endTime" : end + dayOffset});
      }
    }
    else{
      dayOffset = days.indexOf(keys[keys.length-1]) * 24 * 60;
      start += dayOffset;
      end += dayOffset;
      parsedRestrictions.push({"startTime" : start, "endTime" : end});
    }
  }


  $.ajax({
    type: 'POST',
    url: 'classes',
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify({courses : classes, term : term}),
    success: (result) => {
      //start finding schedules dialog
      // $("#loader").toggle();
      findAllSchedules(result, parsedRestrictions);
      //end finding schedules dialog
      $("#loader").toggle();
      
      if(allSchedules.length == 0){
          $("#content").toggle();
          alert("No possible schedules found");
      }else{
          sendPOSTRender("calendar");
      }
    }
  });
}
