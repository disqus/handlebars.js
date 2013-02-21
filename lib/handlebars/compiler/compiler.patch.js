// This file contains overrides to original Handlebars compiler.
exports.attach = function(Handlebars) {

// BEGIN(BROWSER)

Handlebars.JavaScriptCompiler.prototype.setupHelper =  function(paramSize, name, missingParams) {
    var params = [];
    this.setupParams(paramSize, params, missingParams);
    var foundHelper = this.nameLookup('helpers', name, 'helper');
    if (name === 't') {
      params[0] = 'gettext(' + params[0] + ')';
    }
    return {
      params: params,
      name: foundHelper,
      callParams: ["depth0"].concat(params).join(", "),
      helperMissingParams: missingParams && ["depth0", this.quotedString(name)].concat(params).join(", ")
    };
};

// [invokeKnownHelper]
//
// On stack, before: hash, inverse, program, params..., ...
// On stack, after: result of helper invocation
//
// This operation is used when the helper is known to exist,
// so a `helperMissing` fallback is not required.
Handlebars.JavaScriptCompiler.prototype.invokeKnownHelper = function(paramSize, name) {
    var helper = this.setupHelper(paramSize, name);
    if (name === 'if' || name === 'unless') {
      // Note: "if !condition" is not supported
      var ops = ['&&', '\\|\\|', '==', '===', '!=', '!==', '>', '<', '>=', '<=', 'typeof', 'null'],
          opsRe = [],
          re = new RegExp('[\'"]+', 'g'),
          params = helper.params,
          options = params[params.length - 1],
          i, len, j, jlen;
      // remove options from parameters
      params.splice(params.length - 1, 1);
      // create array of operators regex
      for (i = 0, len = ops.length; i < len; i++) {
        opsRe.push(new RegExp('^[\'"]+' + ops[i] + '[\'"]+$'));
      }
      // test each parameter against every operator regex
      for (i = 0, len = params.length; i < len; i++) {
        var param = params[i];
        for ( j = 0, jlen = opsRe.length; j < jlen; j++) {
          // operator or keyword is found
          if (opsRe[j].test(param)) {
            // remove wrapping quotes from the operand
            params[i] = param.replace(re, '');
            if(params[i] === ''){
              params[i] = '""';
            }
            break;
          }
        }
      }
      // create parameters string
      helper.callParams = "depth0, (" + params.join(" ") + "), " + options;
    }
    this.push(helper.name + ".call(" + helper.callParams + ")");
  };

// END(BROWSER)

return Handlebars;

};