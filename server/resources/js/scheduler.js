/*
//TESTS
var class4 = {
        'M': '2:00pm - 3:50pm',
        'W': '2:00pm - 3:50pm'//,
        // 'F': '12:00pm - 12:50pm'
      };

var class5 = {
        'M': '2:00pm - 2:50pm',
        'W': '2:00pm - 2:50pm',
        'F': '2:00pm - 2:50pm'
      };

var class6 = {
        'M': '11:30am - 11:50am',
        'W': '11:30am - 12:20pm',
        'F': '11:30am - 11:50am'
      };

console.log("OVERLAP TESTS\n-------------------------------------------\n")
// console.log(overlap(class4, class5));
// console.log(overlap(class4, class6));
// console.log(overlap(class5, class6));
*/


/* Checks if the two time objects overlap */
function overlap(times1, times2) {
  if(times1["T"] == "TBD" || times2["T"] == "TBD"){
    return false;
  }
  for (var day1 in times1) {
    for (var day2 in times2) {
      if(overlapTimes(convert(day1, times1[day1]), convert(day2, times2[day2]))){
        return true;
      }
    }
  }
  return false;
}


/* Converts the day and time to start and end times object */
function convert(day, time) {
  var timeList = time.split("-");
  var boundaries = {
    "startTime" : dayConvert(day, timeList[0]),
    "endTime" : dayConvert(day, timeList[1])
  };
  return boundaries;
}


/* Checks if two start and end time objects overlap */
function overlapTimes(time1, time2) {
  return (Math.max(time1.startTime, time2.startTime) <= Math.min(time1.endTime, time2.endTime));
}



/* Converts day and time object to a numerical value */
function dayConvert(day, time) {
  if (day == "M") return parseInt(convertTime(time)) + 0 * 24 * 60;
  if (day == "T") return parseInt(convertTime(time)) + 1 * 24 * 60;
  if (day == "W") return parseInt(convertTime(time)) + 2 * 24 * 60
  if (day == "R") return parseInt(convertTime(time)) + 3 * 24 * 60
  if (day == "F") return parseInt(convertTime(time)) + 4 * 24 * 60
  if (day == "S") return parseInt(convertTime(time)) + 5 * 24 * 60
}


/* Converts time to # from HH:MM AM/PM */
function convertTime(time) {
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s?([AaPp][Mm]?)$/)[1];
    var pm = ['P', 'p', 'PM', 'pM', 'pm', 'Pm'];
    var am = ['A', 'a', 'AM', 'aM', 'am', 'Am'];

  if (pm.indexOf(AMPM) >= 0 && hours < 12) hours = hours + 12;
  if (am.indexOf(AMPM) >= 0 && hours == 12) hours = hours - 12;
    return (60 * hours + minutes);
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


function isValidSchedule(sectionToAdd, schedule){
  for (otherClass of schedule){
    // console.log(otherClass.number + " " + JSON.otherClass.times);
    // console.log(sectionToAdd.number + " " + sectionToAdd.times);
    // console.log("\n-----------------------\n")
    if(overlap(otherClass.times, sectionToAdd.times)){
      return false;
    }
  }
  return true;
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

function findPossibleSchedules(classes, list, schedule) {
  if (classes.length == 0){
    list.push(schedule);
    return ;
  }
  for (section of classes[0]){
    if (isValidSchedule(section, schedule)){
      newSchedule = schedule.slice();
      newSchedule.push(section);
      findPossibleSchedules(classes.slice(1), list, newSchedule)
    }
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

function findAllSchedules(classes, restrictions) {
  var list = [];
  var newClasses = [];
  for(var i = 0; i < classes.length; i++){
    types = {};
    for(var j = 0; j < classes[i].length; j++){
      section = classes[i][j];
      section.times = JSON.parse(section.times);
      if(section["type"] in types){
        types[section["type"]].push(section)
      }
      else{
        types[section["type"]] = [section];
      }
    }
    for(var key in types){
      newClasses.push(types[key]);
    }
  }
  newClasses = filterRestrictions(newClasses, restrictions);
  if(newClasses.length == 0){
    allSchedules = list;
    return ;
  }
  findPossibleSchedules(newClasses, list, []);
  allSchedules = list;
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

function filterRestrictions(classes, restrictions) {
  let newClasses = []
  for(course of classes){
    newClasses.push([]);
  }
  let i = 0; 
  for(let course of classes){
    for(let section of course){
      let confict = false;
      for(let day in section.times){
        for(let restriction of restrictions){
          if(section.times[day] == "TBD"){
            break;
          }
          if(overlapTimes(convert(day, section.times[day]), restriction)){
            confict = true;
            break;
          }
        }
      }
      if(!confict){
        newClasses[i].push(section);
      }
    }
    if(newClasses[i].length == 0){
      return [];
    }
    i++;
  }
  return newClasses;
}
