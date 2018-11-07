

var class1 = [
				{'M': '12:00pm - 12:50pm'},
				{'W': '12:00pm - 12:50pm'},
				{'F': '12:00pm - 12:50pm'}
			];

var class2 = [
				{'M': '11:00am - 11:20am'},
				{'W': '11:00am - 11:20am'},
				{'F': '11:00am - 11:20am'}
			];

var class3 = [
				{'M': '11:30am - 11:50am'},
				{'W': '11:30am - 12:20pm'},
				{'F': '11:30am - 11:50am'}
			];

console.log(overlap(class1, class2));
console.log(overlap(class1, class3));
console.log(overlap(class2, class3));


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
	if (day == "M") return parseInt(convertTime(time)) + 0;
	if (day == "T") return parseInt(convertTime(time)) + 2400;
	if (day == "W") return parseInt(convertTime(time)) + 4800;
	if (day == "R") return parseInt(convertTime(time)) + 7200;
	if (day == "F") return parseInt(convertTime(time)) + 9600;
	if (day == "S") return parseInt(convertTime(time)) +12000;
}


function convertTime(time) {
	var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s?([AaPp][Mm]?)$/)[1];
    var pm = ['P', 'p', 'PM', 'pM', 'pm', 'Pm'];
    var am = ['A', 'a', 'AM', 'aM', 'am', 'Am'];
	
	if (pm.indexOf(AMPM) >= 0 && hours < 12) hours = hours + 12;
	if (am.indexOf(AMPM) >= 0 && hours == 12) hours = hours - 12;
    
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    
	if (hours < 10) sHours = "0" + sHours;
	if (minutes < 10) sMinutes = "0" + sMinutes;
    return (sHours + sMinutes);
}