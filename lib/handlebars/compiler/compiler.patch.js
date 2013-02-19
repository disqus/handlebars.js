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

// END(BROWSER)

return Handlebars;

};