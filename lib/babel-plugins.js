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
const SCRIPT = `
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
    return {
      a: 1,
      b: localStorage.getItem('b'),
      c: false
    };
  },
  mounted() {
    //
  },
  methods: {}
};
`;
function getDataProperty(value) {
  const {body} = value;
  if(body && body.length) {
    const [returnStatement] = body.filter(bd => bd.type === 'ReturnStatement');
    if(returnStatement) {
      return returnStatement.argument.properties;
    }
  }
}

function parseScript(script) {
  const templParams = {};
  babel.transform(script, {
    plugins: [{
      visitor: {
        ObjectProperty: function(path) {
          if(path.node) {
            const {key, value} = path.node;
            const propName = key.name;
            if(propName === 'props') {
              templParams.properties = value && value.properties;
            } 
            if(propName === 'data' && value.type === 'FunctionExpression') {
              templParams.data = getDataProperty(value);
            }
            if(propName === 'methods') {
              templParams.methods = value && value.properties;
            }
            if(propName === 'created') {
              templParams.createdBody = value.body;
            }
            if(propName === 'mounted') {
              templParams.mountedBody = value.body;
            }
          }
        },
        ObjectMethod: function(path) {
          if(path.node) {
            const {key, body} = path.node;
            const propName = key.name;
            if(propName === 'data') {
              templParams.data = getDataProperty(body);
            }
            if(propName === 'created') {
              templParams.createdBody = body;
            }
            if(propName === 'mounted') {
              templParams.mountedBody = body;
            }
          }
        }
      }
    }]
  });
  return templParams;
}
// parseScript(SCRIPT);

// handleClick(e, item, 'flag') => ['"{{e}}"', '"{{item}}""', 'flag']
function handleArguments(agrs = []) {
  if(agrs.length) {
    return agrs.map(({name, value, type}) => {
      const k = name || value;
      return `data-${k}="${type === 'StringLiteral'? k: `{{${k}}}`}"`;
    });
  }
}

function parseEventParams(evtStr = '') {
  let dataStr = [], callName = '';
  babel.transform(evtStr, {
    plugins: [
      {
        visitor: {
          CallExpression: function(path) {
            const {node} = path;
            if(node) {
              callName = node.callee.name;
              dataStr = handleArguments(node.arguments);
            }
          }
        }
      }
    ]
  });
  return {
    callName,
    dataStr
  }
}

console.log(parseEventParams('handleClick(e, item, "flag")'))

module.exports = {
  parseClassBinding,
  parseStyleBinding,
  parseScript,
  parseEventParams
} 