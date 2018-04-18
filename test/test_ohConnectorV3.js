var assert = require('assert');
var ohv3 = require('../ohConnectorV3.js');
var rest = require('../rest.js');

describe('ohConnectorV3 Test', function () {

	describe('Discovery', function () {

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

		it('tagged light group and its tagged children should be discovered', function () {

			// Group:Switch:OR(ON,OFF) lightGroup ["Lighting"]
			// Color light1 (lightGroup) ["Lighting"]
			// Color light2 (lightGroup) ["Lighting"]
			input = [
				{
					"link": "https://localhost:8443/rest/items/light1",
					"type": "Color",
					"name": "light1",
					"category": "lightbulb",
					"tags": ["Lighting"],
				},
				{
					"link": "https://localhost:8443/rest/items/light2",
					"type": "Color",
					"name": "light2",
					"category": "lightbulb",
					"tags": ["Lighting"],
				},
				{
					"members": [
						{
							"link": "https://localhost:8443/rest/items/light1",
							"type": "Color",
							"name": "light1",
							"category": "lightbulb",
							"tags": ["Lighting"],
						},
						{
							"link": "https://localhost:8443/rest/items/light2",
							"type": "Color",
							"name": "light2",
							"category": "lightbulb",
							"tags": ["Lighting"],
						}
					],
					"groupType": "Switch",
					"function": {
						"name": "OR",
						"params": ["ON","OFF"]
					},
					"link": "https://localhost:8443/rest/items/lightGroup",
					"type": "Group",
					"name": "lightGroup",
					"category": "switch",
					"tags": ["Lighting"],
				}
			];

			ohv3.handleRequest(directive, context);

			var endpoints = capture.result.event.payload.endpoints;
			assert.equal(endpoints.length, 3);

			var capabilities = endpoints[0].capabilities;
			assert.equal(capabilities.length, 4);
			assert.equal(capabilities[0].interface, "Alexa");
			assert.equal(capabilities[1].interface, "Alexa.PowerController");
			assert.equal(capabilities[2].interface, "Alexa.BrightnessController");
			assert.equal(capabilities[3].interface, "Alexa.ColorController");

			capabilities = endpoints[1].capabilities;
			assert.equal(capabilities.length, 4);
			assert.equal(capabilities[0].interface, "Alexa");
			assert.equal(capabilities[1].interface, "Alexa.PowerController");
			assert.equal(capabilities[2].interface, "Alexa.BrightnessController");
			assert.equal(capabilities[3].interface, "Alexa.ColorController");

			capabilities = endpoints[2].capabilities;
			assert.equal(capabilities.length, 2);
			assert.equal(capabilities[0].interface, "Alexa");
			assert.equal(capabilities[1].interface, "Alexa.PowerController");
		});

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

	describe('BrightnessController', function() {

		// mock rest call
		var input;
		rest.postItemCommand = function(token, itemname, value, success) {
			success(input);
		};

		var capture = { "result" : null };
		var context = { "succeed": function(result) { capture.result = result; }};

		it('set brightness at color item', function () {
			var input = {
				"header": {
					"namespace": "Alexa.BrightnessController",
					"name": "SetBrightness",
					"payloadVersion": "3"
				},
				"endpoint": {
					"scope": {
						"type": "BearerToken",
						"token": ""
					},
					"endpointId": "light1",
					"cookie": {
						"propertyMap": "{\"PowerController\":{\"powerState\":{\"parameters\":{},\"itemName\":\"light1\"}},\"BrightnessController\":{\"brightness\":{\"parameters\":{},\"itemName\":\"light1\"}},\"ColorController\":{\"color\":{\"parameters\":{},\"itemName\":\"light1\"}}}"
					}
				},
				"payload": {
					"brightness": 20
				}
			};

			ohv3.handleRequest(input, context);

			var properties = capture.result.context.properties;
			assert.equal(properties.length, 4);
			assert.equal(properties[0].name, "powerState");
			assert.equal(properties[0].value, "ON");
			assert.equal(properties[1].name, "brightness");
			assert.equal(properties[1].value, 20);
			assert.equal(properties[2].name, "color");
		});
	});
});
