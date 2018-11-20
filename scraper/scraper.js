#!/usr/bin/node

let request = require('request');
let cheerio = require('cheerio');
const HtmlTableToJson = require('html-table-to-json');


const getTerms = new Promise((resolve, reject)=>{
	console.log("Starting getTerms()");
	let termList = [];
	request("https://termmasterschedule.drexel.edu", function(error, response, body) {
		if(error) {
			console.log(error);
			reject();
			return
		}
		let $ = cheerio.load(body);

		/* Term List */
		$('.term').each(function (i, elem){
			let name = $(this).text().trim();
			if(name.includes("Semester")){
				return;
			}
			termList[i] = {"name" : name , "link":"https://termmasterschedule.drexel.edu"+$(elem).find('a').attr('href')};
			return;
		});
		console.log("Success in getTerms()");
		resolve(termList.slice(2,4));//0,4));//first 4 as they are the ones we care about ie current year
	});
});



function log(msg){
	console.log(JSON.stringify(msg));
}

const getColleges = (list) => {
	return new Promise((resolve, reject)=>{
		console.log("Starting getColleges()");
		let termList = list;
		let promiseArray = [];
		for (let i=0; i<termList.length; i++) {
			promiseArray.push(new Promise((resolve,reject) =>{
				request(termList[i].link, function(error, response, body) {
					if(error) {
						console.log(error);
						reject("Broke in getColleges");
						return;
					}
					let $ = cheerio.load(body);
					/* Term List */
					let colleges = [];
					$('#sideLeft a').each(function (i, elem){
						colleges.push({"name" : $(elem).text() , "link": "https://termmasterschedule.drexel.edu"+$(elem).attr('href')});

					});
					resolve(colleges);
				})
			}));
		}
		Promise.all(promiseArray).then((allColleges)=>{resolve(combineColleges(termList,allColleges))},reject);
	});
}


function combineColleges(termList, colleges){
	for( let i=0; i<termList.length; i++){
		termList[i].colleges=colleges[i];
	}
	console.log("Succes in getColleges");
	return termList;
}


const getSubjects = (list)=>{
	let termList = list;
	return new Promise((resolve, reject)=>{
		console.log("Starting getSubjects");
		let promiseArray = [];
		for (let i=0; i<termList.length; i++) {
			for(let j=0; j< termList[i].colleges.length; j++){
				promiseArray.push(new Promise((resolve,reject) =>{
					request(termList[i].colleges[j].link, function(error, response, body) {
						if(error) {
							console.log(error);
							reject("Broke in get Subjects");
							return;
						}

						let subjects = [];
						let $ = cheerio.load(body);


						/* Save subject names and links */
						$('.odd').each(function (j, elem){
							subjects.push({"name" : $(elem).find('a').text(), "link":"https://termmasterschedule.drexel.edu"+$(elem).find('a').attr('href')});
						});
						$('.even').each(function (j, elem){
							subjects.push({"name" : $(elem).find('a').text(), "link":"https://termmasterschedule.drexel.edu"+$(elem).find('a').attr('href')});
						});
						resolve(subjects);
					});
				}));
			}
		}
		Promise.all(promiseArray).then((allSubjects)=>{resolve(combineSubjects(termList,allSubjects))},reject);
	});
}

function combineSubjects(termList, subjects) {
	let subjectCount = 0;
	for( let i=0; i<termList.length; i++){
		for(let j=0; j< termList[i].colleges.length; j++){
			termList[i].colleges[j].subjects = subjects[subjectCount];
			subjectCount++;
		}
	}
	console.log("Succes in getSubjects");
	return termList;
}

async function getCourses(termList){
	console.log("Starting getCourses");
	let allCourses = [];
	for (let i=0; i<termList.length; i++) {
		for(let j=0; j<termList[i].colleges.length; j++){
			for(let k=0; k<termList[i].colleges[j].subjects.length; k++){
				let link = termList[i].colleges[j].subjects[k].link;
				console.log("Getting courses from Link:\n" + link);
				let temp = await getCoursesFromLink(link);
				allCourses.push(temp);
			}
		}
	}
	console.log("Resolving all courses");
	return combineCourses(termList,allCourses);
}


function getCoursesFromLink(link){
	return new Promise((resolve,reject) =>{
		request(link, function (error, response, html) {
			let allCourses = [];
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
			}
			resolve(allCourses);
		});
	});
}


function makeCourse(details) {
	if(details.length != 9){
		return undefined;
	}
	return {
		"Subject" : details[0],
		"Number" : details[1],
		"Type": details[2],
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





function combineCourses(termList, allCourses){
	console.log("Entered combineCourses()");
	let coursesCount = 0;
	for (let i=0; i<termList.length; i++) {
		for(let j=0; j<termList[i].colleges.length; j++){
			for(let k=0; k<termList[i].colleges[j].subjects.length; k++){
				termList[i].colleges[j].subjects[k].courses = allCourses[coursesCount];
				coursesCount++;
			}
		}
	}
	console.log("Success in getCourses");
	return termList;
}

let fs = require('fs');


function saveJSON(termList){
	let data = JSON.stringify(termList);

	fs.writeFile('testing123.txt', data, function(err, data){
	    if (err) console.log(err);
	    console.log("Successfully Written to File.");
	});

}


getTerms.then(getColleges,log).then(getSubjects, log).then(getCourses,log).then(saveJSON, log);

