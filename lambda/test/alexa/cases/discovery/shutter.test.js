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

module.exports = {
  description: 'shutter',
  items: [
    {
      type: 'Dimmer',
      name: 'windowShutter1',
      label: 'Window Shutter 1',
      metadata: {
        alexa: {
          value: 'Shutter'
        }
      }
    },
    {
      type: 'Rollershutter',
      name: 'windowShutter2',
      label: 'Window Shutter 2',
      metadata: {
        alexa: {
          value: 'RangeController.rangeValue',
          config: {
            category: 'EXTERIOR_BLIND',
            friendlyNames: '@Setting.Opening',
            supportedRange: '0:100:10',
            unitOfMeasure: 'Percent',
            actionMappings: 'Close=0,Open=100,Lower=(-10),Raise=(+10)',
            stateMappings: 'Closed=0,Open=1:100'
          }
        }
      }
    }
  ],
  catalog: {
    '@Setting.Position': [
      {
        text: 'Position',
        locale: 'en-US'
      }
    ]
  },
  expected: {
    windowShutter1: {
      capabilities: ['Alexa.RangeController:PositionState.rangeValue', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['EXTERIOR_BLIND'],
      friendlyName: 'Window Shutter 1',
      propertyFlags: {
        'Alexa.RangeController:PositionState': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.RangeController:PositionState': {
          friendlyNames: ['text:Position:en-US', 'asset:Alexa.Setting.Opening']
        }
      },
      configuration: {
        'Alexa.RangeController:PositionState': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 1 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        }
      },
      semantics: {
        'Alexa.RangeController:PositionState': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close', 'Alexa.Actions.Lower'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 0 } }
            },
            {
              actions: ['Alexa.Actions.Open', 'Alexa.Actions.Raise'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 100 } }
            }
          ],
          StatesToRange: [
            {
              states: ['Alexa.States.Open'],
              range: { minimumValue: 1, maximumValue: 100 }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 0
            }
          ]
        }
      },
      cookie: [
        {
          name: 'RangeController',
          instance: 'PositionState',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.Position', '@Setting.Opening'],
            supportedRange: [0, 100, 1],
            unitOfMeasure: 'Percent',
            actionMappings: { Close: '0', Open: '100', Lower: '0', Raise: '100' },
            stateMappings: { Closed: '0', Open: '1:100' }
          },
          item: { name: 'windowShutter1', type: 'Dimmer' }
        }
      ]
    },
    windowShutter2: {
      capabilities: ['Alexa.RangeController:windowShutter2.rangeValue', 'Alexa.EndpointHealth.connectivity', 'Alexa'],
      displayCategories: ['EXTERIOR_BLIND'],
      friendlyName: 'Window Shutter 2',
      propertyFlags: {
        'Alexa.RangeController:windowShutter2': {
          proactivelyReported: false,
          retrievable: true,
          nonControllable: false
        }
      },
      resources: {
        'Alexa.RangeController:windowShutter2': {
          friendlyNames: ['asset:Alexa.Setting.Opening']
        }
      },
      configuration: {
        'Alexa.RangeController:windowShutter2': {
          supportedRange: { minimumValue: 0, maximumValue: 100, precision: 10 },
          unitOfMeasure: 'Alexa.Unit.Percent'
        }
      },
      semantics: {
        'Alexa.RangeController:windowShutter2': {
          ActionsToDirective: [
            {
              actions: ['Alexa.Actions.Close'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 0 } }
            },
            {
              actions: ['Alexa.Actions.Open'],
              directive: { name: 'SetRangeValue', payload: { rangeValue: 100 } }
            },
            {
              actions: ['Alexa.Actions.Lower'],
              directive: { name: 'AdjustRangeValue', payload: { rangeValueDelta: -10, rangeValueDeltaDefault: false } }
            },
            {
              actions: ['Alexa.Actions.Raise'],
              directive: { name: 'AdjustRangeValue', payload: { rangeValueDelta: 10, rangeValueDeltaDefault: false } }
            }
          ],
          StatesToRange: [
            {
              states: ['Alexa.States.Open'],
              range: { minimumValue: 1, maximumValue: 100 }
            }
          ],
          StatesToValue: [
            {
              states: ['Alexa.States.Closed'],
              value: 0
            }
          ]
        }
      },
      cookie: [
        {
          name: 'RangeController',
          instance: 'Range:windowShutter2',
          property: 'rangeValue',
          parameters: {
            capabilityNames: ['@Setting.Opening'],
            supportedRange: [0, 100, 10],
            unitOfMeasure: 'Percent',
            actionMappings: { Close: '0', Open: '100', Lower: '(-10)', Raise: '(+10)' },
            stateMappings: { Closed: '0', Open: '1:100' }
          },
          item: { name: 'windowShutter2', type: 'Rollershutter' }
        }
      ]
    }
  }
};
