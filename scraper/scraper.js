#!/usr/bin/node

var request = require('request');
var cheerio = require('cheerio');
const HtmlTableToJson = require('html-table-to-json');
var courses = require('./courses');


const getTerms = new Promise((resolve, reject)=>{
	var termList = [];
	request("https://termmasterschedule.drexel.edu", function(error, response, body) {
		if(error) {
			console.log("Error: " + error);
			reject();
		}
		console.log("Status code: " + response.statusCode);
		var $ = cheerio.load(body);

		/* Term List */
		$('.term').each(function (i, elem){
			var name = $(this).text().trim();
			if(name.includes("Semester")){
				return;
			}
			termList[i] = {"name" : name , "link":"https://termmasterschedule.drexel.edu"+$(elem).find('a').attr('href')};
			return;
		});
		console.log("Success of getting links");
		resolve(termList);
	});
});



function log(msg){
	console.log(JSON.stringify(msg));
}

const getColleges = (list) => {
	return new Promise((resolve, reject)=>{
		var termList = list;
		var promiseArray = [];
		for (var i=0; i<termList.length; i++) {
			promiseArray.push(new Promise((resolve,reject) =>{
				request(termList[i].link, function(error, response, body) {
					if(error) {
						console.log("Error: " + error);
						reject("Broke in getColleges");
						return;
					}
					console.log("Status code: " + response.statusCode);
					var $ = cheerio.load(body);
					/* Term List */
					var colleges = [];
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
	for( var i=0; i<termList.length; i++){
		termList[i].colleges=colleges[i];
	}
	return termList;
}


const getSubjects = (list)=>{
	var termList = list;
	return new Promise((resolve, reject)=>{
		var promiseArray = [];
		for (var i=0; i<termList.length; i++) {
			for(var j=0; j< termList[i].colleges.length; j++){
				promiseArray.push(new Promise((resolve,reject) =>{
					request(termList[i].colleges[j].link, function(error, response, body) {
						if(error) {
							console.log("Error: " + error);
							reject("Broke in get Subjects");
							return;
						}
						console.log("Status code: " + response.statusCode);

						var subjects = [];
						var $ = cheerio.load(body);


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
	var subjectCount = 0;
	for( var i=0; i<termList.length; i++){
		for(var j=0; j< termList[i].colleges.length; j++){
			termList[i].colleges[j].subjects = subjects[subjectCount];
			subjectCount++;
		}
	}
	return termList;
}


const getCourses = (termList) => {
	return new Promise((resolve, reject)=>{
		var promiseArray = [];
		for (var i=0; i<termList.length; i++) {
			for(var j=0; j<termList[i].colleges.length; j++){
				for(var k=0; k<termList[i].colleges[j].subjects.length; k++){
					promiseArray.push(new Promise((resolve,reject) =>{
						request(termList[i].colleges[j].subjects[k].link, function(error, response, body) {//fix in here
										//looks like the links are right but  idk how the rest works
							if(error) {
								console.log("Error: " + error);
								reject("Failed in getCourses");
							}
							var $ ="";

							try{
								$ = cheerio.load(body); //THIS SOMETIMES TIMES OUT SO BECAREFUL
							} catch(error){
								$ = "";
							}

							/* Converts table of courses JSON */
							var tableHTML = $('table').attr('bgcolor', '#cccccc').html();
							const html = String(tableHTML);
							const jsonTables = new HtmlTableToJson(html);
							var parsedTable = jsonTables['results'];
							var classes = [];
							/* Finds correct JSON array */
							var max = 0;
							for (var i=0; i<parsedTable.length; i++){
								if (parsedTable[i].length > parsedTable[max].length){
									max = i;
								}
							}

							/* Removes extraneous elements */
							for (var i=0; parsedTable[max] != undefined && i<parsedTable[max].length; i++){ // added the undefined comparison as it kept throwing errorrs(I think the table is empty sometimes)
								if (Object.keys(parsedTable[max][i]).length > 10 && Object.keys(parsedTable[max][i]).length < 14){
									parsedTable[max][i] = swap(parsedTable[max][i], String(Object.keys(parsedTable[max][i]).length), "8")
									delete parsedTable[max][i][Object.keys(parsedTable[max][i]).length];
									var times = '';

									/* Formats day and time */
									for (var j=9; j<Object.keys(parsedTable[max][i]).length; j+=2){
										times+=(parsedTable[max][i][j]+ '   ' + parsedTable[max][i][j+1] + '    ');
									}
									var a = parsedTable[max][i];
									
									/* Creates class with class details */
									var temp = new Course(a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], times);
									classes.push(temp.toJSON());
								}
							}
							resolve(classes);
						})
					}));
				}
			}
		}
		Promise.all(promiseArray).then((allCourses)=>{resolve(combineCourses(termList,allCourses))},reject);
	});
}

function combineCourses(termList, allCourses){//might work might not, haven't been able to test it
	var coursesCount = 0;
	for (var i=0; i<termList.length; i++) {
		for(var j=0; j<termList[i].colleges.length; j++){
			for(var k=0; k<termList[i].colleges[j].subjects.length; k++){
				termList[i].colleges[j].subjects[k].courses = allCourses[coursesCount];
				coursesCount++;
			}
		}
	}
	console.log(JSON.stringify(termList));
	return termList;
}


getTerms.then(getColleges,log).then(getSubjects, log).then(getCourses,log).then(log,log);


class Course {
	constructor(subject, number, instrType, instrMethod, section, crn, descr, instructor, time) {
		this.subject = subject;
		this.number = number;
		this.instrType = instrType;
		this.instrMethod = instrMethod;
		this.section = section;
		this.crn = crn;
		this.descr = descr;
		this.instructor = instructor;
		this.time = time;
	}

	toJSON() {
	    return {
	    	subject: this.subject,
			number: this.number,
			instrType: this.instrType,
			instrMethod: this.instrMethod,
			section: this.section,
			crn: this.crn,
			descr: this.descr,
			instructor: this.instructor,
			time: this.time
	    };
	  }
}

function swap(obj,index1,index2){
    var temp = obj[index1];
    obj[index1] = obj[index2];
    obj[index2] = temp;
    return obj;
}




		



// console.log(addParameters("/webtms_du/app?component=semesterTermDetailsLast&page=Home&service=direct&sp=ZH4sIAAAAAAAAADWMTQ6CMBCFR4w%2Fa3UvF7BQN5i41LjqDi4w0gnBtFjaUVl5Iq%2FmHYQQ3%2FJ733ufL8yChy3ph9CeOjKi9ixedGUbhEZGUZC3MGYSwVTBAksuaksMG3XDJyahNckAAqN1RwVL7ienu%2B6N1WgYbKokZ1831b8%2FUyhbeEPUOccw36cyk5JhfUFj4pyGN%2FKxzHby8AMRjsWzpQAAAA%3D%3D"));
function addParameters(params){
console.log(params.substring(params.indexOf("webtms_du/app")+("webtms_du/app").length));
}