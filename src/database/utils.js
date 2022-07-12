// methods to overwright json data

const fs = require('fs');

const saveToDatabase = (DB)=> {
  fs.writeFileSync('./src/database/exercises.json', JSON.stringify(DB, null, 2), {encoding: 'utf-8'});
}

module.exports = {saveToDatabase}