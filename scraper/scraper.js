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
		resolve(termList.slice(2,3));//0,4));//first 4 as they are the ones we care about ie current year
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
				let temp = await getCourseFromLink(link);
				allCourses.push(temp);
			}
		}
	}
	console.log("Resolving all courses");
	return combineCourses(termList,allCourses);
}


function getCourseFromLink(link){
	return new Promise((resolve,reject) =>{
		request(link, function (error, response, html) {
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(html);
				let allCourses = [];
				$('table').attr('bgcolor', '#cccccc').find('.even').each(function(i, element){
					var a = $(this).prev().html();
					if ((a != null) && (!(String(a).includes('CRN')))) {
						if(parseCourse(a).Description==undefined) {
							return;	
						}
						allCourses.push(parseCourse(a));	
					}
				});
				$('table').attr('bgcolor', '#cccccc').find('.odd').each(function(i, element){
					var a = $(this).prev().html();
					if ((a != null) && (!(String(a).includes('CRN')))) {
						if(parseCourse(a).Description==undefined) {
							return;	
						}
						allCourses.push(parseCourse(a));	
					}
				});
				console.log("\n------------------------------------------------\n" + JSON.stringify(allCourses) + "\n------------------------------------------------\n");
				resolve(allCourses);
			}else{
				console.log(error);
				resolve([error]);
			}
		});
	})
}

function parseCourse(course) {
	var temp = []
	var courseJSON = {};
	var lines = course.split('\n');
	var start = 0;
	var end = 0;
	for(var i = 0;i < lines.length;i++){
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
			let x = {};
			let days = extractFromTag(lines[i], 'td');//days of week MTWRF
			for(let charIndex = 0; charIndex < days.length; charIndex++){
				x[days.charAt(charIndex)] = extractFromTag(lines[i+1], 'td');
			}
			times.push(x);
			i++;
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

function combineCourses(termList, allCourses){//might work might not, haven't been able to test it
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
    let temp = obj[index1];
    obj[index1] = obj[index2];
    obj[index2] = temp;
    return obj;
}








// console.log(addParameters("/webtms_du/app?component=semesterTermDetailsLast&page=Home&service=direct&sp=ZH4sIAAAAAAAAADWMTQ6CMBCFR4w%2Fa3UvF7BQN5i41LjqDi4w0gnBtFjaUVl5Iq%2FmHYQQ3%2FJ733ufL8yChy3ph9CeOjKi9ixedGUbhEZGUZC3MGYSwVTBAksuaksMG3XDJyahNckAAqN1RwVL7ienu%2B6N1WgYbKokZ1831b8%2FUyhbeEPUOccw36cyk5JhfUFj4pyGN%2FKxzHby8AMRjsWzpQAAAA%3D%3D"));
function addParameters(params){
console.log(params.substring(params.indexOf("webtms_du/app")+("webtms_du/app").length));
}
