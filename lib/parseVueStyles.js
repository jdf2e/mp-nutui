const sass = require('sass.js');
const less = require('less');
const pify = require('pify');
const fs = require('fs');
const {join} = require('path');
const {scssFolder} = require('../config');

const lessRender = pify(less.render.bind(less));

const compileStyle = {
  scss(scss = '') {
    return new Promise((rs, rj) => {
      sass.compile(scss, function(result) {
        const {status, text, formatted} = result;
        if(status === 0) rs(text);
        if(status === 1) rj(formatted);
      });
    });
  },
  async less(lessStr = '') {
    try{
      const {css, imports} = await lessRender(lessStr);
      return css;
    }catch(_) {
      console.log(_.message)
    }
  },
  compileStyleFile
}

const importScssFolder = scssFolder;

async function compileStyleFile(filepath, ext) {
  try{
    const data = fs.readFileSync(filepath);
    
    sass.writeFile({
      'index.scss': fs.readFileSync(join(importScssFolder, 'index.scss')).toString(),
      "./variable.scss": fs.readFileSync(join(importScssFolder, 'variable.scss')).toString(),
      "./mixins/index.scss": fs.readFileSync(join(importScssFolder, 'mixins/index.scss')).toString(),
      'make-animation.scss': fs.readFileSync(join(importScssFolder, 'mixins/make-animation.scss')).toString(),
      'text-ellipsis.scss': fs.readFileSync(join(importScssFolder, 'mixins/text-ellipsis.scss')).toString(),
      'nut-radio-bg.scss': fs.readFileSync(join(importScssFolder, 'mixins/nut-radio-bg.scss')).toString(),
      'nut-checkbox-bg.scss': fs.readFileSync(join(importScssFolder, 'mixins/nut-checkbox-bg.scss')).toString(),
      'nut-cell-border.scss': fs.readFileSync(join(importScssFolder, 'mixins/nut-cell-border.scss')).toString(),
      'fix-fullscreen.scss': fs.readFileSync(join(importScssFolder, 'mixins/fix-fullscreen.scss')).toString()
    });
    const css = await compileStyle[ext.slice(1)].call(null, `@import "index";\n${data.toString()}`);
    // console.log(css)
    return css;
  }catch(_) {
    console.log(_)
  }
}

module.exports = compileStyle;
