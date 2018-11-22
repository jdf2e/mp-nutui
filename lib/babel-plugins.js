const babel = require('babel-core');
const t = require('babel-types');

// const classBinding = "['as', c, {'nut-cell-link':a>12}, {[abc]: false}]";

function parseClassBinding(classBinding = '') {
  const {ast} = babel.transform(classBinding, {
    plugins: [
      {
        visitor: {
          ObjectExpression: function(path) {
            const {node} = path;
            if(node) {
              const {properties} = node;
              if(properties) {
                const {key, value} = properties[0];
                path.replaceWith(
                  t.conditionalExpression(
                    value, 
                    t.stringLiteral(key.value || key.name || ''), 
                    t.stringLiteral('')
                  )
                );
              }
            }
          }
        }
      }
    ]
  });
  const {code} = babel.transformFromAst(ast, classBinding);
  return code;
}

const styleBinding = "[{'background-color':bgColor? 'red': '#ccc', color: '1px'}]";
// styleBinding 统一添加[]
function genStyles(props = []) {
  return props.map(p => {
    const {key, value} = p;
    let k = (key.value || key.name || '') + ':';
    let val = (value.value || value.name || '');
    if(value.type == 'ConditionalExpression') {
      console.log(value)
      val = styleBinding.substring(value.start,value.end);
    }
    
    return `"${k}"+(${val})`;
  });
}

function parseStyleBinding(styleBinding) {
  const stylesStr = styleBinding;
  const {ast} = babel.transform(styleBinding, {
    plugins: [
      {
        visitor: {
          ObjectExpression: function(path) {
            const {node} = path;
            if(node) {
              const {properties} = node;
              // console.log(properties)
              if(properties && properties.length) {
                path.replaceWith(
                  t.stringLiteral(genStyles(properties).join('+";"+'))
                );
              }
            }
          }
        }
      }
    ]
  });
  const {code} = babel.transformFromAst(ast, styleBinding);
  require('fs').writeFile('a.js', code.replace(/^\[+['"]/, '{{').replace(/['"]\]+;$/, '}}'))
  return code;
}

console.log(parseStyleBinding(styleBinding))