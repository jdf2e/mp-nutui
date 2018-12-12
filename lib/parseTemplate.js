const compiler = require('vue-template-compiler');
const {parseClassBinding, parseStyleBinding} = require('./babel-plugins');

function parseTemplate(source) {
  const {ast} = compiler.compile(source);
  if(ast.classBinding) {
    const clas = parseClassBinding(ast.classBinding);
    ast.staticClass = ast.staticClass? `${ast.staticClass} {{${clas}}}`: clas;
  }
  return createMPtemplate(ast);
 
}

function createMPtemplate({
  tag = 'view',
  ifConditions,
  ifProcessed,
  attrsMap,
  staticClass
}) {
  console.log('ast.staticClass,',staticClass);
  let mpTemplate = `<${[
    tag,
    createStyle(attrsMap),
    createClass(attrsMap)
  ].join('')}></${tag}>`;
  if(ifProcessed) {
    ifConditions.forEach(condition => {

    });
  }else{
    
  }
  console.log('mpTemplate>,',mpTemplate);
  return mpTemplate;
}

function createStyle(attrsMap = {}) {
  const {style = '', ':style': styleBinding = ''} = attrsMap;
  return style || styleBinding? ` style=${parseStyleBinding(style, styleBinding).replace(/;$/, '')}`: '';
}

function createClass(attrsMap = {}) {
  const {':class': classBinding = ''} = attrsMap;
  const clas = attrsMap.class;
  let clasStr = ' class="';
  if(clas) {
    clasStr += `${clas} `;
  }
  if(classBinding) {
    clasStr += `${parseClassBinding(classBinding)}`;
  }
  return clasStr + '"';
}

function createTag(node) {
  const {tag, staticClass = '', classBinding} = node;

  let classStr = [];
  if(classBinding) {
    [].concat(staticClass).concat(classBinding).forEach(item => {
      if(typeof item === 'string') classStr.push(item);
      // if() 
    });
    classStr = `{{[]}}`;
  }
  return [
    `<${tag}`,
    `></${tag}>`
  ];
}

function createWXif() {
  return ifProcessed? `wx:if="{{${ifConditions[0].exp}}}"`: '';
}



module.exports = parseTemplate;