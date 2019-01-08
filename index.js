const fs = require('fs-extra');
const compiler = require('vue-template-compiler');
const {extname, join, basename, parse: pathparse} = require('path');
const {parse} = require('@vue/component-compiler-utils');
const {log, exists, isFile, isDirectory} = require('./lib/utils');
const {compileStyleFile, scss} = require('./lib/parseVueStyles');
const parseTemplate = require('./lib/parseTemplate');
const traverseScriptAst = require('./lib/traverseScriptAst');
const createWxJson = require('./lib/createWxJson');
const argv = require('yargs-parser')(process.argv, {
  alias: {
    output: 'o',
    input: 'i'
  }
});



const {output, input} = argv;

if(!input) return log.error(`'input' parameter expected!`, 'exit');

const COMPONENT_ENTRY_DIR = input//'src/packages/cell';
const COMPONENT_OUTPUT_DIR = output || 'mp-nutui'//'src/mp-nutui';
const MPPREFIX = 'mp-';
const VUEFILE = '.vue';
const STYLEFILE = '.scss';
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

  const hasDir = exists(COMPONENT_ENTRY_DIR) && isDirectory(COMPONENT_ENTRY_DIR);
  if(!hasDir) {
    log.error('the entry component directory is not exists !', 'exit');
  }else{
    const files = fs.readdirSync(COMPONENT_ENTRY_DIR);
    const component = (COMPONENT_ENTRY_DIR.match(/\/([^\/]+)\/?$/) || [])[1] || '';
    convertVues(files, COMPONENT_ENTRY_DIR, component);
  }
}

function getVueFiles(files, dir) {
  return files.filter(_file => {
    const file = join(dir, _file);
    return extname(file) === VUEFILE && isFile(file);
  });
}

function getSubDirs(files, dir) {
  return files.filter(_file => {
    const file = join(dir, _file);
    return isDirectory(file);
  });
}

function convertVues(files = [], dir, compDir, parentDir) {
  if(files.length) {
    const mainFile = compDir + VUEFILE; // 组件入口文件统一为 [component].vue
    const vueFiles = getVueFiles(files, dir);
    const subDirs = getSubDirs(files, dir);

    if(vueFiles.length) {
      if(!~vueFiles.indexOf(basename(mainFile))) {
        // 验证组件是否存在主文件 [component].vue
        log.error('component main file is not exists !', 'exit');
      }
      for(const file of vueFiles) {
        const currDir = dir;
        const filename = pathparse(file).name;
        const filepath = join(dir, file);
        
        if(mainFile === file) {
          console.log('\n组件主文件：', file);
          const stylepath = join(dir, compDir + STYLEFILE);
          createMP(null, filename, filepath, parentDir, stylepath);
        }else{
          console.log('\n组件依赖文件：', file);
          // 生成依赖组件的文件夹
          const subDir = pathparse(mainFile).name;
          const stylepath = join(dir, filename + STYLEFILE);
          fs.ensureDirSync(join(COMPONENT_OUTPUT_DIR, subDir));
          createMP(subDir, filename, filepath, parentDir, stylepath);
        }
      }
    }

    if(subDirs.length) {
      subDirs.forEach(subdir => {
        const currDir = join(dir, subdir);
        const subFiles = fs.readdirSync(currDir);
        convertVues(subFiles, currDir, subdir, compDir)
      });
    }
  }
}

/**
 * 创建小程序组件 */
async function createMP(basedir, fileName, filepath, parentDir, stylepath) {
  
  for(const ext of MPFILES_MAP.values()) {
    const fullfile = join(COMPONENT_OUTPUT_DIR, basedir || '', parentDir || '', fileName, fileName + ext);
    fs.ensureFileSync(fullfile);

    if(filepath) {
      const source = fs.readFileSync(filepath);
      const {template, script, styles} = parseVueFile(source.toString(), filepath + VUEFILE);
      //console.log("script:",script)
      if(ext === MPFILES_MAP.get('WXML') && template && template.content) {
        fs.writeFileSync(fullfile, parseTemplate(template.content));
        console.log('已生成小程序文件.wxml：%s', fullfile);
      }
      
      let styleStr = '';
      if(styles && styles.length) {
        try{
          const styleContent = styles.reduce((content, curr) => {
            return content += curr.content;
          }, '');
          styleStr += await scss(styleContent);
        }catch(_) {}
      }
      if(stylepath && exists(stylepath)) {
        const stylesFromFile = await compileStyleFile(stylepath, STYLEFILE);
        styleStr += stylesFromFile;
        
      }
      if(ext === MPFILES_MAP.get('WXSS')) {
        fs.writeFileSync(fullfile, styleStr);
        console.log('已生成小程序文件.wxss：%s', fullfile);
      }
      if(ext === MPFILES_MAP.get('JSON')) {
        const json = createWxJson(fileName);
        fs.writeFileSync(fullfile, JSON.stringify(json));
        console.log('已生成小程序文件.json：%s', fullfile);
      }

      if(ext === MPFILES_MAP.get('JS') && script && script.content) {

        const testData = `
        export default {
          name: "nut-cell",
          props: {
            title: {
              type: String,
              default: ""
            },
            subTitle: {
              type: String,
              default: ""
            },
            desc: {
              type: String,
              default: ""
            },
            isLink: {
              type: Boolean,
              default: false
            },
            linkUrl: {
              type: String,
              default: null
            },
            showIcon: {
              type: Boolean,
              default: false
            },
            bgColor: {
              type: String,
              default: "#FFFFFF"
            }
          },
          data() {
            return {};
          },
          methods: {}
        };
        `
        console.log("fullfile",fullfile,"script",script.content)
       fs.writeFileSync(fullfile, traverseScriptAst(script.content));
        console.log('已生成小程序文件：%s', fullfile);
      }
      
    }

  }
}

createMPComponent();



