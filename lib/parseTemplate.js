const compiler = require('vue-template-compiler');

function parseTemplate(source) {
  const {ast} = compiler.compile(source);
  console.log(ast.classBinding);
  if(ast.classBinding) {
    ast.classBinding.forEach(a=>{
      console.log(typeof a)
    });
  }
  createMPtemplate(ast);
}

function createMPtemplate({
  tag = 'view',
  ifConditions,
  ifProcessed
}) {
  let mpTemplate = `<${tag} ${ifProcessed? `wx:if="{{${ifConditions[0].exp}}}"`: ''}></${tag}>`;
  if(ifProcessed) {
    ifConditions.forEach(condition => {

    });
  }else{

  }
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