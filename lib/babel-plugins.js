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


const styleBinding = "{'background-color':bgColor}";
function parseStyleBinding(styleBinding) {}

console.log(parseClassBinding(classBinding))