const sass = require('sass');
const fs = require('fs-extra');
const {join, dirname} = require('path');

async function compileStyleFile(filepath, ext) {
  let cssStr = `@import "../../styles/index.scss";\n`;
  const id = Math.random().toString().slice(2,15) + '.scss';
  const tempFile = join(dirname(filepath), id);
  const scssStr = await fs.readFileSync(filepath);
  fs.ensureFileSync(tempFile);
  fs.writeFileSync(tempFile, cssStr + scssStr);
  try{
    const data = sass.renderSync({file: tempFile});
    fs.remove(tempFile);
    return data.css.toString();
  }catch(_) {
    console.log(_);
  }
  return '';
}

module.exports = {
  compileStyleFile
};
