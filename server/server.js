#! /usr/bin/node

if(process.env.CLEARDB_DATABASE_URL === undefined){
	require('dotenv').config();
}

var express = require("express");

var app = express();
app.use(express.static("server/"));
app.set('port', (process.env.PORT || 8080));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var fs = require("fs");


var mysql = require("mysql");

let pool = mysql.createPool('mysql://b0805b748391be:694cde6c@us-cdbr-iron-east-01.cleardb.net/heroku_b90810694222ae5?reconnect=true');

pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('enqueue', function () {
  console.log('Waiting for available connection slot');
});

pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});

app.get("/",(req,res)=>{
	res.write(fs.readFileSync(__dirname + "/resources/html/index.html"));
	res.end();
});

app.get("/index", (req,res)=>{
	res.write(fs.readFileSync(__dirname + "/resources/html/index.html"));
	res.end();
});


app.get("/select", (req,res)=>{
	res.write(fs.readFileSync(__dirname + "/resources/html/select.html"));
	res.end();
});

app.get('/tms', function(req, res) {
	if (Object.keys(req.query).length === 0) {
		res.status(400);
		res.send("No parameters provided");
	} else {
		var query = "SELECT * FROM courses WHERE";
		var params = {};
		if(req.query.term !== undefined) params[term]=con.escape(req.query.term);
		if(req.query.college !== undefined) params[college]=con.escape(req.query.college);
		if(req.query.subject !== undefined) params[subject]=con.escape(req.query.subject);
		if(req.query.number !== undefined) params[number]=con.escape(req.query.number);
		if(req.query.type !== undefined) params[type]=con.escape(req.query.type);
		if(req.query.method !== undefined) params[method]=con.escape(req.query.method);
		if(req.query.section !== undefined) params[section]=con.escape(req.query.section);
		if(req.query.crn !== undefined) params[crn]=con.escape(req.query.crn);
		if(req.query.description !== undefined) params[description]=con.escape(req.query.description);
		if(req.query.times !== undefined) params[times]=con.escape(req.query.times);
		if(req.query.instructor !== undefined) params[instructor]=con.escape(req.query.instructor);

		for (var key in params) {
			if (query.length === 27) {
				query += " " + key + "=" + params[key];
			} else {
				query += " AND " + key + "=" + params[key];
			}
		}

		pool.query(query, (err,rows, field)=>{
			if(err){
				res.status(300);
				res.write("Error with query");
				res.end();
				return;
			}
			res.status(200);
			res.json(rows);
			res.end();
		});
	}
});

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
		default:
			res.status(200);
			res.write("Could not find page");
	}
	res.end();
});

app.post("/classes", (req, res)=>{
	console.log("Entered classes with:\n" + JSON.stringify(req.body));
	let query = "select * from courses where term=" + pool.escape(req.body.term) + "AND (";
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

app.get("/allTerms", (req,res)=>{
	console.log("Entered allTerms");
	query = "SELECT DISTINCT term FROM courses;";
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

app.get("/allClasses", (req,res)=>{
	console.log("Entered allCalsses");
	if(req.query.term == undefined){
		res.status(200);
		res.write("Error with query");
		res.end();
		return;	
	}
	query = 'SELECT DISTINCT CONCAT(subject, " ", number) as ID from courses where term=' + pool.escape(req.query.term) + ' ORDER BY ID';
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
	for(term in allCourses){
		for(college in allCourses[term].colleges){
			let query = "INSERT INTO courses (term, college, subject, number, type, method, section, crn, description, times, instructor) VALUES (";
			for(subject in allCourses[term].colleges[college].subjects){
				for(course in allCourses[term].colleges[college].subjects[subject].courses){
					let item = allCourses[term].colleges[college].subjects[subject].courses[course];
					query += pool.escape(allCourses[term].name);
					query += ", " + pool.escape(allCourses[term].colleges[college].name);
					query += ", " + pool.escape(item.Subject);
					query += ", " + pool.escape(item.Number);
					query += ", " + pool.escape(item.Type);
					query += ", " + pool.escape(item.Method);
					query += ", " + pool.escape(item.Section);
					query += ", " + pool.escape(item.CRN);
					query += ", " + pool.escape(item.Description);
					query += ", " + pool.escape(JSON.stringify(item.Times));
					query += ", " + pool.escape(item.Instructor);
					query += "),\n(";
					totalRequests++;
				}
			}
			query = query.slice(0,-3) + ";";	
			actualRequests++;		
			pool.query(query, (err,rows,field)=>{
				if(err && !String(err).includes("ER_DUP_ENTRY")){
					console.log("Error with query\n" + err);
				}
			});
		}
	}
	console.log("totalRequests: " + totalRequests);
	console.log("actualRequests: " + actualRequests);
}

app.listen(app.get('port'));
console.log("Listening on port:" + app.get('port'));
