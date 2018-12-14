const compiler = require('vue-template-compiler');
var style_html = require('./formatHtml')
const {parseClassBinding, parseStyleBinding} = require('./babel-plugins');

const specilAttrs = [
  'style', 
  'class', 
  'v-for', 'v-if', 'v-else', 'v-else-if',
  'v-show', 'v-hide',
  'v-html', 'v-text',
  'v-model', 'v-bind',
  'v-pre', 'v-cloak',
  'v-once',
  'key', 'ref', 'slot', 'slot-scope', 'scope', 'is'
];

function parseTemplate(source) {
  const {ast} = compiler.compile(source);
  // console.log(createMPtemplate(ast));
  return style_html(createMPtemplate(ast), 2);
 
}

function mapChildren(children = []) {
  return children.map(cd => createMPtemplate(cd)).join('');
}

function createMPtemplate(node) {
  const {
    type,
    tag,
    text,
    attrsMap,
    children
  } = node;
  // type: 1 > tag
  // type: 2 > expression
  // type: 3 > text
  const _tag = createTag(tag, attrsMap);
  let mpTemplate = '';
  if(type == 1) {
    mpTemplate = `<${[
      _tag,
      createStyle(attrsMap),
      createClass(attrsMap),
      parseNormalAttrs(attrsMap),
      createWxFor(node),
      createCondition(node)
    ].join('')}>${children && children.length? mapChildren(children): ''}</${_tag}>`;
  }
  if(type == 2 || type == 3) {
    mpTemplate =  text;
  }                   

  return mpTemplate;
}

function createStyle(attrsMap = {}) {
  const {style = '', ':style': styleBinding = '', 'v-bind:style': bindStyle = ''} = attrsMap;
  let stylBindStr = '';
  if(styleBinding) stylBindStr = styleBinding;
  if(bindStyle) stylBindStr = bindStyle;
  return style || stylBindStr? ` style=${parseStyleBinding(style, stylBindStr).replace(/;$/, '')}`: '';
}

function createClass(attrsMap = {}) {
  const {'class': clas = '', ':class': classBinding = '', 'v-bind:class': bindClass = ''} = attrsMap;
  let clasBindStr = '';
  if(classBinding) clasBindStr = classBinding;
  if(bindClass) clasBindStr = bindClass;
  let clasStr = ' class="';
  if(clas) {
    clasStr += `${clas} `;
  }
  if(clasBindStr) {
    clasStr += `${parseClassBinding(clasBindStr)}`;
  }
  return clasStr + '"';
}

function createTag(tag = 'text', attrsMap = {}) {
  let _tag = tag;
  const {type} = attrsMap;
  if(tag === 'input' && type) {
    if(type === 'checkbox' || type === 'radio') _tag = type;
  }
  if(tag === 'div') _tag = 'view';
  if(tag === 'span') _tag = 'text';
  if(tag === 'img') _tag = 'image';

  return _tag;
}

function parseNormalAttrs(attrsMap = {}) {
  const attrs = Object.keys(attrsMap);
  let attrStr = '';
  const vReg = /^(v-bind)?:/;
  attrs.length && attrs.forEach(attr => {
    const _attr = attr.replace(vReg, '');
    const v = attrsMap[attr];
    if(/^(@|v-on:)[^(v\-on)]/.test(attr)) {
      // 排除事件
      let eventBar = attr.replace(/^(@|v-on:)/, '');
      if(eventBar) {
        eventBar = eventBar.split('.');
        const evtName = eventBar[0];
        attrStr += (` ${~eventBar.slice(1).indexOf('stop')? 'catch': 'bind'}:${evtName === 'click'? 'tap': evtName}="${v}"`);
      }
    }else if(!~specilAttrs.indexOf(_attr)) {
      // 排除内置指令
      attrStr += (vReg.test(attr)? ` ${_attr}="{{${v}}}"`: ` ${_attr}="${v}"`);
    }
  });
  return attrStr;

}

function createWxFor({
  for: _for,
  alias,
  iterator1,
  iterator2,
  key,
  forProcessed
} = {}) {
  if(forProcessed) {
    let indexName = 'index';
    let itemName = 'item';
    let keyName = key;
    if(!iterator1 && !iterator2) {
      itemName = alias;
    }else if(iterator1 && !iterator2) {
      
      if(iterator1 === 'index') {
        indexName = iterator1;
      }else if(iterator1 === 'key') {
        keyName = iterator1;
      }else{
        itemName = alias;
        indexName = iterator1;
      }

    }else if(iterator1 && iterator2) {
      keyName = iterator1;
      indexName = iterator2;
    }
    // item
    // item, index
    // value, key
    // value, key, index
    return ` wx:for="{{${_for}}}" wx:key="{{${keyName}}}" wx:for-index="{{${indexName}}}" wx:for-item="{{${itemName}}}"`;
  }
  return '';
}

function createCondition({
  if: _if,
  elseif,
  else: _else
} = {}) {
  return _if? ` wx:if="{{${_if}}}"`: elseif? ` wx:elif="{{${elseif}}}"`: _else? ` wx:else`: '';
}

module.exports = parseTemplate;

// style,:style,v-bind:style
// class,:class,v-bind:class
// 小程序不支持单纯的传入的 computed 和 methods；

// @event,v-on:event

// :props,v-bind:props


// 标签转换
// div view
// span text
// img image
// input[type="checkbox"] <checkbox />
// input[type="radio"] <radio />
