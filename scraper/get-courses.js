#!/usr/bin/node

var request = require('request');
var cheerio = require('cheerio');



// let url = 'https://termmasterschedule.drexel.edu/webtms_du/app?component=subjectDetails&page=CollegesSubjects&service=direct&sp=ZH4sIAAAAAAAAAFvzloG1uIhBPjWlVC%2BlKLUiNUcvs6hErzw1qSS3WC8lsSRRLyS1KJcBAhiZGJh9GNgTk0tCMnNTSxhEfLISyxL1iwtz9EECxSWJuQXWPgwcJUAtzvkpQBVCEBU5iXnp%2BsElRZl56TB5l9Ti5EKGOgamioKCEgY2IwNDCyNToJHhmXlAaYXA0sQiEG1ooWtoCQAiXVdwpgAAAA%3D%3D&sp=SA&sp=SANIM&sp=0';
let url = 'https://termmasterschedule.drexel.edu/webtms_du/app?component=subjectDetails&page=CollegesSubjects&service=direct&sp=ZH4sIAAAAAAAAAFvzloG1uIhBPjWlVC%2BlKLUiNUcvs6hErzw1qSS3WC8lsSRRLyS1KJcBAhiZGJh9GNgTk0tCMnNTSxhEfLISyxL1iwtz9EECxSWJuQXWPgwcJUAtzvkpQBVCEBU5iXnp%2BsElRZl56TB5l9Ti5EKGOgamioKCEgY2IwNDC2NToJHBBSBVCoGliUVAZQqGFrqGlgCmlbtMpgAAAA%3D%3D&sp=SA&sp=SANIM&sp=0';

let allCourses = [];

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {

    var $ = cheerio.load(html);
    $.root().contents().filter(function() { return this.type === 'comment'; }).remove();

    $('table').attr('bgcolor', '#cccccc').find('.even').each(function (i, element) {
   		let temp = [];
		$(this).children('td').each(function (j, element) {
			temp.push($(this).text());
			});
		let course = makeCourse(temp);
		if(course !== undefined){
			allCourses.push(course);
		}
	});
    $('table').attr('bgcolor', '#cccccc').find('.odd').each(function(i, element){
    	let temp = [];
		$(this).children('td').each(function (j, element) {
			temp.push($(this).text());
			});
		let course = makeCourse(temp);
		if(course !== undefined){
			allCourses.push(course);
		}
    });
    console.log(JSON.stringify(allCourses));
  }
});

function makeCourse(details) {
	if(details.length != 9){
		return undefined;
	}
	return {
		"Subject" : details[0],
		"Number" : details[1],
		"Type" : details[2],
		"Method" : details[3],
		"Section" : details[4],
		"CRN" : details[5],
		"Description" : details[6],
		"Times" : extractTime(details[7]),
		"Instructor" : details[8]
	}
}



function extractTime(lines) {
	lines = lines.split("\n");
	let temp = [];
	for(line in lines){
		let a = lines[line].replace(/\s*/g,"");
		if(a != ""){
			temp.push(a);
		}
	}
	lines = temp;
	let times = {};
	for(var i = 0; i< lines.length; i+=2){
		for(let charIndex = 0; charIndex < lines[i].length; charIndex++){
			times[lines[i].charAt(charIndex)] = lines[i+1];
		}
	}
	return times;	
}