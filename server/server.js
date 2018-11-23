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

//sql details
var mysql = require("mysql");

let con = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
let sqlDisconnected = true;

const connectToDatabase = new Promise((resolve, reject)=>{//not running through for some reason
	debugger;
	if(sqlDisconnected){
		con.destroy();
	}
	con = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
	con.on('error', (err)=>{
		console.log("" + err);
		if(err == "Error: Connection lost: The server closed the connection."){
			sqlDisconnected = true;
		}
	});
	con.connect((err)=>{
		if(err){
			reject("Error connecting to database, aborting pushDataToDatabase\n" + err);
			return;
		}
		sqlDisconnected = false;
		resolve("Reconnected to database");
	});
});


app.get("/",(req,res)=>{
	res.write(fs.readFileSync(__dirname + "/resources/html/index.html"));
	res.send();
});


app.post("/classes", (req, res)=>{
	console.log("Entered classes with:\n" + JSON.stringify(req.body));
	let query = "select * from courses where term=" + con.escape(req.body.term) + "AND (";
	let coursesRes = [];
	let map = {};
	let counter = 0;
	for(course in req.body.courses){
		map[req.body.courses[course]] = counter;
		coursesRes[counter] = [];
		counter++;
		let split = req.body.courses[course].split(" ");
		query+= "(subject=" + con.escape(split[0]) + " AND number=" + con.escape(split[1]) +") OR";
	}
	query = query.slice(0,-2);
	query += ");"

	con.query(query, (err,rows,field)=>{
		if(err){
			res.status("200");
			res.write("Error with query");
			res.send();
			return;
		}
		for(row in rows){
			console.log(rows[row].subject + " " + rows[row].number);
			var pointer = map[rows[row].subject + " " + rows[row].number];
			if(pointer !== undefined){
				coursesRes[pointer].push(rows[row]);
			}
		}
		console.log(JSON.stringify(coursesRes));
		res.write(JSON.stringify(coursesRes));
		res.end();	
	})
});

app.get("/allTerms", (req,res)=>{
	query = "SELECT DISTINCT term FROM courses;";
	con.query(query, (err,rows, field)=>{
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
	if(req.query.term == undefined){
		res.status(200);
		res.write("Error with query");
		res.end();
		return;	
	}
	query = 'SELECT DISTINCT CONCAT(subject, " ", number) as ID from courses where term=' + con.escape(req.query.term) + ' ORDER BY ID';
});

async function pushDataToDatabase(){
	console.log("Entered pushDataToDatabase");
	if(sqlDisconnected){
		if (!(await connectToDatabase.then((msg)=>{console.log(con); return true;}, (msg)=>{console.log(msg); return false;}))){
			return;
		}
	}
	console.log("pushDataToDatabase with DB connection");
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
					query += con.escape(allCourses[term].name);
					query += ", " + con.escape(allCourses[term].colleges[college].name);
					query += ", " + con.escape(item.Subject);
					query += ", " + con.escape(item.Number);
					query += ", " + con.escape(item.Type);
					query += ", " + con.escape(item.Method);
					query += ", " + con.escape(item.Section);
					query += ", " + con.escape(item.CRN);
					query += ", " + con.escape(item.Description);
					query += ", " + con.escape(JSON.stringify(item.Times));
					query += ", " + con.escape(item.Instructor);
					query += "),\n(";
					totalRequests++;
				}
			}
			query = query.slice(0,-3) + ";";	
			actualRequests++;		
			con.query(query, (err,rows,field)=>{
				if(err && !String(err).includes("ER_DUP_ENTRY")){
					console.log("Error with query\n" + err);
				}
			});
		}
	}
	console.log("totalRequests: " + totalRequests);
	console.log("actualRequests: " + actualRequests);
}


async function initialConnect(){
	await connectToDatabase.then(console.log);
	if(!sqlDisconnected){
	//starts the listener
		app.listen(app.get('port'));
		console.log("Listening on port:" + app.get('port'));
	}
}
initialConnect();
