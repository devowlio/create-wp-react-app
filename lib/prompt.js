const Listr = require('listr'),
    input = require('listr-input');

/**
 * Collect data of the entered information
 */
let data = {};
exports.data = data;

/**
 * Shorthand function to create input task.
 */
const createInputTask = ({ name, key, defaultValue, validator = () => true, formatter }) => ({
    title: name + ': ',
    task: (ctx, task) => input(name, {
        'default': defaultValue,
    	validate: value => value.length > 0 && validator(value),
    	done: v => {
    	    const value = formatter && formatter(v) || v;
    	    (data[key] = value);
    	    (task.title += value);
    	}
    })
});

/**
 * Create listr tasks for the detail prompts.
 */
exports.listr = () => ({
    title: 'Enter your plugin details',
    task: () => new Listr([
        createInputTask({ name: 'Plugin name', key: 'pluginName', defaultValue: 'WP ReactJS Starter'}),
        createInputTask({ name: 'Plugin URI', key: 'pluginURI', defaultValue: 'https://github.com/matzeeeeeable/wp-reactjs-starter'}),
        createInputTask({ name: 'Plugin description', key: 'pluginDescription', defaultValue: 'This WordPress plugin demonstrates how to setup a plugin that uses React and ES6 in a WordPress plugin.'}),
        createInputTask({ name: 'Author', key: 'author', defaultValue: 'Bob' }),
        createInputTask({ name: 'Author URI', key: 'authorURI', defaultValue: 'https://example.com' }),
        createInputTask({ name: 'Plugin initial version', key: 'version', defaultValue: '0.1.0' }),
        createInputTask({ name: 'Plugin slug for text domain, language files, ...', key: 'textDomain', defaultValue: 'wp-reactjs-starter',
            validator: value => /^[^ ]+$/.test(value)}),
        createInputTask({ name: 'Minimum PHP version (minimum of 5.3 required for the boilerplate)', key: 'minPHP', defaultValue: '5.3.0' }),
        createInputTask({ name: 'Minimum WordPress version (minimum of 4.4 required for the boilerplate)', key: 'minWP', defaultValue: '4.4.0' }),
        createInputTask({ name: 'PHP Namespace', key: 'namespace', defaultValue: 'MatthiasWeb\\WPRJSS', validator: value => /^[^ ]+$/.test(value) }),
        createInputTask({ name: 'WordPress option names prefix', key: 'optPrefix', defaultValue: 'wprjss', formatter: v => v.toLowerCase() }),
        createInputTask({ name: 'WordPress database tables prefix', key: 'dbPrefix', defaultValue: 'wprjss', formatter: v => v.toLowerCase() }),
        createInputTask({ name: 'PHP constants prefix for the above options', key: 'constantPrefix', defaultValue: 'WPRJSS', formatter: v => v.toUpperCase() }),
        createInputTask({ name: 'REST API namespace prefix', key: 'apiPrefix', defaultValue: 'wprjss/v1', formatter: v => v.toLowerCase() })
    ])
});