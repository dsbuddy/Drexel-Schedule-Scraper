// allClasses = [[{"term":"Spring Quarter 18-19","college":"Col of Computing & Informatics","subject":"CS","number":"275","type":"Lecture","method":"Face To Face","section":"001","crn":"33456","description":"Web and Mobile App Development","times":"{\"M\":\"02:00pm-02:50pm\",\"W\":\"02:00pm-02:50pm\",\"F\":\"02:00pm-02:50pm\"}","instructor":"David H Augenblick"}],[{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lecture","method":"Face To Face","section":"A","crn":"30091","description":"General Chemistry II","times":"{\"M\":\"04:00pm-04:50pm\",\"W\":\"04:00pm-04:50pm\",\"F\":\"04:00pm-04:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Recitation/Discussion","method":"Face To Face","section":"001","crn":"30092","description":"General Chemistry II","times":"{\"W\":\"10:00am-10:50am\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lab","method":"Face To Face","section":"061","crn":"30093","description":"General Chemistry II","times":"{\"T\":\"09:00am-10:50am\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Recitation/Discussion","method":"Face To Face","section":"002","crn":"30094","description":"General Chemistry II","times":"{\"T\":\"04:00pm-04:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lab","method":"Face To Face","section":"062","crn":"30095","description":"General Chemistry II","times":"{\"R\":\"04:00pm-05:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Recitation/Discussion","method":"Face To Face","section":"007","crn":"30630","description":"General Chemistry II","times":"{\"W\":\"02:00pm-02:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Recitation/Discussion","method":"Face To Face","section":"008","crn":"30631","description":"General Chemistry II","times":"{\"T\":\"01:00pm-01:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Recitation/Discussion","method":"Face To Face","section":"004","crn":"30632","description":"General Chemistry II","times":"{\"T\":\"03:00pm-03:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Recitation/Discussion","method":"Face To Face","section":"006","crn":"30633","description":"General Chemistry II","times":"{\"F\":\"01:00pm-01:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lab","method":"Face To Face","section":"063","crn":"30634","description":"General Chemistry II","times":"{\"T\":\"11:00am-12:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lab","method":"Face To Face","section":"065","crn":"30635","description":"General Chemistry II","times":"{\"M\":\"02:00pm-03:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lab","method":"Face To Face","section":"069","crn":"30636","description":"General Chemistry II","times":"{\"R\":\"03:00pm-04:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lab","method":"Face To Face","section":"070","crn":"30637","description":"General Chemistry II","times":"{\"F\":\"12:00pm-01:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lab","method":"Face To Face","section":"066","crn":"30638","description":"General Chemistry II","times":"{\"M\":\"12:00pm-01:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lab","method":"Face To Face","section":"064","crn":"31238","description":"General Chemistry II","times":"{\"T\":\"11:00am-12:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Recitation/Discussion","method":"Face To Face","section":"003","crn":"31501","description":"General Chemistry II","times":"{\"T\":\"05:00pm-05:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lab","method":"Face To Face","section":"067","crn":"31652","description":"General Chemistry II","times":"{\"M\":\"12:00pm-01:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Recitation/Discussion","method":"Face To Face","section":"009","crn":"32136","description":"General Chemistry II","times":"{\"M\":\"03:00pm-03:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Recitation/Discussion","method":"Face To Face","section":"010","crn":"32137","description":"General Chemistry II","times":"{\"W\":\"03:00pm-03:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Recitation/Discussion","method":"Face To Face","section":"011","crn":"32138","description":"General Chemistry II","times":"{\"R\":\"05:00pm-05:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lab","method":"Face To Face","section":"071","crn":"32139","description":"General Chemistry II","times":"{\"F\":\"12:00pm-01:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lab","method":"Face To Face","section":"072","crn":"32140","description":"General Chemistry II","times":"{\"F\":\"02:00pm-03:50pm\"}","instructor":"STAFF"},{"term":"Spring Quarter 18-19","college":"Arts and Sciences","subject":"CHEM","number":"102","type":"Lab","method":"Face To Face","section":"073","crn":"32141","description":"General Chemistry II","times":"{\"F\":\"02:00pm-03:50pm\"}","instructor":"STAFF"}]];

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
    if(overlap(otherClass.times, sectionToAdd.times)){
      return false
    }
  }
  return true
}

function findPossibleSchedules(classes, list, schedule) {
  if (classes.length == 0){
    list.push(schedule);
    return true
  }
  for (section of classes[0]){
    console.log(JSON.stringify(section));
    if (isValidSchedule(section, schedule)){
      newSchedule = schedule.slice()
      newSchedule.push(section)
      if(findPossibleSchedules(classes.slice(1), list, newSchedule)){
      }
    }
  }
}

function findAllSchedules(classes, restrictions) {
  // classes = allClasses;
  var list = [];
  findPossibleSchedules(classes, list, []);
  allSchedules = list;
  console.log(list.length);
  console.log(JSON.stringify(list));
}
