/**
 * Copyright (c) 2010-2022 Contributors to the openHAB project
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0
 */

/**
 * Defines alexa semantics class
 *  https://developer.amazon.com/docs/alexa-voice-service/generic-controllers.html#semantics
 */
class AlexaSemantics {
  /**
   * Constructor
   */
  constructor() {
    this._semantics = { actionMappings: [], stateMappings: [] };
  }

  /**
   * Adds action to directive semantic mapping
   * @param {String} name
   * @param {Object} directive
   */
  addActionToDirective(name, directive) {
    const actionMappings = this._semantics.actionMappings;
    // Define alexa action semantic id
    const action = AlexaActionSemantic.get(name);
    // Find defined action mappings index with same directive
    const index = actionMappings.findIndex((map) => JSON.stringify(map.directive) === JSON.stringify(directive));
    // Update existing mapping actions list if found, otherwise add new mapping
    if (index > -1) {
      actionMappings[index].actions.push(action);
    } else {
      actionMappings.push({
        '@type': 'ActionsToDirective',
        actions: [action],
        directive: directive
      });
    }
  }

  /**
   * Adds state to range semantic mapping
   * @param {String} name
   * @param {Object} range
   */
  addStateToRange(name, range) {
    const stateMappings = this._semantics.stateMappings;
    // Define alexa state semantic id
    const state = AlexaStateSemantic.get(name);
    // Find defined state mappings index with same range
    const index = stateMappings.findIndex((map) => JSON.stringify(map.range) === JSON.stringify(range));
    // Update existing mapping states list if found, otherwise add new mapping
    if (index > -1) {
      stateMappings[index].states.push(state);
    } else {
      stateMappings.push({
        '@type': 'StatesToRange',
        states: [state],
        range: range
      });
    }
  }

  /**
   * Adds state to value semantic mapping
   * @param {String} name
   * @param {Number}  value
   */
  addStateToValue(name, value) {
    const stateMappings = this._semantics.stateMappings;
    // Define alexa state semantic id
    const state = AlexaStateSemantic.get(name);
    // Find defined state mappings index with same value
    const index = stateMappings.findIndex((map) => map.value === value);
    // Update existing mapping states list if found, otherwise add new mapping
    if (index > -1) {
      stateMappings[index].states.push(state);
    } else {
      stateMappings.push({
        '@type': 'StatesToValue',
        states: [state],
        value: value
      });
    }
  }

  /**
   * Returns serialized semantics object
   * @return {Object}
   */
  toJSON() {
    const { actionMappings, stateMappings } = this._semantics;

    return {
      ...(actionMappings.length > 0 && { actionMappings }),
      ...(stateMappings.length > 0 && { stateMappings })
    };
  }
}

/**
 * Defines alexa action semantic class
 */
class AlexaActionSemantic {
  /**
   * Defines open action semantic
   * @type {String}
   */
  static OPEN = 'Open';

  /**
   * Defines close action semantic
   * @type {String}
   */
  static CLOSE = 'Close';

  /**
   * Defines raise action semantic
   * @type {String}
   */
  static RAISE = 'Raise';

  /**
   * Defines lower action semantic
   * @type {String}
   */
  static LOWER = 'Lower';

  /**
   * Returns alexa semantic id for given action name
   * @param  {String} name
   * @return {String}
   */
  static get(name) {
    return 'Alexa.Actions.' + name;
  }
}

/**
 * Defines alexa state semantic class
 */
class AlexaStateSemantic {
  /**
   * Defines open state semantic
   * @type {String}
   */
  static OPEN = 'Open';

  /**
   * Defines closed state semantic
   * @type {String}
   */
  static CLOSED = 'Closed';

  /**
   * Returns alexa semantic id for given state name
   * @param  {String} name
   * @return {String}
   */
  static get(name) {
    return 'Alexa.States.' + name;
  }
}

/**
 * Defines custom action semantic class
 */
class CustomActionSemantic {
  /**
   * Defines resume action semantic
   * @type {String}
   */
  static RESUME = 'Resume';

  /**
   * Defines pause action semantic
   * @type {String}
   */
  static PAUSE = 'Pause';

  /**
   * Defines stop action semantic
   * @type {String}
   */
  static STOP = 'Stop';

  /**
   * Defines turn on action semantic
   * @type {String}
   */
  static TURN_ON = 'TurnOn';

  /**
   * Defines turn off action semantic
   * @type {String}
   */
  static TURN_OFF = 'TurnOff';
}

module.exports = AlexaSemantics;
module.exports.AlexaActionSemantic = AlexaActionSemantic;
module.exports.AlexaStateSemantic = AlexaStateSemantic;
module.exports.CustomActionSemantic = CustomActionSemantic;
