const db = module.exports = require('./db').sublevel('cars')

module.exports.list = function(cb) {
  var list = []
  db.createReadStream()
    .on('data', function(data){ list.push(data) })
    .on('error', function(error){ cb(error) })
    .on('end', function(){ cb(null, list) })
}

