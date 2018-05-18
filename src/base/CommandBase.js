"use strict";

/**
 * Command base class. It provides some basic stuff. Each command has to
 * extend this class.
 *
 * More information about how to configure a command/option can be found
 * here: https://www.npmjs.com/package/cli
 *
 * @abstract
 */
class CommandBase {
  /**
   * Constructor of the command.
   *
   * @param {string} name The name of the command - the one that will be used in the app.
   * @param {string} description The description of the command.
   */
  constructor(name, description) {
    /**
     * The name of the option that enables this command.
     *
     * @property {string}
     */
    this.name = name;
    /**
     * A description of the command
     *
     * @property {string}
     */
    this.description = description || "";

    /**
     * The options of the command.
     *
     * @property {object}
     * @protected
     */
    this._options = {};

    /**
     * The shortnames of various options.
     *
     * @property {object}
     * @protected
     */
    this._shortNames = {};
  }

  /**
   * Returns the options defined for the current command.
   *
   * @return {object}
   */
  get options() {
    return this._options;
  }

  /**
   * Returns the name of the project.
   *
   * @return {string}
   */
  get projectName() {
    return "puzzle-framework";
  }

  /**
   * Add a new option to the options object.
   *
   * @protected
   * @param {string} name The name of the option.
   * @param {string} [description=] The description of the option.
   * @param {string} [type=as-is] The type of the option.
   * @param {string|boolean} [shortName=false] The short name of the option.
   * @param {*} [defaultValue] The default value of the option.
   */
  _addOption(name, description, type, shortName, defaultValue) {
    type = this._validateType(type);
    shortName = this._validateShortName(shortName);

    this._options[name] = [
      shortName,
      description || "",
      type || "as-is"
    ];

    if (shortName !== false) {
      this._shortNames[shortName] = name;
    }

    if (defaultValue !== null && defaultValue !== undefined) {
      this._options[name].push(defaultValue);
    }
  }

  /**
   * Validates the type of the option.
   *
   * @private
   * @param {string|boolean|number} type The type of the options.
   *
   * @return {string|boolean|number}
   */
  _validateType(type) {
    const validTypes = [
      "as-is", "string",
      "int", "number", "num", "time", "seconds", "secs", "minutes", "mins", "x", "n",
      "date", "datetime", "date_time",
      "float", "decimal",
      "path", "file", "directory", "dir",
      "email",
      "url", "uri", "domain", "host",
      "ip",
      "bool", "boolean", "on",
      "false", "off", false, 0
    ];

    return validTypes.indexOf(type) < 0 ? "as-is" : type;
  }

  /**
   * Validates the short name of the option.
   *
   * @private
   * @param {string} shortName The type of the options.
   *
   * @return {string|boolean}
   */
  _validateShortName(shortName) {
    if (shortName === null || shortName === undefined || shortName === "") {
      return false;
    }

    if (typeof shortName !== "string") {
      return false;
    }

    return !(this._shortNames[shortName] !== null &&
      this._shortNames[shortName] !== undefined) ? shortName : false;
  }

  /**
   * The actual code of the command.
   *
   * @abstract
   * @param {array} args The arguments of the command.
   * @param {object} options The options of the command.
   */
  run(args, options) {

  }
}

module.exports = CommandBase;
