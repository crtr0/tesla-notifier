const request = require('request')
    , domain = 'https://www.tesla.com'
    , jsonPath = '/cpo_tool/ajax?exteriors=all&priceRange=&city=&state=&country=US&sort=&zip='


function buildPromise(query) {
 return new Promise(function(resolve, reject) {
    request(domain + jsonPath + query, function(err, resp, json) {
      if (err) reject(err)
      try {
        resolve(JSON.parse(json))
      }
      catch (exception) {
        reject(exception)
      }
    })
  })
}

/**
 * Fetches the latest list of cars the Tesla website and returns it.
 */
module.exports = function(cb) {
  let ops = [
    buildPromise('&title_status=new&model_code=MODEL_S'),
    buildPromise('&title_status=used&model_code=MODEL_S'),
    buildPromise('&title_status=new&model_code=MODEL_X'),
    buildPromise('&title_status=used&model_code=MODEL_X') ]

  Promise.all(ops).then(function(cars) {
    // flatten array of arrays we get back
    let flat = [].concat.apply([], cars);
    return cb(null, flat)
  }).catch(function(err) {
    console.log('fetchCars: Promises failed')
    return cb(err)
  })
}

