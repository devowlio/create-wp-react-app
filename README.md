<h1><p align="center">:new: :fire:<br /><br />create-wp-react-app</p></h1>
<p align="center">Create React WordPress plugin with no build configuration.</p>

---

This CLI tool enables you to create a modern WordPress ReactJS plugin with no build configuration
based on [WP ReactJS Starter boilerplate](https://github.com/matzeeable/wp-reactjs-starter) with Babel, Webpack and more.

## Installation
```sh
$ npm install -g create-wp-react-app
```

## Create plugin
```sh
$ create-wp-react-app create my-plugin
```
![generate cli](https://matthias-web.com/wp-content/uploads/Posts/create-wp-react-app.gif)

## Usage
```
Usage: create-wp-react-app create [options] <slug>

Create a new WP plugin with the given plugin slug

Options:

  -r, --repository [repository]  The repository URL, default is https://github.com/matzeeable/wp-reactjs-starter
  -h, --help                     output usage information
```

The `repository` options allows you to build your own forked boilerplate based on the [WP ReactJS Starter boilerplate](https://github.com/matzeeable/wp-reactjs-starter).
For example you can offer your plugin users to quick-start an Add-On. For example have a look at [matzeeable/wp-real-media-library-add-on](https://github.com/matzeeable/wp-real-media-library-add-on).

## Extensibility
If you are using your own forked boierlplate you can create a [`build/create-wp-react-app.js`](https://github.com/matzeeable/wp-real-media-library-add-on/blob/master/build/create-wp-react-app.js) file to modify the generation process.

#### `prompts`
This export function allows you to add an input field to the generation process (prompts). For this, [listr-input](https://github.com/SamVerschueren/listr-input) tasks are used.

```js
/**
 * Add the minimum required Real Media Library version to the prompts.
 */
exports.prompts = ({ task, pluginCwd, createInputTask }) => {
    task.add(createInputTask({
        name: 'Minimum Real Media Library version',
        key: 'minRML',
        defaultValue: '3.0.0'
    }));
};
```

#### `phpFunctions`
Pass a function name to the `functions` parameter so the `wprjss` is replaced with your defined name.

```js
/**
 * Add the RML admin notice for the min required RML version.
 */
exports.phpFunctions = ({ functions }) => {
    functions.push('wprjss_skip_rml_admin_notice');
};
```
