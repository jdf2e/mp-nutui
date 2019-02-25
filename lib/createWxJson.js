const {components} = require('../config');

function createWxJson(filename) {
    const wxJson = {
        "component": true
    };
    if(filename) {
        const using = components[filename];
        if(using) {
            wxJson.usingComponents = using;
        }
    }
    return wxJson;
}

module.exports = createWxJson;