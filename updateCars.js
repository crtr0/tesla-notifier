const carsdb = require('./models/cars')
    , _ = require('lodash')

// return an array of properties that have values that are different between a and b
function getChangedProps(a, b) {
  return _.reduce(a, function(result, value, key) { return _.isEqual(value, b[key]) ? result : result.concat(key); }, []);
}

function getDiff(a, b) {
  let message = ''
  getChangedProps(a,b).forEach(function(prop) {
    message += '[' + prop + ', ' + a[prop] + ', ' + b[prop] + ']'
  })
  return message
}

function buildPromise(car) {
  return new Promise(function(resolve, reject) {
    carsdb.get(car.Vin, function(err, value) {
      if (err) {
        if (err.notFound) {
          // new car to us! insert into the DB
          console.log('new car! ', car.Vin)
          value = {
            car: car,
            added: new Date(),
            history: []
          }
        }
        else {
          return reject(err)
        }
      }
      else {
        // compare what's in the DB vs what was passed in
        if (JSON.stringify(car) !== JSON.stringify(value.car)) {
          value.history.push(value.car)
          console.log('Updated car!', car.Vin, getDiff(value.car, car))
          value.car = car
        }
      }
      carsdb.put(car.Vin, value, function(err) { if (err) { reject(err) } else { resolve() } })
    })
    
  })
}

/**
 * Take a map of cars and updates the local DB.
 */
module.exports = function(cars, cb) {
  let ops = []
  // loop through cars passed in
  Object.keys(cars).forEach(function(vin) {
    ops.push(buildPromise(cars[vin]))
  })
  Promise.all(ops).then(function(value) {
    cb()
  }).catch(function(err) {
    console.log('updateDB: Promises failed')
    cb(err)
  })
}
