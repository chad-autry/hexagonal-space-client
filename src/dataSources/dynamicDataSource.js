"use strict";
/**
 * Since only a single constructor is being exported as module.exports this comment isn't documented.
 * The class and module are the same thing, the contructor comment takes precedence.
 * @module DataSource
 */

var sortedMap = require("collections/sorted-map");

/**
 * This function defines a datasource for the purpose of transforming items
 *
 * @constructor
 */
module.exports = function DataSource(
  context,
  addItemsString,
  removeItemsString,
  clearItemsString,
  forEachString,
  getAllString
) {
  var listeners = []; //The listeners registered for change events
  this.context = context;
  this.addItemsFunction = new Function("items", "context", addItemsString);
  this.removeItemsFunction = new Function(
    "items",
    "context",
    removeItemsString
  );
  this.clearItemsFunction = new Function("context", clearItemsString);
  this.forEachFunction = new Function("callback", "context", forEachString);
  this.getAllFunction = new Function("context", getAllString);

  this.addListener = function(listener) {
    listeners.push(listener);
  };

  this.clearListeners = function() {
    listeners = [];
  };

  /**
   * Add items to this datasource
   * @param {Object[]} items - An iterable (forEach) collection with items to add
   */
  this.addItems = function(items) {
    if (this.addItemsFunction(items, this.context)) {
      for (var i = 0; i < listeners.length; i++) {
        // Simply notifying there was a change, without going through the effort of providing a diff
        // Good 'nuff for current purposes
        listeners[i].onDataChanged({ added: items, removed: [] });
      }
    }
  };

  /**
   * Remove items from this datasource
   * Might not be implemented, a DS might clear and re-add each time
   * @param {Object[]} items - An iterable (forEach) collection with objects to remove
   */
  this.removeItems = function(items) {
    if (this.removeItemsFunction(items, this.context)) {
      for (var i = 0; i < listeners.length; i++) {
        listeners[i].onDataChanged({ added: [], removed: items });
      }
    }
  };

  /**
   * Silently clear without a change notification
   * Useful if a DS is cleared and then re-added on each change
   */
  this.clearSilent = function() {
    this.clearItemsFunction(this.context);
  };

  this.clear = function() {
    if (this.clearItemsFunction(this.context)) {
      for (var i = 0; i < listeners.length; i++) {
        listeners[i].onDataChanged({ added: [], removed: context.items });
      }
    }
  };

  /**
   * Iterate over ever item of this datasource with the provided callbacp
   * @param {forEachCallBack} callback - The callback
   */
  this.forEach = function(callback) {
    this.forEachFunction(callback, this.context);
  };

  /**
   * Get an iterable (forEach) collection of contained elements
   * Useful if a downstream DS just clears and adds all on upstream change
   */
  this.getAll = function() {
    return this.getAllFunction(this.context);
  };
};
