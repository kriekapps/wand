'use strict';

describe('RestEditorApp', function () {
  var React = require('react/addons');
  var RestEditorApp, component;

  beforeEach(function () {
    var container = document.createElement('div');
    container.id = 'content';
    document.body.appendChild(container);

    RestEditorApp = require('components/RestEditorApp.js');
    component = React.createElement(RestEditorApp);
  });

  it('should create a new instance of RestEditorApp', function () {
    expect(component).toBeDefined();
  });
});
