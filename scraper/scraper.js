#!/usr/bin/node

let request = require('request');
let cheerio = require('cheerio');

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
		resolve(termList.slice(0,1));//0,4));//first 4 as they are the ones we care about ie current year
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
						// CCI ONLY TO TEST
						if (i == 5) {
						colleges.push({"name" : $(elem).text() , "link": "https://termmasterschedule.drexel.edu"+$(elem).attr('href')});

						}

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
	console.log("Success in getColleges");
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
	console.log("Success in getSubjects");
	return termList;
}

async function getCourses(termList){
	console.log("Starting getCourses");
	let allCourses = [];
	let allLinks = [];
	for (let i=0; i<termList.length; i++) {
		for(let j=0; j<termList[i].colleges.length; j++){
			for(let k=0; k<termList[i].colleges[j].subjects.length; k++){
				let link = termList[i].colleges[j].subjects[k].link;
				console.log("Getting courses from Link:\n" + link);

				let linkCourses = [];

				let temp = await getCoursesFromLink(link);
				console.log(temp);

				for (let l=0; l<temp.length; l++) {
					console.log("Parsing: " + temp[l]);
					let courseFinal = await parseCoursePage(temp[l]);
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					console.log(courseFinal);
					for (course in courseFinal) {
						allCourses.push(courseFinal[course]);
					}
					// allCourses.push(courseFinal);
				}

				// allCourses.push(linkCourses);
				



				// allCourses.push(temp);
				// for (let l=0; l<temp.length; l++) {
				// 	allLinks.push(temp[l]);

				// 	// New below
				// 	let coursePageRes = await parseCoursePage(temp[l]);
				// 	allCourses.push(coursePageRes[0]);
				// 	console.log('---------------------');
				// 	console.log(coursePageRes[0]);
				// 	console.log('---------------------');

				// 	// New above
				// }
			}
		}
	}

	console.log(allCourses.length);

	// // Add Below
	// console.dir(allLinks);
	// for (let i=0; i<allLinks.length; i++) {
	// 	console.log("Getting info from " + allLinks[i]);
	// 	let coursePageRes = await parseCoursePage(allLinks[i]);
	// 	// for (course in coursePageRes) {
	// 		// allCourses.push(coursePageRes[course]);
	// 	// }
	// 	allCourses.push(coursePageRes);
	// }

	console.log("Resolving all courses");
	return combineCourses(termList,allCourses);
}


function getCoursesFromLink(link){
	return new Promise((resolve,reject) =>{
		request(link, function (error, response, html) {
			let allLinks = [];
			if (!error && response.statusCode == 200) {
			    var $ = cheerio.load(html);
			    $.root().contents().filter(function() { return this.type === 'comment'; }).remove();
			    $('table').attr('bgcolor', '#cccccc').find('.even').each(function (i, element) {
			   		let temp = [];
					$(this).children('td').each(function (j, element) {
						if (j == 5) {
							var linkTemp = $(this).children('p').html();
							var reg = /<a href=([^>]+)>((?:.(?!\<\/a\>))*.)<\/a>/g;
							var match = reg.exec(linkTemp);
							var final = match[1].replace(/&amp;/g, "&");
							final = 'https://termmasterschedule.drexel.edu' + final;
							final = final.replace(/"/g, '');
							// HAS LINK TO COURSE BELOW
							allLinks.push(final);
						}
						});
				});
			    $('table').attr('bgcolor', '#cccccc').find('.odd').each(function(i, element){
					$(this).children('td').each(function (j, element) {
						if (j == 5) {
							var linkTemp = $(this).children('p').html();
							var reg = /<a href=([^>]+)>((?:.(?!\<\/a\>))*.)<\/a>/g;
							var match = reg.exec(linkTemp);
							var final = match[1].replace(/&amp;/g, "&");
							final = 'https://termmasterschedule.drexel.edu' + final;
							final = final.replace(/"/g, '');
							// HAS LINK TO COURSE BELOW
							allLinks.push(final);
						}
						});
			    });
			}
			resolve(allLinks);
		});
	});
}

function parseCoursePage(link) {
	return new Promise((resolve,reject) =>{
	    // let listLinks = [];
		let allCourses = [];
		// var finalCourse;
		request(link, function (error, response, html) {
			if (!error && response.statusCode == 200) {
			    var $ = cheerio.load(html);
			    
			    // Details is used to parse course from array to JSON
			    var details = [];

			    // Gets CRN, Subject, Course Number, Section, Credits, Title, Campus, Instructor, Type, Method, Max Enroll, Enroll, Section Comments, Textbook
			     $('table[bgcolor="#cccccc"]').find('tr > td').each(function(i, elem) {
				    switch (i) {
					  case 1:
					  // CRN
					  	details.splice(0,details.length);
					  	details.push($(this).html());
					    break;
					  case 3:
					  // Subject
					  	details.push($(this).html());
					  	break;
					  case 5:
					  // Course Number
					  	details.push($(this).html());
					  	break;
					  case 7:
					  // Section
					  	details.push($(this).html());
					  	break;
					  case 9:
					  // Credits
					  	details.push(($(this).html().trim()));
					  	break;
					  case 11:
					  // Course Name
					  	details.push(($(this).html()));
					  	break;
					  case 13:
					  // Campus
					  	details.push(($(this).html()));
					  	break;
					  case 15:
					  // Instructors
					  	details.push(($(this).html()));
					  	break;
					  case 17:
					  // Method
					  	details.push(($(this).html()));
					  	break;
					  case 19:
					  // Type
					  	details.push(($(this).html()));
					  	break;
					  case 21:
					  // Max Enroll
					  	details.push(($(this).html()));
					  	break;
					  case 23:
					  // Current Enroll
					  	details.push(($(this).html()));
					  	break;
					  case 26:
					  // Section comments
					  	details.push(($(this).html()));
					  	break;
					  case 28:
					  // Textbook
					  	details.push(($(this).find('a').attr('href')));
					  	break;
					}
				 });


				 // timeStr is used for parsing time to expected format
				 var timeStr = "";

			    // Gets Times, Days, Building, Room
				 $('tr[class="even"]').find('td').each(function(i, elem) {
				    switch (i) {
					  case 2:
					  // Times
					  	timeStr = ""
					  	timeStr += $(this).html();
					    // console.log($(this).html());
					    break;
					  case 3:
					  // Days
					  	var temp = $(this).html() + "\n";
					  	timeStr = timeStr.replace(/^/, temp);
					  	// console.log($(this).html());
					  	// console.log(timeStr);
					  	details.push((extractTime(timeStr)));
					  	break;
					  case 4:
					  // Building
					  	details.push(($(this).html()));
					  	break;
					  case 5:
					  // Room
					  	details.push(($(this).html()));
					  	break;
					  }
				});

				// Gets Description
				 $('table[class="descPanel"]').find('div').each(function(i, elem) {
				    switch (i) {
					  case 0:
					  // CourseDescription
					    details.push(($(this).html()));
					    
					    // finalCourse is result of JSON format of class
					    finalCourse = makeCourse(details);
					    console.log(finalCourse);

					    // Pushes course to allCourses array
					    allCourses.push(finalCourse);

					    // Clears details array for next course
					    details.splice(0,details.length);
					    break;
					  }
				});

			}
			resolve(allCourses);
		});
	});

}


function makeCourse(details) {
	if(details.length != 18){
		return undefined;
	}

	return {
		"Subject" : details[1],
		"Number" : details[2],
		"Type" : details[8],
		"Method" : details[9],
		"Section" : details[3],
		"CRN" : details[0],
		"Title" : details[5],
		"Times" : details[14],
		"Instructor" : details[7],
		"Building" : details[15],
		"Room" : details[16],
		"Campus" : details[6],
		"Credits" : details[4],
		"Enroll" : details[11],
		"Max_Enroll" : details[10],
		"Section_Comments" : details[12],
		"Textbook" : details[13],
		"Description" : details[17]
	}

	// Old json
	// return {
	// 	"Subject" : details[0],
	// 	"Number" : details[1],
	// 	"Type": details[2],
	// 	"Method" : details[3],
	// 	"Section" : details[4],
	// 	"CRN" : details[5],
	// 	"Description" : details[6],
	// 	"Times" : extractTime(details[7]),
	// 	"Instructor" : details[8]
	// }
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

	// console.log(allCourses.length);
	saveJSON2(allCourses);
	// console.log(allCourses);

	let coursesCount = 0;
	for (course in allCourses) {
		for (let i=0; i<termList.length; i++) {
			for (let j=0; j<termList[i].colleges.length; j++) {
				for (let k=0; k<termList[i].colleges[j].subjects.length; k++) {
					console.log(i + ", " + j + ", " + k);
					termList[i].colleges[j].subjects[k].courses = allCourses[coursesCount];
					coursesCount++;
				}
			}
		}
	}
	// let coursesCount = 0;
	// for (let i=0; i<termList.length; i++) {
	// 	for(let j=0; j<termList[i].colleges.length; j++){
	// 		for(let k=0; k<termList[i].colleges[j].subjects.length; k++){
	// 			termList[i].colleges[j].subjects[k].courses = allCourses[coursesCount];
	// 			coursesCount++;
	// 		}
	// 	}
	// }

	console.log(coursesCount);
	console.log("Success in getCourses");
	return termList;
}

let fs = require('fs');

function saveJSON2(termList){
	let data = JSON.stringify(termList);
	//should be called from server which has it's home dir in /server/
	fs.writeFile('../scraper/type.json', data, function(err, data){
	    if (err) console.log(err);
	    console.log("Successfully Written to File.");
	});

}

function saveJSON(termList){
	let data = JSON.stringify(termList);
	//should be called from server which has it's home dir in /server/
	fs.writeFile('../scraper/courses.json', data, function(err, data){
	    if (err) console.log(err);
	    console.log("Successfully Written to File.");
	});

}


getTerms.then(getColleges,log).then(getSubjects, log).then(getCourses,log).then(saveJSON, log);

