"use strict";

const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const rmfr = require("rmfr");
const download = require("download");

const CommandBase = require("../base/CommandBase");

/**
 * Project initialization command. Downloads the template from github
 * and creates a local version of the project.
 *
 * `puzzle project projectName [--lite/-l] [--force/-f] [--version/-v=latest]`
 *
 * @extends CommandBase
 */
class ProjectCommand extends CommandBase {
  /**
   * The constructor of the project command.
   */
  constructor() {
    super("project", "Project template install command");
    this._addOption("lite", "Lite version of the framework", "boolean", "l", false);
    this._addOption("force", "Force the project creation", "boolean", "f", false);
    this._addOption("version", "The version you want to install (without the v prefix)", "string", "v", "latest");

    this.tempPath = "";
    this.outputFolder = "";
  }

  /**
   * Runs the code that performs the copy of the template project.
   *
   * @param {array} args The arguments of the command.
   * @param {object} options The options of the command.
   */
  async run(args, options) {
    if (args.length < 1) {
      cli.error("Specify the project folder");
      return;
    }

    try {
      [this.projectFolder] = args;
      await this.validatePaths(args, options);

      const response = await axios.get(this._buildURL(options));
      await download(response.data.zipball_url, this.tempPath, {
        extract: true,
        strip: 1
      });

      fs.renameSync(this.tempPath, this.outputFolder);

      this._updateProject();
      cli.ok(`Project installed here: ${this.outputFolder}`);
      cli.ok("Please run `npm install` inside the project to install all the dependencies.");
    } catch (e) {
      cli.error("Unable to create the project!");
      cli.debug(e);
    }
  }

  /**
   * Builds the URL used to download the project.
   *
   * @param {object} options The options received from console.
   *
   * @return {string}
   */
  _buildURL(options) {
    let app = this.projectName;
    if (options.lite) {
      app = `${app}-lite`;
    }

    const base = "https://api.github.com/repos/spark-development";
    return `${base}/${app}-sample/releases/${this._versionString(options)}`;
  }

  /**
   * Builds the version string used to download the project.
   *
   * @param {object} options The options received from console.
   *
   * @return {string}
   */
  _versionString(options) {
    return options.version && options.version !== "latest" ? `tags/v${options.version}` : "latest";
  }

  /**
   * Validates the local paths used to download the project.
   *
   * @param {array} args The arguments received from console.
   * @param {object} options The options received from console.
   */
  async validatePaths(args, options) {
    this.outputFolder = path.resolve(this.projectFolder);
    this.tempPath = path.resolve(os.tmpdir(), "pfcli");
    if (!fs.existsSync(this.tempPath)) {
      fs.mkdirSync(this.tempPath);
    }
    this.tempPath = path.resolve(this.tempPath, `${Date.now()}`);
    cli.debug(this.tempPath);

    if (fs.existsSync(this.outputFolder) && !options.force) {
      throw new Error("Destination folder already exists. Either use --force (-f) or delete the existing project.");
    }
    if (fs.existsSync(this.outputFolder) && options.force) {
      await rmfr(this.outputFolder);
    }
  }

  /**
   * Updates the project.json file of the downloaded project.
   */
  _updateProject() {
    const projectJsonFile = path.resolve(this.outputFolder, "package.json");
    const projectJson = JSON.parse(fs.readFileSync(projectJsonFile));
    projectJson.name = this.projectFolder;
    const userInfo = os.userInfo();
    projectJson.author = `${userInfo.username} <${userInfo}@localhost>`;

    fs.writeFileSync(projectJsonFile, JSON.stringify(projectJson, null, 2));
  }
}

module.exports = ProjectCommand;
