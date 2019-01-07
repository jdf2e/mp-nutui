const {components} = require('../config');

function createWxJson(filename) {
    if(filename) {
        const using = components[filename];
        if(using) {
            const wxJson = {
                usingComponents: using
            };
            return wxJson;
        }
    }
    return {};
}

module.exports = createWxJson;