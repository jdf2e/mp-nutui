const babel = require('babel-core');
const t = require('babel-types');

// const classBinding = "['as', c, {'nut-cell-link':a>12}, {[abc]: false}]";

function parseClassBinding(classBinding = '') {
  const classStr = /^\[.+?\]$/.test(classBinding)? classBinding: '['+classBinding+']';
  const {ast} = babel.transform(classStr, {
    plugins: [
      {
        visitor: {
          ObjectExpression: function(path) {
            const {node} = path;
            if(node) {
              const {properties} = node;
              if(properties && properties.length) {
                path.replaceWithMultiple(properties.map(({key, value}) => {
                  return t.conditionalExpression(
                          value, 
                          t.stringLiteral(key.value || key.name || ''), 
                          t.stringLiteral('')
                        )
                }));
              }
            }
          }
        }
      }
    ]
  });
  const {code} = babel.transformFromAst(ast, classStr);
  return `{{${code.replace(/;$/, '')}}}`;
}

// const styleBinding = "{'background-color':bgColor? 'red': '#ccc', color: bgColor}";
// styleBinding 统一添加()
function genStyles(styleBinding, props = []) {
  return props.map(p => {
    const {key, value} = p;
    let k = (key.value || key.name || '') + ':'; 
    return `${k}{{${styleBinding.substring(value.start-1, value.end-1)}}}`;
  });
}

function parseStyleBinding(style, styleBinding) {
  let styl = style? style.replace(/([^;])$/, '$1;'): '';
  const stylesStr = '('+styleBinding+')';
  const {ast} = babel.transform(stylesStr, {
    plugins: [
      {
        visitor: {
          ObjectExpression: function(path) {
            const {node} = path;
            if(node) {
              const {properties} = node;
              if(properties && properties.length) {
                path.replaceWith(
                  t.stringLiteral(styl + genStyles(styleBinding, properties).join(';'))
                );
              }
            }
          },
          CallExpression: function(path) {
            const {node} = path;
            if(node) {
              return path.replaceWith(t.stringLiteral(`{{${styleBinding.substring(node.start - 1, node.end - 1)}}}`));
            }
          },
          Identifier: function(path) {
            const {node} = path;
            if(node) {
              return path.replaceWith(t.stringLiteral(`{{${styleBinding.substring(node.start - 1, node.end - 1)}}}`));
            }
          },
          BinaryExpression: function(path) {
            const {node} = path;
            if(node) {
              return path.replaceWith(t.stringLiteral(`{{${styleBinding.substring(node.start - 1, node.end - 1)}}}`));
            }
          }
        }
      }
    ]
  });
  const {code} = babel.transformFromAst(ast, styleBinding);
  return code;
}

module.exports = {
  parseClassBinding,
  parseStyleBinding
} 