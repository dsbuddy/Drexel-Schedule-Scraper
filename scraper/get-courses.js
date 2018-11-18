var request = require('request');
var cheerio = require('cheerio');

var allCourses = [];

// var url = 'https://termmasterschedule.drexel.edu/webtms_du/app?component=subjectDetails&page=CollegesSubjects&service=direct&sp=ZH4sIAAAAAAAAAFvzloG1uIhBPjWlVC%2BlKLUiNUcvs6hErzw1qSS3WC8lsSRRLyS1KJcBAhiZGJh9GNgTk0tCMnNTSxhEfLISyxL1iwtz9EECxSWJuQXWPgwcJUAtzvkpQBVCEBU5iXnp%2BsElRZl56TB5l9Ti5EKGOgamioKCEgY2IwNDCyNToJHhmXlAaYXA0sQiEG1ooWtoCQAiXVdwpgAAAA%3D%3D&sp=SCI&sp=SCS&sp=5';
var url = 'https://termmasterschedule.drexel.edu/webtms_du/app?component=subjectDetails&page=CollegesSubjects&service=direct&sp=ZH4sIAAAAAAAAAFvzloG1uIhBPjWlVC%2BlKLUiNUcvs6hErzw1qSS3WC8lsSRRLyS1KJcBAhiZGJh9GNgTk0tCMnNTSxhEfLISyxL1iwtz9EECxSWJuQXWPgwcJUAtzvkpQBVCEBU5iXnp%2BsElRZl56TB5l9Ti5EKGOgamioKCEgY2IwNDCyNToJHhmXlAaYXA0sQiEG1ooWtoCQAiXVdwpgAAAA%3D%3D&sp=SAS&sp=SHUM&sp=1';

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {

    var $ = cheerio.load(html);
    // console.log($);

    $('table').attr('bgcolor', '#cccccc').find('.even').each(function(i, element){
    	var a = $(this).html();
    	if ((a != null) && (!(String(a).includes('CRN')))) {
    		if(parseCourse(a).Description==undefined) {
    			return;	
    		}
    		allCourses.push(parseCourse(a));	
    	}
    });
    $('table').attr('bgcolor', '#cccccc').find('.odd').each(function(i, element){
    	var a = $(this).html();
    	if ((a != null) && (!(String(a).includes('CRN')))) {
    		if(parseCourse(a).Description==undefined) {
    			return;	
    		}
    		allCourses.push(parseCourse(a));	
    	}
    });
    console.log(allCourses);
  }
});


function parseCourse(course) {
	var temp = []
	var courseJSON = {};
	var lines = course.split('\n');
	var start = 0;
	var end = 0;
	for(var i = 0;i < lines.length;i++){
		if (lines[i].includes('a') && ((extractFromTag(lines[i], 'a') != undefined))) courseJSON['CRN'] = (extractFromTag(lines[i], 'a'));
		if (lines[i].includes('td') && ((extractFromTag(lines[i], 'td') != undefined) && (temp.length <6))) {
	    		switch (temp.length){
	    			case 0:
	    				courseJSON['Subject'] = (extractFromTag(lines[i], 'td'));
	    				break;
    				case 1:
	    				courseJSON['Number'] = (extractFromTag(lines[i], 'td'));
	    				break;
    				case 2:
	    				courseJSON['Type'] = (extractFromTag(lines[i], 'td'));
	    				break;
    				case 3:
	    				courseJSON['Method'] = (extractFromTag(lines[i], 'td'));
	    				break;
    				case 4:
	    				courseJSON['Section'] = (extractFromTag(lines[i], 'td'));
	    				break;
    				case 5:
	    				courseJSON['Description'] = (extractFromTag(lines[i], 'td'));
	    				break;
	    		}
	    	temp.push(extractFromTag(lines[i], 'td'));
		}
		if (start == 0 && lines[i].includes('<tr')) {
			start = i;
		}
		if (lines[i].includes('<\/tr')) {
			end = i;
		}
	}
	courseJSON['Times'] = extractTime(lines, start, end);
	return courseJSON;
}

function extractTime(lines, start, end) {
	var times = [];
	for (var i=start; i<=end; i++) {
		if (lines[i].includes('td')) {
			var text = extractFromTag(lines[i], 'td');
			times.push(text);
		}
	}
	return times;
}




function extractFromTag(str, tag) {
	var reg = '<'+tag+'.*>([^<]+)<\/'+tag+'>';
	var re = new RegExp(reg,"g");
	var arr = re.exec(str);
	if (arr != null) return arr[1];
}