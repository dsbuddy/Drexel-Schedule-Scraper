
function overlap(times1, times2) {
  var res = false;
  for (var i=0; i<times1.length; i++) {
    for (var j=0; j<times2.length; j++) {
      res = res || overlapTimes(convert(times1[i]), convert(times2[j]));
    }
  }
  return res;
}

function overlapTimes(time1, time2) {
  return (Math.max(time1.startTime, time2.startTime) <= Math.min(time1.endTime, time2.endTime));
}

function convert(timeInput) {
  for (var day in timeInput) {
    var time = timeInput[day];
    var timeList = time.split(" - ");
    var boundaries = {
      "startTime" : dayConvert(day, timeList[0]),
      "endTime" : dayConvert(day, timeList[1])
    };
    return boundaries;
  }
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
