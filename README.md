# Puzzle Framework CLI Tool

CLI Tool that helps you with installing/configuring a project using Puzzle Framework.

## Contributing

To contribute please read the [CONTRIBUTING.md](https://github.com/spark-development/puzzle-cli/blob/master/CONTRIBUTING.md) file.

## Commands

### `project project_name [--lite/-l] [--force/-f] [--version/-v=latest]`

Creates a local version of the template project available on github.

Options:
  - --lite (-l): Installs the template project for the lite version of the framework
  - --force (-f): Forces the installation of the template if a folder with the same
  project name already exists
  - --version (-v): Specifies the version to be installed. If no value is given it will
  install the latest available version.
