#! /usr/bin/node
//sets database properly if run localc vs server
if(process.env.CLEARDB_DATABASE_URL === undefined){
	require('dotenv').config();
}
//using express
var express = require("express");

var app = express();
//home path
app.use(express.static("server/"));
//use port specified
app.set('port', (process.env.PORT || 8080));
//bodyparser for post requests
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//to get files on server
var fs = require("fs");

//connect to mysql database
var mysql = require("mysql");
//using pools
let pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL);
//logging purposes
pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});
//logging purposes
pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});
//logging purposes
pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});

//homepage
app.get("/",(req,res)=>{
	res.write(fs.readFileSync(__dirname + "/resources/html/index.html"));
	res.end();
});

//homepage
app.get("/index", (req,res)=>{
	res.write(fs.readFileSync(__dirname + "/resources/html/index.html"));
	res.end();
});

//select courses page
app.get("/select", (req,res)=>{
	res.write(fs.readFileSync(__dirname + "/resources/html/select.html"));
	res.end();
});

//tms page
app.get("/table", (req,res)=>{
	res.write(fs.readFileSync(__dirname + "/resources/html/table.html"));
	res.end();
});

//about page
app.get("/about", (req,res)=>{
	res.write(fs.readFileSync(__dirname + "/resources/html/about.html"));
	res.end();
});

//api for getting term information
app.get('/tms', function(req, res) {
	if (Object.keys(req.query).length === 0) {
		res.status(400);
		res.send("No parameters provided");
	} else {
		var query = "SELECT * FROM updated_courses WHERE";
		var params = [];
		console.log("TMS Get Request\nParameters Sent: " + JSON.stringify(req.query));
		if(req.query.term !== undefined) params.push(["term", pool.escape(req.query.term)]);
		if(req.query.college !== undefined) params.push(["college", pool.escape(req.query.college)]);
		if(req.query.subject !== undefined) params.push(["subject", pool.escape(req.query.subject)]);
		if(req.query.number !== undefined) params.push(["number", pool.escape(req.query.number)]);
		if(req.query.type !== undefined) params.push(["type", pool.escape(req.query.type)]);
		if(req.query.method !== undefined) params.push(["method", pool.escape(req.query.method)]);
		if(req.query.section !== undefined) params.push(["section", pool.escape(req.query.section)]);
		if(req.query.crn !== undefined) params.push(["crn", pool.escape(req.query.crn)]);
		if(req.query.description !== undefined) params.push(["description", pool.escape(req.query.description)]);
		if(req.query.times !== undefined) params.push(["times", pool.escape(req.query.times)]);
		if(req.query.instructor !== undefined) params.push(["instructor", pool.escape(req.query.instructor)]);

		for (var i=0; i<params.length; i++) {
			if (query.length === 35) {
				query += " " + params[i][0] + "=" + params[i][1];
			} else {
				query += " AND " + params[i][0] + "=" + params[i][1];
			}
		}

		console.log("Query: " + query);

		pool.query(query, (err,rows, field)=>{
			if(err){
				res.status(300);
				res.write("Error with query" + err);
				res.end();
				return;
			}
			res.status(200);
			res.json(rows);
			res.end();
		});
	}
});

//Used to get resources for dynamic page allocations
app.post("/render", (req,res)=>{
	console.log("Entered render with: " + JSON.stringify(req.body));
	if(req.body.page === undefined){
		res.status(200);
		res.write("Could not find page");
		res.end();
		return;
	}
	switch(req.body.page){
		case("index"):
			res.write(fs.readFileSync(__dirname + "/resources/html/index.html"));
			break;
		case("select"):
			res.write(fs.readFileSync(__dirname + "/resources/html/select.html"));
			break;
		case("calendar"):
			res.write(fs.readFileSync(__dirname + "/resources/html/calendar.html"));
			break;
		case("table"):
			res.write(fs.readFileSync(__dirname + "/resources/html/table.html"));
			break;
		default:
			res.status(200);
			res.write("Could not find page");
	}
	res.end();
});

//gets all the sections for given courses given the course ie CS 275 and the term ie Spring Quarter 18-19
app.post("/classes", (req, res)=>{
	console.log("Entered classes with:\n" + JSON.stringify(req.body));
	let query = "select * from updated_courses where term=" + pool.escape(req.body.term) + "AND (";
	let coursesRes = [];
	let map = {};
	let counter = 0;
	for(course in req.body.courses){
		map[req.body.courses[course]] = counter;
		coursesRes[counter] = [];
		counter++;
		let split = req.body.courses[course].split(" ");
		query+= "(subject=" + pool.escape(split[0]) + " AND number=" + pool.escape(split[1]) +") OR";
	}
	query = query.slice(0,-2);
	query += ");"

	pool.query(query, (err,rows,field)=>{
		if(err){
			res.status("200");
			console.log("Error with Query:" + query);
			res.write("Error with query");
			res.end();
			return;
		}
		for(row in rows){
			var pointer = map[rows[row].subject + " " + rows[row].number];
			if(pointer !== undefined){
				coursesRes[pointer].push(rows[row]);
			}
		}
		res.write(JSON.stringify(coursesRes));
		res.end();	
	})
});

//gets all terms 
app.get("/allTerms", (req,res)=>{
	console.log("Entered allTerms");
	query = "SELECT DISTINCT term FROM updated_courses;";
	pool.query(query, (err,rows, field)=>{
		if(err){
			res.status(200);
			res.write("Error with query");
			res.end();
			return;
		}
		res.json(rows);
		res.end();
	});
});

//gets all instructors 
app.get("/allInstructors", (req,res)=>{
	console.log("Entered allInstructors");
	if(req.query.term == undefined){
		res.status(200);
		res.write("Error with query");
		res.end();
		return;	
	}
	query = 'SELECT DISTINCT instructor as ID from updated_courses where term=' + pool.escape(req.query.term) + ' ORDER BY ID';
	pool.query(query,(err,rows,fields)=>{
		if(err){
			res.status(200);
			res.write("Error with query");
			res.end();
			return;
		}
		res.json(rows);
		res.end();
	});
});

//gets all the classes offered given the term
app.get("/allClasses", (req,res)=>{
	console.log("Entered allClasses");
	if(req.query.term == undefined){
		res.status(200);
		res.write("Error with query");
		res.end();
		return;	
	}
	query = 'SELECT DISTINCT CONCAT(subject, " ", number) as ID from updated_courses where term=' + pool.escape(req.query.term) + ' ORDER BY ID';
	pool.query(query,(err,rows,fields)=>{
		if(err){
			res.status(200);
			res.write("Error with query");
			res.end();
			return;
		}
		res.json(rows);
		res.end();
	});
});

app.get("/runScraper", (req,res)=>{
	console.log("Calling runScraper");


	// const exec = require('child_process').exec;
	// const child = exec('ls', (error, stdout, stderr) => {
	//         console.log(`stdout: ${stdout}`);
	//         console.log(`stderr: ${stderr}`);
	//         if (error !== null) {
	//             console.log(`exec error: ${error}`);
	//         }
	// });


	const exec = require('child_process').exec;
	const child = exec('cd server ; node ../scraper/scraper.js', (error, stdout, stderr) => {
	        console.log(`stdout: ${stdout}`);
	        console.log(`stderr: ${stderr}`);
	        if (error !== null) {
	            console.log(`exec error: ${error}`);
	        }
	});


	console.log("Done scraper");
})

app.get("/pushDatabase",(req,res)=>{
	console.log("Calling pushDataToDatabase");
	pushDataToDatabase();
	console.log("Finished pushing to database");
});

//used to populate database, currently done manually
async function pushDataToDatabase(){
	console.log("Entered pushDataToDatabase");
	let file = __dirname + "/../scraper/courses.json";
	let allCourses = JSON.parse(fs.readFileSync(file));
	if(allCourses === undefined){
		console.log("pushDataToDatabase Failed to get courses from file: " + file);
		return;
	}
	let totalRequests = 0;
	let actualRequests = 0;
	console.log("File read");
	for (term in allCourses) {
		for (college in allCourses[term].colleges) {
			for (subject in allCourses[term].colleges[college].subjects) {
				for (courseLink in allCourses[term].colleges[college].subjects[subject].courseLinks) {
					// for (course in allCourses[term].colleges[college].subjects[subject].courseLinks[courseLink].courses) {
						// console.log(allCourses[term].colleges[college].subjects[subject].courseLinks[courseLink].courses[course]);
					let query = "INSERT INTO updated_courses (term, college, subject, number, type, method, section, crn, title, times, instructor, building, room, campus, credits, enroll, max_enroll, section_comments, textbook, description) VALUES (";
					// for(subject in allCourses[term].colleges[college].subjects){
						// for(course in allCourses[term].colleges[college].subjects[subject].courses){
							let item = allCourses[term].colleges[college].subjects[subject].courseLinks[courseLink].courses;
							query += pool.escape(allCourses[term].name);
							query += ", " + pool.escape(allCourses[term].colleges[college].name);
							query += ", " + pool.escape(item.Subject);
							query += ", " + pool.escape(item.Number);
							query += ", " + pool.escape(item.Type);
							query += ", " + pool.escape(item.Method);
							query += ", " + pool.escape(item.Section);
							query += ", " + pool.escape(item.CRN);
							query += ", " + pool.escape(item.Title);
							query += ", " + pool.escape(JSON.stringify(item.Times));
							query += ", " + pool.escape(item.Instructor);
							query += ", " + pool.escape(item.Building);
							query += ", " + pool.escape(item.Room);
							query += ", " + pool.escape(item.Campus);
							query += ", " + pool.escape(item.Credits);
							query += ", " + pool.escape(item.Enroll);
							query += ", " + pool.escape(item.Max_Enroll);
							query += ", " + pool.escape(item.Section_Comments);
							query += ", " + pool.escape(item.Textbook);
							query += ", " + pool.escape(item.Description);
							query += "),\n(";
							totalRequests++;
						// }
					// }
					query = query.slice(0,-3) + ";";	
					actualRequests++;		
					// console.log(query);
					pool.query(query, (err,rows,field)=>{
						if(err && !String(err).includes("ER_DUP_ENTRY")){
							console.log("Error with query\n" + err);
						}
					});
					// }
				}
			}
		}
	}
	console.log("totalRequests: " + totalRequests);
	console.log("actualRequests: " + actualRequests);
}

//start application to listen
app.listen(app.get('port'));
console.log("Listening on port:" + app.get('port'));
