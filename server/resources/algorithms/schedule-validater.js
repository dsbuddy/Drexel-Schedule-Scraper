const fs = require('fs')

const overlap = require('./overlap-comparison').overlap


var classes = JSON.parse(fs.readFileSync("demo1-example-classes.json", "utf8"))

function isValidSchedule(sectionToAdd, schedule){
  for (otherClass of schedule){
    if(overlap(otherClass.time, sectionToAdd.time)){
      return false
    }
  }
  return true
}

function findPossibleSchedules(classes, list, schedule) {
  if (classes.length == 0){
    list.push(schedule);
    return true
  }
  var className = Object.keys(classes[0][0])[0]
  var classToAdd = classes[0][0][className]
  for (section of classToAdd){
    if (isValidSchedule(section, schedule)){
      newSchedule = schedule.slice()
      newSchedule.push(section)
      if(findPossibleSchedules(classes.slice(1), list, newSchedule)){
      }
    }
  }
}

var list = []

findPossibleSchedules(classes, list, [])
// console.log(JSON.stringify(list, null, 4))

var data = JSON.stringify(list);  
fs.writeFileSync('demo1-example-schedules.json', data); 


/* var classes = [{
  name: "CS270",
  possibletimes: [
      {
        start: 12,
        end: 15
      },
      {
        start: 1,
        end: 5
      }
    ]
  },
  {
    name: "CS275",
    possibletimes: [
      {
        start: 16,
        end: 19
      },
      {
        start: 10,
        end: 13
      },
      {
        start: 9,
        end: 10
      }
    ]
  },
  {
    name: "MATH210",
    possibletimes: [
      {
        start: 12,
        end: 15
      }
    ]
  },
  {
    name: "MATH201",
    possibletimes: [
      {
        start: 12,
        end: 15
      },
      {
        start: 8,
        end: 9
      }
    ]
  }
] */
