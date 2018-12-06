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

function convert(day, time) {
  // console.log(day);
  // console.log(time);
  var timeList = time.split("-");
  var boundaries = {
    "startTime" : dayConvert(day, timeList[0]),
    "endTime" : dayConvert(day, timeList[1])
  };
  return boundaries;
}



function overlapTimes(time1, time2) {
  return (Math.max(time1.startTime, time2.startTime) <= Math.min(time1.endTime, time2.endTime));
}


function dayConvert(day, time) {
  if (day == "M") return parseInt(convertTime(time)) + 0 * 24 * 60;
  if (day == "T") return parseInt(convertTime(time)) + 1 * 24 * 60;
  if (day == "W") return parseInt(convertTime(time)) + 2 * 24 * 60
  if (day == "R") return parseInt(convertTime(time)) + 3 * 24 * 60
  if (day == "F") return parseInt(convertTime(time)) + 4 * 24 * 60
  if (day == "S") return parseInt(convertTime(time)) + 5 * 24 * 60
}


function convertTime(time) {
    // console.log(time);
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s?([AaPp][Mm]?)$/)[1];
    var pm = ['P', 'p', 'PM', 'pM', 'pm', 'Pm'];
    var am = ['A', 'a', 'AM', 'aM', 'am', 'Am'];

  if (pm.indexOf(AMPM) >= 0 && hours < 12) hours = hours + 12;
  if (am.indexOf(AMPM) >= 0 && hours == 12) hours = hours - 12;
    return (60 * hours + minutes);
}

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
  console.log(newClasses);
  newClasses = filterRestrictions(newClasses, restrictions);
  console.log(newClasses);
  if(newClasses.length == 0){
    allSchedules = list;
    return ;
  }
  findPossibleSchedules(newClasses, list, []);
  allSchedules = list;
}

function filterRestrictions(classes, restrictions) {
  let newClasses = []
  for(course of classes){
    newClasses.push([]);
  }
  for(let restriction of restrictions){
    let i = 0; 
    for(let course of classes){
      for(let section of course){
        let confict = false;
        for(let day in section.times){
            if(section.times[day] == "TBD"){
              break;
            }
            if(overlapTimes(convert(day, section.times[day]), restriction)){
              confict = true;
              break;
            }
        }
        if(!confict){
          newClasses[i].push(section);
        }
      }
        console.log(newClasses[i].length);
      if(newClasses[i].length == 0){
        return [];
      }
      i++;
    }
  }
  return newClasses;
}
