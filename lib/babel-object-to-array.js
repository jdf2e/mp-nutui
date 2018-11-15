const babel = require('babel-core');
const t = require('babel-types');

const {ast} = babel.transform("[{'nut-cell-link':isLink}]", {
  plugins: [
    {
      visitor: {
        ObjectExpression: function(path) {
          console.log(path.node.properties)
        }
      }
    }
  ]
});

// console.log(ast)