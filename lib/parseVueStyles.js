const sass = require('sass.js');

function compileSass(scss = '') {
  return Promise((rs, rj) => {
    sass.compile(scss, function(result) {
      const {status, text, formatted} = result;
      if(status === 0) rj(formatted);
      if(status === 1) {
        rs(text);
      }
    });
  });
}

async function parseVueStyles(styles) {
  const res = await compileSass(`\n.nut-cell {
    display: block;
    -webkit-tap-highlight-color: transparent;
    &.nut-cell-link:active {
        background-color: $dark-color !important;
    
  }}`);
  console.log(res)
}

parseVueStyles();