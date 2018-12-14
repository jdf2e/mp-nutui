const fs = require('fs-extra');
const {extname, join, basename, parse: pathparse} = require('path');
const compiler = require('vue-template-compiler');
const { parse } = require('@vue/component-compiler-utils');

const {log, exists, isFile, isDirectory} = require('./lib/utils');
const parseTemplate = require('./lib/parseTemplate');
const parseVueStyles = require('./lib/parseVueStyles');

const MPPREFIX = 'mp-';
const VUEFILE = '.vue';
const STYLEFILES = ['.less', '.scss', '.css'];
const MPFILES_MAP = new Map([
  ['WXML', '.wxml'], 
  ['WXSS', '.wxss'], 
  ['JSON', '.json'], 
  ['JS', '.js']
]);

function parseVueFile(source, filename) {

  return parse({
    compiler,
    source,
    filename
  }); 
  
}

function createMPComponent() {

  const COMPONENT = 'cell';

  const hasDir = exists(COMPONENT);
  if(!hasDir) {
    log.error('the entry component directory is not exists !', 'exit');
  }else{
    const files = fs.readdirSync(COMPONENT);
    convertVues(files, COMPONENT, COMPONENT);
  }
}

function convertVues(files = [], dir, _dir) {
  if(files.length) {
    const mainFile = [_dir + VUEFILE, 'index' + VUEFILE];
    const extraStyleFiles = files.filter(_file => {
      const file = join(dir, _file);
      return ~STYLEFILES.indexOf(extname(file)) && isFile(file);
    }).map(_file => {
      const file = join(dir, _file);
      return {
        ext: extname(file).slice(0, -1),
        path: join(dir, _file)
      }
    });
    const vueFiles = files.filter(_file => {
      const file = join(dir, _file);
      return extname(file) === VUEFILE && isFile(file);
    });
    const subDirs = files.filter(_file => {
      const file = join(dir, _file);
      return isDirectory(file);
    });

    console.log(extraStyleFiles)
    if(vueFiles.length) {
      if(mainFile.every(file => {
        return !~vueFiles.indexOf(basename(file));
      })) {
        // 验证组件是否存在主文件 component.vue 或 index.vue
        log.error('component main file is not exists !', 'exit');
      }
      for(const file of vueFiles) {
        const currDir = MPPREFIX + dir;
        const filename = pathparse(file).name;
        const filepath = join(dir, file);
        if(~mainFile.indexOf(file)) {
          createMP(dir, currDir, filepath, extraStyleFiles);
        }else{
          
          createMP(filename, join(currDir, MPPREFIX + filename), filepath, extraStyleFiles);
        }
      }
    }

    if(subDirs.length) {
      subDirs.forEach(subdir => {
        const currDir = join(dir, subdir);
        const subFiles = fs.readdirSync(currDir);
        convertVues(subFiles, currDir, subdir)
      });
    }
  }
}

function createMP(file, dir, filepath, extraStyleFiles) {
  for(const ext of MPFILES_MAP.values()) {
    const fullfile = join(dir, MPPREFIX + file + ext);
    fs.ensureFileSync(fullfile);

    if(filepath) {
      const source = fs.readFileSync(filepath);
      const {template, script, styles} = parseVueFile(source.toString(), file + VUEFILE);
      if(ext === MPFILES_MAP.get('WXML') && template && template.content) {
        fs.writeFileSync(fullfile, parseTemplate(template.content));
      }console.log(styles)
      if(ext === MPFILES_MAP.get('WXSS') && styles && styles) {
        // fs.writeFileSync(fullfile, parseTemplate(template.content));
      }
    }
  }
}

createMPComponent();

/**
 * 以一个组件目录为入口，
 * 先确定目录同名的.vue文件是否存在，不存在确认index.vue是否存在；
 * 以主.vue文件为准生成小程序相关的文件，
 * 同级其他的.vue文件在同级生成小程序相关的组件包文件；
 * 如果同级还有文件夹，以上为准递归；
 * 
 * */

