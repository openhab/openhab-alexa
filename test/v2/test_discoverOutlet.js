module.exports = {
  description: "outlet plug",
  mocked: [
    {
      "link": "https://localhost:8443/rest/items/outlet1",
      "type": "Switch",
      "name": "outlet1",
      "label": "Outlet",
      "tags": ["Outlet"]
    }
  ],
  expected: {
    "outlet1": {
      "actions": [
        "turnOn",
        "turnOff"
      ],
      "applianceTypes": ["SMARTPLUG"],
      "friendlyName": "Outlet"
    }
  }
};
