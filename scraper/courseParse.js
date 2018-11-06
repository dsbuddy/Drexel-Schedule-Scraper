var fs = require('fs');
var cheerio = require('cheerio');
var Crawler = require("crawler");
var HtmlTableToJson = require('html-table-to-json');


var allClasses = [];
var i =0;
 
var c = new Crawler({
    rateLimit: 125,
    maxConnections: 1,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log("Failure: " + i);
            console.log(error);
        }else{
        	console.log("Success: " + i);
        	i++;
            allClasses.push(parseCourse(res.body));
        }
        done();
    }
});


function parseCourse(body){
	try{
		$ = cheerio.load(body); //THIS SOMETIMES TIMES OUT SO BECAREFUL
	} catch(error){
		$ = "";
	}

	/* Converts table of courses JSON */
	var tableHTML = $('table').attr('bgcolor', '#cccccc').html();
	var html = String(tableHTML);
	var jsonTables = new HtmlTableToJson(html);
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
	for (var l=0; parsedTable[max] != undefined && l<parsedTable[max].length; l++){ // added the undefined comparison as it kept throwing errorrs(I think the table is empty sometimes)
		if (Object.keys(parsedTable[max][l]).length > 10 && Object.keys(parsedTable[max][l]).length < 14){
			parsedTable[max][l] = swap(parsedTable[max][l], String(Object.keys(parsedTable[max][l]).length), "8")
			delete parsedTable[max][l][Object.keys(parsedTable[max][l]).length];
			var times = '';

			/* Formats day and time */
			for (var m=9; m<Object.keys(parsedTable[max][i]).length; m+=2){
				times+=(parsedTable[max][l][m]+ '   ' + parsedTable[max][l][m+1] + '    ');
			}
			var a = parsedTable[max][l];
			
			/* Creates class with class details */
			var temp = new Course(a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], times);
			classes.push(temp.toJSON());
		}
	}
	return classes;
}

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



function readJSON(){
	fs.readFile('temp.txt', function(err, buf) {
	termList = JSON.parse(buf.toString());
	// console.log(termList);
	var links = [];
	for (x in termList){
 	  	for (college in termList[x]["colleges"]){
 	  		for (subject in termList[x]["colleges"][college]["subjects"]){
	  	  			var temp = termList[x]["colleges"][college]["subjects"][subject]["link"];
	  	  			links.push(temp);
	  	  			// console.log(temp);
	  	  		}
	  	  	}
	  }
	console.log(links.length);
	
	});
}

readJSON();