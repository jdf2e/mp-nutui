const {default: template} = require("@babel/template");
const {default: generate} = require("@babel/generator");
const t = require("@babel/types");
const {parseScript: parseJS} = require("./babel-plugins");

const templFn = template`
  Component({
    options: {
      multipleSlots: true
    },
    properties: PROPERTIES,
    data: DATA,
    methods: METHODS,
    created: CREATED,
    ready: MOUNTED
  });
`;



function parseScript(script) {
  const {
    properties,
    data,
    methods,
    createdBody,
    mountedBody
  } = parseJS(script);
  const templAst = templFn({
    PROPERTIES: t.objectExpression(properties || []),
    DATA: t.objectExpression(data || []),
    METHODS: t.objectExpression(methods || []),
    CREATED: t.functionExpression(null, [], createdBody || t.blockStatement([])),
    MOUNTED: t.functionExpression(null, [], mountedBody || t.blockStatement([]))
  });
  const {code} = generate(templAst);
  console.log(code)
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
parseScript(SCRIPT);