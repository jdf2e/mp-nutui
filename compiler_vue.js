const fs = require('fs-extra');
const path = require('path');
const compiler = require('vue-template-compiler');
const { parse } = require('@vue/component-compiler-utils');
const source = fs.readFileSync('cell.vue');

const {log, exists, isFile, isDirectory} = require('./utils');

const MPPREFIX = 'mp-';
const VUEFILE = '.vue';

function getCompFiles() {
  // return  glob
  //         .sync(`${COMPONENT}/**`, {dot: true})
  //         .filter(item => {
  //           return fs.statSync(item).isFile();
  //         });
}

function parseVueFile() {

  const vueFiles = getCompFiles().filter( file => path.extname(file) === '.vue'); 
  
  if(vueFiles && vueFiles.length) {
    vueFiles.forEach(file => {
      const {template, script, styles} = parse({
        compiler,
        source: fs.readFileSync(file).toString(),
        filename: path.basename(file)
      });
      
    });
  }  
  
}
// parseVueFile();
// function createWXMLFile() {
//   fs.writeFileSync(path.join(MP_COMPONENT, MP_COMPONENT + '.wxml'), );
// }

function createMPComponent() {

  const COMPONENT = 'cell';

  const hasDir = exists(COMPONENT);
  if(!hasDir) {
    log.error('the entry component directory is not exists !', 'exit');
  }else{
    const files = fs.readdirSync(COMPONENT);
    convertVues(files, COMPONENT);
  }
}

function convertVues(files = [], dir) {
  if(files.length) {
    const mainFile = [dir + VUEFILE, 'index' + VUEFILE];
    const vueFiles = files.filter(_file => {
      const file = path.join(dir, _file);
      return path.extname(file) === VUEFILE && isFile(file);
    });
    const subDirs = files.filter(_file => {
      const file = path.join(dir, _file);
      return isDirectory(file);
    });

    if(vueFiles.length) {
      if(mainFile.every(file => {
        return !~vueFiles.indexOf(path.basename(file));
      })) {
        // 验证组件是否存在主文件 component.vue 或 index.vue
        log.error('component main file is not exists !', 'exit');
      }
      for(const file of vueFiles) {
        const currDir = MPPREFIX + dir;
        if(~mainFile.indexOf(file)) {
          createMainMP(dir, currDir);
        }else{
          createMainMP(path.parse(file).name, path.join(currDir, MPPREFIX + path.parse(file).name));
        }
      }
    }

    if(subDirs.length) {
      subDirs.forEach(subdir => {
        const currDir = path.join(dir, subdir);
        const subFiles = fs.readdirSync(currDir);
        convertVues(subFiles, currDir)
      });
    }
  }
}

function createMainMP(file, dir) {
  ['.wxml', '.wxss', '.json', '.js'].forEach(ext => {
    fs.ensureFileSync(path.join(dir, MPPREFIX + file + ext));
  });
}

createMPComponent();

/**
 * 以一个组件目录为入口，
 * 先确定目录同名的.vue文件是否存在，不存在确认index.vue是否存在；
 * 以主.vue文件为准生成小程序相关的文件，
 * 同级其他的.vue文件在同级生成小程序相关的组件包文件；
 * 如果同级还有文件夹，以上为准递归；*/

