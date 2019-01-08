<template>
  <div style="font-size:12px; text-align:left">
    <h3>babel for component steps --- @babel/types处理</h3>

    <ul>
      <li>1. 组件的对外属性转换 => props 替换为 properties</li>
      <li>2. Component构造器转换 => export default { 替换为 Component({</li>
      <li>3. Component构造器转换 => 最后的} 替换为})</li>
      <li>
        4. 组件的内部数据转换 => 取值 vue中，通过this.a取值(data中的值),
        小程序中，通过this.data.a取值
      </li>
      <li>5. vue中，通过this.a = "value" 赋值 ;
        <p></p>
        小程序中，通过this.setData({key:value})改变data中的对应值。
      </li>
      <li>6. 组件内部数据处理 data函数转换为对象
        <p></p>
        <textarea name id cols="30" rows="10">

             data(){
              return {
                num:1 
              }
            }, 
            转换为 
            data:{
              num: 1
            }
           </textarea>
      </li>

      <li>7. 组件的触发事件转换 => vue 中 this.$emit('callChangeCount', _data); 小程序中：triggerEvent</li>
      <li>
        自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项：
        this.triggerEvent('customevent', {}, { bubbles: true, composed: true }) // 会依次触发 pageEventListener2 、 anotherEventListener 、 pageEventListener1
      </li>

      <li>
        8. 小程序 中== properties 对外属性值： type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
        value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
        vue 中== value 为 default
        （不能乱用）
      </li>
    </ul>

    <hr>
    <ul>
      <h3>后续考虑的vue语法 转换能力增加</h3>
      <li>vue中 props:简写，小程序是否支持调研</li>
    </ul>

    <hr>
    <ul>
      <li>待办，取data属性中的值</li>
      <li>删除this表达式this.data.$B = 'B is Change';</li>
      <li>生命周期的处理</li>

      <B>OK 约定 ：</B>
      <li>
        this.data.xx是用来获取页面data对象的----------只是js（逻辑层）数据的更改；
        this.setData是用来更新界面的---------用于更新view层的。
      </li>

      <li>
        11-29表达式处理：
        this表达式处理,发现this.data.xx = 1, 一律删除，this.data.a的默认保留
        this.setData({});不会受到影响
      </li>
      <li>
        //created, watch  的转换 对应小程序没有
        // mounted 转换为 ready
      </li>
    </ul>
  </div>
</template>
<style scoped>
ul li {
  text-align: left;
}
</style>
<script>
const t = require("@babel/types");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

import * as babylon from "babylon";
const parser = require("@babel/parser");
export default {
  mounted() {
    this.traverseAst();
  },
  data() {
    return {};
  },
  methods: {
    traverseAst(str) {
      var dataAST, MethodsAst, propsAst;
      //用于存放ExportDefaultDeclaration下所有的属性（data,props,methods,以及其他生命周期的钩子等）
      var propertiesAST;
      var testOBJ
      //存放`this.data`中的属性
      var datas = [];
      //输入
      var code = `
               export default {
                  name: "footerCom",//去掉name
                  props: {//组件的对外属性
                      code:{
                          type:String,
                          value:abc
                      },
                      max: {//注释信息。。。
                          type: Number,
                          value: 99
                      }
                  },
                  data(){//组件的内部数据
                      return {
                        num:1,
                        $A: "a", 
                      }
                  },
                  methods: {
                     textFn() {
                       this.num  = 2 //isExpressionStatement true
                       this.$A  = 12 //isExpressionStatement true
                    },
                    fn1(){
                      this.$emit('myEventIn2', _data);// this.triggerEvent('customevent', {}, { bubbles: true, composed: true })
                      //先转$emit为triggerEvent
                    }
                  },
                  mounted(){
                    this.textFn()
                    //mounted转为 ready(){} 或 ready:function(){}
                  },
                  created(){
                    this.$emit('myEvent', _data);
                    this.fn1()
                    //created转为created 或者 attached
                  },
                  watch: {
                    //mp 不支持
                  },
                  computed: {
                    //mp 不支持
                  },
                  destroyed: function(){
                    //这种写法后续迭代增加
                    //转为 detached
                  },
                  destroyed(){
                    //destroyed转为 detached
                  }
                }
                `;
      //to ast
      const ast = babylon.parse(code, {
        sourceType: "module",
        plugins: ["flow"]
      });
      console.log("转换前",ast)
      //转换 ast
      //
      traverse(ast, {
        enter(path) {
           if (path.node.type === "ThisExpression") {// 不会遍历函数内部的this，只遍历钩子内部一级
              if(path.parent.property.name === "$emit"){
                  path.parent.property.name = "triggerEvent"
              }
            console.log("ThisExpression: " ,path, path.parent.property.name);
          }; 
        // console.log("enter0: " + path.node.type);
         if(path.node.type === "ObjectMethod"){
                   if(path.node.key.name === "mounted"){
                     path.node.key.name = "ready"
                   }
                   else if(path.node.key.name === "created"){
                       path.node.key.name = "attached"
                   }else if(path.node.key.name === "destroyed"){
                     path.node.key.name = "detached"
                   }else if(path.node.type === "ThisExpression"){
                        console.log("ObjectMethod内部this表达式",path.node)
                   }else{
                       void null
                   }  

         }
        },
        ObjectMethod(path){alert();
          console.log("enter22: " + path.node.key.name);
        },
       /*  ExpressionStatement(path){ console.log("enter: " + path.node.type);
           
        }, */
     /*    ThisExpression(path){
          console.log("ThisExpression: " + path.node.type);
        }, */
        // 替换props为properties与this.prop转为this.data.prop
        ObjectProperty(path) {
         // console.log("enter11: " + path.node.key.name);
          //从data中提取数据属性  X废弃X
          if (path.node.key.name === "data") {
            path.traverse({
              ReturnStatement(path) {
                path.traverse({
                  ObjectProperty(path) {
                    datas.push(path.node.key.name);
                    path.skip(); // if checking the children is irrelevant
                  }
                });
                path.skip();
              }
            });
          }
          else if(path.node.key.name === "watch"){
            path.remove();
            console.log("mp不支持 watch")
          }
          else if(path.node.key.name === "props"){
              path.node.key.name = "properties";
          }
          else if(path.node.key.name === "name"){
            path.remove()
          }  
          else if(path.node.key.name === "computed"){
            path.remove();
            console.log("mp不支持 computed")
          }  
          else if (path.node.key.name === "methods") {
            path.traverse({
              enter(path) {
                //console.log("内部二级path - enter : " + path.node.type);
              },

              //修改数据属性至this.data.prop等
              MemberExpression(path) {
                traverse(ast, {
                  enter(path) {
                    // console.log("内部二级path - enter : " + path.node.type);
                
                  },
                  BinaryExpression(path) {
                    
                    // 注意这里要有判断，否则会无限进入`BinaryExpression`
                    // https://stackoverflow.com/questions/37539432/babel-maximum-call-stack-size-exceeded-while-using-path-replacewith
                    if (path.node.operator === "+") {
                      path.replaceWith(
                        t.binaryExpression("*", path.node.left, path.node.right)
                      );
                    }
                  }
                });

                let datasVals = datas.map((item, index) => {
                  return item.key.name; //拿到data属性中的第一级
                });
                //有等于号的this.a=1，改变为this.setData({});
                //没有等于号的this.a, 转变为 this.data.a
                if (
                  path.node.object.type === "ThisExpression" &&
                  datasVals.includes(path.node.property.name)
                ) {
                  // console.log("path.node.object",path.node)
                  path.get("object").replaceWithSourceString("this.data");
                  //判是不是赋值操作
                  if (
                    (t.isAssignmentExpression(path.parentPath) &&
                      path.parentPath.get("left") === path) ||
                    t.isUpdateExpression(path.parentPath)
                  ) {
                    // find path
                    const expressionStatement = path.findParent(parent =>{
                      
                      parent.isExpressionStatement()

                    }
                    );
                    // 创建setData
                    if (expressionStatement) {
                     console.log("expressionStatement", generate(expressionStatement, {}, code).code )
                      //var dataValItem  =this.data.path.node.property.name
                      const finalExpStatement = t.expressionStatement(
                        t.callExpression(
                          t.memberExpression(
                            t.thisExpression(),
                            t.identifier("setData")
                          ),
                          [
                            t.objectExpression([
                              t.objectProperty(
                                t.identifier(path.node.property.name),
                                t.identifier(
                                  `this.data.${path.node.property.name}`
                                )
                              )
                            ])
                          ]
                        )
                      );debugger
                      console.log("finalExpStatement",finalExpStatement)
                      expressionStatement.insertAfter(finalExpStatement);
                    }
                    //path.remove();
                  }
                }
              },
              //表达式处理XXX
              BinaryExpression(path) {
                debugger;
                console.log(
                  "this表达式处理,发现this.data.a = 1, 一律删除，this.data.a的默认保留"
                );
                if (
                  path.node.left != null &&
                  path.node.left.type === "Identifier" &&
                  path.node.left.name === "this" &&
                  path.node.operator === "="
                ) {
                  path.node.left.name = "aaa";
                }
              }
            });
          }
          path.skip();
        },

        //data 转换为 object
        ObjectMethod(path) {
    
         // console.log("path.node.key.name ", path.node); // data, add, textFn
          // console.log("path.node ",path.node )// data, add, textFn
          if (path.node.key.name === "data") {
            path.traverse({
              BlockStatement(p) {
                datas = p.node.body[0].argument.properties;
              }
            });
            //生成objectExpression
            const objectExpression = t.objectExpression(datas);
            //创建data对象并赋值
            const dataProperty = t.objectProperty(
              t.identifier("data"),
              objectExpression
            );
            //拿到ts后的data
            dataAST = dataProperty;
            // 插入到原data函数下方
            path.insertAfter(dataProperty);
            path.remove();
          }
        },
        //export default => Component构造器转换
        ExportDefaultDeclaration(path) {
          //创建  CallExpression  Component({})
          function insertBeforeFn(path) {
            const objectExpression = t.objectExpression(propertiesAST);
            testOBJ = t.expressionStatement(
                t.callExpression(
                    t.identifier("Compontents"),[
                      objectExpression
                    ]
                )
            );
            //path.remove();
           // console.log("testOBJ",testOBJ)
          }
          if (path.node.type === "ExportDefaultDeclaration") {
            if (path.node.declaration.properties) {
              //提取属性并存储
              propertiesAST = path.node.declaration.properties;
             // console.log("propertiesAST", propertiesAST);
              //创建MP AST包裹对象
              insertBeforeFn(path);

              //builderMPAST(t)
              //ast开始与结尾处插入
              path.insertBefore(
                t.expressionStatement(t.stringLiteral("start.."))
              );
              path.insertAfter(t.expressionStatement(t.stringLiteral("end..")));
           
            }
            // 插入到原data函数下方
            // path.insertAfter("11");

            var builderTest = t.binaryExpression(
              "*",
              t.identifier("a"),
              t.identifier("b")
            );
            // console.log("builderTest",builderTest)
            // path.remove()
            // path.node.type = "ExpressionStatement"
          }
          //console.log(path.node.type,path)
        }
      });
      //var outJSstr = generate(ast, {}, str).code;
      //console.log("存放`this.data`中的属性", datas);
      console.log(generate(testOBJ, {}, code).code);


      function builderMPAST(t) {
        const MPAST = t.objectProperty(
          t.identifier("myprop"),
          t.stringLiteral("hello my property")
        );
      }
      //builderMPAST();
    }
  },
  created() {

    var types={
      callExpression: "调用表达式",
      MemberExpression: "成员表达式",//this.num
      NumericLiteral :  "数字文字",//2
      stringLiteral : "字符串文字",// "字符串aaa"
      ExpressionStatement : "表达式语句",//component() 或者 一行代码
      AssignmentExpression : "赋值表达式", // this.num =2
      binaryExpression : "二进制表达式", // a*b
      Identifier : "标识符", // num

    }
    //赋值表达式 : this.num = 2
    var  AssignmentExpression ={
      operator: "=",
      left:{
        MemberExpression : {
          MemberExpression:{
            ThisExpression: "this",
            Identifier:"num"
          }
        }
      },
      right:{
        NumericLiteral : 2
      }

    }






    
/**_____________________ 小程序自定义组件生命周期 与其他钩子函数_____________________**/



//created 组件实例化，但节点树还未导入，因此这时不能用setData
//
//attached 节点树完成，可以用setData渲染节点，但无法操作节点
//
//ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点
//
//moved 组件实例被移动到树的另一个位置
//
//detached 组件实例从节点树中移除
var mpLife = {
    created: function(){}, // 组件在内存中创建完毕执行
    attached: function(){}, // 组件挂载之前执行
    ready: function() {}, // 组件挂载后执行
    detached: function(){}, // 组件移除执行
    moved: function(){}, // 组件移动的时候执行
}

//**_____________________ vue组件的生命周期函数 与其他钩子_____________________**/
var VueLife = {
  beforeCreate(){},
  created(){},
  beforeMount(){},
  mounted(){},
  beforeUpdate(){},
  updated(){},
  beforeDestroy(){},
  destroyed(){},
}  


//1.  计算属性   computed: {}  与  watch:{}
//2. props简写   

 /* props: {
      to: {},
      replace: Boolean
    }, */

   // 小程序是否支持？
//3. provide() {} 钩子  不常见
//4.  this.$el.querySelectorAll('.el-breadcrumb__item')  //查找组件的class   不常见
//5. 


//**_____________________ vue转换小程序生命周期 的转换 _____________________**/
//  1. mounted() {} 转换为  ready: function() {}, 
//  2. created(){} 小程序支持 不用转换   或者转换为 attached(){}  需要调试
//  3. destroyed() {} 转换为  detached(){}  
//  4. 计算属性   computed: {}  与  watch:{} 小程序不支持  不做转化，暂不支持
//  5. 

/**_____________________ vue 自定义事件 父组件触发子组件的自定义事件   父组件获取子组件内部的事件和参数 _____________________**/
//父组件
/*  <my-child abcClick="sayHello"></my-child>
   method: {
        sayHello(Num,Str) {
            alert('hello world~~' + Num + Str)
        }
    } */
//子组件
/*      <button @click="childClick"></button>
      method: {
        childClick() {
          // 参数一： 事件名称（在父组件调用里使用）， 参数二： 传递给父组件的参数数据
            this.$emit('abcClick', this.myNum, this.myStr)
        }
    } */
//  this.$emit('myEvent')
/**_____________________mp 自定义事件 微信小程序中是通过triggerEvent来给父组件传递信息的 _____________________**/
//----父组件事件使用
/* <eg bind:myevent="onMyEvent"></eg>

onMyEvent: function (e) {
  console.log(e)
} */

//-----自定义组件中
//自定义组件触发事件时，需要使用 triggerEvent 方法，指定事件名、detail对象和事件选项
/* <button bindtap="onTap">点击这个按钮将触发“myevent”事件</button>

Component({
  properties: {}
  methods: {
    onTap: function(){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    }
  }
})  */

/**_____________________注意点： _____________________**/

//  1. properties 按照 如下方式写：
/*    num: {    
      type: Number,
      value: 1
    } */
// 1. 去掉name   export default {
//    name: 'ElBreadcrumbItem'}


  }
};
</script>








