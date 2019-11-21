<h1><p align="center">:new: :fire:<br /><br />create-wp-react-app</p></h1>
<p align="center">Create React WordPress plugin with no build configuration.</p>

---

This CLI tool enables you to create a modern WordPress ReactJS plugin with no build configuration
based on [WP ReactJS Starter boilerplate](https://github.com/matzeeable/wp-reactjs-starter) with Babel, Webpack and more.

## Prerequirements

If you want to use this command line interface tool you have to installed the requirements of [WP ReactJS Starter boilerplate](https://github.com/matzeeable/wp-reactjs-starter#white_check_mark-prerequesits). Additionally you should also have installed and activated the PHP extensions `php-mbstring` and `php-xml`/`php-simplexml`.

## Installation

```sh
$ yarn global add create-wp-react-app
```

## Create plugin

```sh
$ create-wp-react-app create my-plugin
```

![generate cli](https://matthias-web.com/wp-content/uploads/Posts/create-wp-react-app.gif)

## Usage

```
Usage: create [options] <slug>

Create a new WP plugin with the given plugin slug

Options:

  -r, --repository [value]         The repository URL, default is https://github.com/matzeeable/wp-reactjs-starter
  -g, --checkout [value]           The checkout tree, default is master (git checkout [value])
  -n, --pluginName <value>         Plugin name
  -u, --pluginURI <value>          Plugin URI
  -d, --pluginDescription <value>  Plugin description
  -a, --author <value>             Author
  -i, --authorURI <value>          Author URI
  -v, --version <value>            Plugin initial version
  -t, --textDomain <value>         Plugin slug for text domain, language files, ...
  -p, --minPHP <value>             Minimum PHP version (minimum of 5.3 required for the boilerplate)
  -w, --minWP <value>              Minimum WordPress version (minimum of 4.4 required for the boilerplate)
  -m, --namespace <value>          PHP Namespace
  -o, --optPrefix <value>          WordPress option names prefix
  -b, --dbPrefix <value>           WordPress database tables prefix
  -c, --constantPrefix <value>     PHP constants prefix for the above options
  -j, --apiPrefix <value>          REST API namespace prefix
  -s, --skip                       Skip the prompts and use the default values if not specified with above arguments (prompt validators are skipped)
  -y, --dry                        Dry run
  -h, --help                       output usage information
```

The `repository` options allows you to build your own forked boilerplate based on the [WP ReactJS Starter boilerplate](https://github.com/matzeeable/wp-reactjs-starter).
