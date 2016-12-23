const Levelup   = require('levelup')
    , Sublevel  = require('level-sublevel')
    , bytewise = require('bytewise')

var db = Sublevel(Levelup(__dirname+'/../mydb', {keyEncoding: bytewise, valueEncoding: 'json'}))

module.exports = db

