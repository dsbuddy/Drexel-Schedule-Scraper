
function updateEvents(indx) {
	var events = [];
	var colors = ['#e6194B', '#f58231', '#800000', '#000075', '#3cb44b', '#42d4f4', '#4363d8', '#911eb4', '#f032e6', '#000000', '#9A6324', '#469990'];
	var courses = allSchedules[indx];
	// var courses = JSON.parse('[{"subject":"CS","number":"260","instrType":"Lecture","instrMethod":"Face to Face","section":"002","crn":"21663","descr":"Data Structures","instructor":"Kurt Schmidt","time":[{"M":"2:00pm - 2:50pm"},{"W":"2:00pm - 2:50pm"},{"F":"2:00pm - 2:50pm"}]},{"subject":"CS","number":"283","instrType":"Lecture","instrMethod":"Face to Face","section":"001","crn":"21356","descr":"Systems Programming","instructor":"Constantine Katsinis","time":[{"M":"6:00pm - 8:50pm"}]},{"subject":"MATH","number":"221","instrType":"Lecture","instrMethod":"Face to Face","section":"001","crn":"20095","descr":"Discrete Mathematics","instructor":"Marci A Perlstadt","time":[{"M":"9:00am - 9:50am"},{"W":"9:00am - 9:50am"},{"F":"9:00am - 9:50am"}]},{"subject":"MATH","number":"T480","instrType":"Lecture","instrMethod":"Face to Face","section":"001","crn":"25862","descr":"Theory of Computation","instructor":"Robert A Hicks","time":[{"M":"1:00pm - 1:50pm"},{"W":"1:00pm - 1:50pm"},{"F":"1:00pm - 1:50pm"}]},{"subject":"BIO","number":"349","instrType":"Lecture","instrMethod":"Face to Face","section":"001","crn":"23098","descr":"Behavioral Neuroscience","instructor":"Michael R Akins, Anna Denise R Garcia","time":[{"T":"12:30pm - 1:50pm"},{"R":"12:30pm - 1:50pm"}]},{"subject":"PHIL","number":"311","instrType":"Lecture","instrMethod":"Face to Face","section":"130","crn":"21728","descr":"Ethics and Information Technology","instructor":"Roger J Magyar","time":[{"W":"3:30pm - 4:50pm"}]}]');

	for (var j=0; j<courses.length; j++) {
		var course = courses[j];
		var times = course.time;
		for (var i=0; i < times.length; i++) {
			for (day in times[i]) {
				var start = createDate(day, times[i][day].split(" - ")[0]).getTime();
				var end = createDate(day, times[i][day].split(" - ")[1]).getTime();
				var content = createContent(course);
				events.push(createEvent(course.subject + " " + course.number, start, end, colors[j], content));
			}
		}

	}
	return events;
}

function createContent(course) {
	var res = '';
	res += course.descr + ' - ' + course.instructor;
	return res;
}

function createEvent(title, start, end, color, content) {
	var event = {
		title: title,
		start: start,
		end: end,
		color: color,
		description: content
	};
	return event
}


function createDate(day, time) {
	var event = new Date();
	time = convertTime(time);
	switch(day) {
		case "M":
			event.setFullYear(2017, 0, 2);
			break;
		case "T":
			event.setFullYear(2017, 0, 3);
			break;
		case "W":
			event.setFullYear(2017, 0, 4);
			break;
		case "R":
			event.setFullYear(2017, 0, 5);
			break;
		case "F":
			event.setFullYear(2017, 0, 6);
			break;
		case "S":
			event.setFullYear(2017, 0, 7);
			break;
	}
	event.setHours(time.substring(0,2));
	event.setMinutes(time.substring(2));
	event.setSeconds(0);
	event.setMilliseconds(0);
	return event;
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

function updateTitle(indx) {
	$("#scheduleNum").html("<center><h1>Schedule " + String(indx+1) + " / " + String(allSchedules.length-1) + "</h1></center>");
}


$(document).ready(function() {
	var indx = 0;
	/* Change to next schedule */
	$('.next').click(function() {
		if (indx < (allSchedules.length - 2)) {
			indx++;
			$('#calendar').fullCalendar('removeEvents');
			$('#calendar').fullCalendar('addEventSource', updateEvents(indx));
			updateTitle(indx);
		}
	});
	/* Change to previous schedule */
	$('.previous').click(function() {
		if (indx > 0) {
			indx--;
			$('#calendar').fullCalendar('removeEvents');
			$('#calendar').fullCalendar('addEventSource', updateEvents(indx));
			updateTitle(indx);
		}
	});
	updateTitle(indx);

	/* Calendar Object */
	$('#calendar').fullCalendar({
		header: {
			left: '',
			center: '',
			right: '',
		},
		defaultDate: '2017-01-01',
		defaultView: 'agendaWeek',
		allDaySlot: false,
		columnHeaderFormat: 'ddd',
		minTime: '7:00',
		maxTime: '23:00',
		events: updateEvents(indx),
		timezone: 'local',
		eventRender: function(eventObj, $el) {
			$el.popover({
			title: eventObj.description.split(' - ')[0],
			content: eventObj.description.split(' - ')[1],
			trigger: 'hover',
			placement: 'top',
			container: 'body'
			});
		}
	});
});
