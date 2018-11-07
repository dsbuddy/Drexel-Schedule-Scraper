var classes = [{
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
]

function isValidSchedule(sectionToAdd, schedule){
  for (otherClass of schedule){
    otherClass = otherClass.time
    latest = Math.max(otherClass.end, sectionToAdd.end)
    earliest = Math.min(otherClass.start, sectionToAdd.start)
    if (latest - earliest < (sectionToAdd.end - sectionToAdd.start) + (otherClass.end - otherClass.start)){
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
  classToAdd = classes[0]
  foundSchedule = false
  for (time of classToAdd.possibletimes){
    if (isValidSchedule(time, schedule)){
      newSchedule = schedule.slice()
      newSchedule.push({"name": classToAdd.name, "time": time})
      if(findPossibleSchedules(classes.slice(1), list, newSchedule)){
        foundSchedule = true
      }
    }
  }
}

var list = []
findPossibleSchedules(classes, list, [])
console.log(JSON.stringify(list))
