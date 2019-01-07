const {default: template} = require("@babel/template");
const {default: generate} = require("@babel/generator");
const t = require("@babel/types");
const traverse = require("@babel/traverse").default;
const babylon = require("babylon")



function traverseScriptAst(scriptStr) {
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
  const ast = babylon.parse(scriptStr, {
    sourceType: "module",
    plugins: ["flow"]
  });
  console.log("转换前",scriptStr)
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
    ObjectMethod(path){
      console.log("enter " + path.node.key.name);
    },
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
                  );
                  console.log("finalExpStatement",finalExpStatement)
                  expressionStatement.insertAfter(finalExpStatement);
                }
                //path.remove();
              }
            }
          },
          //表达式处理XXX
          BinaryExpression(path) {
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
      }
    }
  });
  //var outJSstr = generate(ast, {}, str).code;
  //console.log("存放`this.data`中的属性", datas);
  //console.log(generate(testOBJ, {}, code).code);

 return  generate(testOBJ, {}, code).code
  function builderMPAST(t) {
    const MPAST = t.objectProperty(
      t.identifier("myprop"),
      t.stringLiteral("hello my property")
    );
  }
  //builderMPAST();
}

module.exports = traverseScriptAst;