const c = require('chalk');
const fs = require('fs');

const libName = require('./package.json').name;

function log() {
  console.log.apply(console, arguments);
}

log.error = function(msg, exit) {
  log(c.gray('\n['+libName+']: ') + c.red(msg));
  exit && process.exit(0);
}

log.info = function(msg) {
  log(c.greenBright(msg));
}

module.exports.log = log;
module.exports.exists = file => fs.existsSync(file);
module.exports.isFile = file => fs.statSync(file).isFile();
module.exports.isDirectory = file => fs.statSync(file).isDirectory();