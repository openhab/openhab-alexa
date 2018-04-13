var assert = require('assert');
var ohv3 = require('../ohConnectorV3.js');
var rest = require('../rest.js');

describe('ohConnectorV3 Test', function () {
	describe('discover Items', function () {

		// mock rest call
		var input;
		rest.getItemsRecursively = function(token, success, failure) {
			success(input);
		};
			
		var directive = { 
			"header" : { "namespace" : "Alexa.Discovery" } ,
			"payload" : { "scope" : { "token" : ""} } 
		};
		var capture = { "result" : null };
		var context = { "succeed": function(result) { capture.result = result; }};
		
		it('single color light should be discovered', function () {
			
			input = [
				{
					"link": "https://localhost:8443/rest/items/light1",
					"type": "Color",
					"name": "light1",
					"category": "lightbulb",
					"tags": ["Lighting"],
				}
			];

			ohv3.handleRequest(directive, context);

			var endpoints = capture.result.event.payload.endpoints;
			assert.equal(endpoints.length, 1);
			var capabilities = endpoints[0].capabilities;
			assert.equal(capabilities.length, 4);
			assert.equal(capabilities[0].interface, "Alexa");
			assert.equal(capabilities[1].interface, "Alexa.PowerController");
			assert.equal(capabilities[2].interface, "Alexa.BrightnessController");
			assert.equal(capabilities[3].interface, "Alexa.ColorController");
		});
	});
});
