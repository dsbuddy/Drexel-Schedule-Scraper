
/*
//TESTS
var class4 = {
        'M': '12:00pm - 12:50pm',
        'W': '12:00pm - 12:50pm',
        'F': '12:00pm - 12:50pm'
      };

var class5 = {
        'M': '11:00am - 11:20am',
        'W': '11:00am - 11:20am',
        'F': '11:00am - 11:20am'
      };

var class6 = {
        'M': '11:30am - 11:50am',
        'W': '11:30am - 12:20pm',
        'F': '11:30am - 11:50am'
      };

console.log(overlap(class4, class5));
console.log(overlap(class4, class6));
console.log(overlap(class5, class6));
*/

function overlap(times1, times2) {
  var res = false;
  for (var day1 in times1) {
    for (var day2 in times2) {
      res = res || overlapTimes(convert(day1, times1[day1]), convert(day2, times2[day2]));
    }
  }
  return res;
}

function convert(day, time) {
  var timeList = time.split(" - ");
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
    console.log(otherClass);
    console.log(sectionToAdd);
	 console.log("TIMES ---------------");
	 console.log(otherClass.times);
	 console.log("END -----------------");
    if(overlap(otherClass.times, sectionToAdd.times)){
      return false;
    }
  }
  return true;
}

function findPossibleSchedules(classes, list, schedule) {
  if (classes.length == 0){
    list.push(schedule);
    return true
  }
  for (section of classes[0]){
    if (isValidSchedule(section, schedule)){
      newSchedule = schedule.slice()
      newSchedule.push(section)
      if(findPossibleSchedules(classes.slice(1), list, newSchedule)){
      }
    }
  }
}

function findAllSchedules(classes, restrictions) {
  var list = [];
  findPossibleSchedules(classes, list, []);
  allSchedules = list;
}
