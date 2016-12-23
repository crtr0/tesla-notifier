const levelup = require('levelup')
    , db = levelup(__dirname+'/../mydb', {valueEncoding: 'json'});

db.createReadStream().on('data', console.log)
