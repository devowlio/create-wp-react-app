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
const createInputTask = ({ name, key, defaultValue, validator = () => true }, formatter = v => v) => ({
    title: name + ': ',
    task: (ctx, task) => input(name, {
        'default': defaultValue,
    	validate: value => value.length > 0 && validator(value),
    	done: v => {
    	    const value = formatter(v);
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
        createInputTask({ name: 'PHP Namespace', key: 'namespace', defaultValue: 'MatthiasWeb\\WPRJSS', validator: value => /^[^ ]+$/.test(value), formatter: v => v.split('\\').join('\\\\') }),
        createInputTask({ name: 'WordPress option names prefix', key: 'optPrefix', defaultValue: 'wprjss', formatter: v => v.toLowerCase() }),
        createInputTask({ name: 'WordPress database tables prefix', key: 'dbPrefix', defaultValue: 'wprjss', formatter: v => v.toLowerCase() }),
        createInputTask({ name: 'PHP constants prefix for the above options', key: 'constantPrefix', defaultValue: 'WPRJSS', formatter: v => v.toUpperCase() }),
        createInputTask({ name: 'REST API namespace prefix', key: 'apiPrefix', defaultValue: 'wprjss/v1', formatter: v => v.toLowerCase() })
    ])
});
    
/*
    resolve();
    return;
    
    // Start
    const tmpl = fs.readFileSync(path.join(pluginCwd, 'build/grunt-index-php.tmpl'));
    
    prompt.start();
    prompt.message = '';
    prompt.delimiter = '';
    prompt.get({}, function (e, result) {
        // PHP replacements (inc)
        var fileContent, file, files = grunt.file.expand({
            cwd: './inc'
        }, "** /*"), parseOldConstant = function(constant) {
            return 'WPRJSS' + constant.slice(result.constantPrefix.length);
        }, functions = ['wprjss_skip_php_admin_notice', 'wprjss_skip_wp_admin_notice', 'wprjss_skip_rest_admin_notice'];
        _.each(files, function(_file) {
            file = './inc/' + _file;
            if (grunt.file.isFile(file)) {
                grunt.log.writeln('Create constants, namespaces and procedural functions in [' + file + '] ...');
                fileContent = grunt.file.read(file);
                
                // Replacing the constants in /inc files
                _.each(constants, function(constant) {
                    fileContent = fileContent.replace(new RegExp(parseOldConstant(constant), 'g'), constant);
                });
                
                // Replacing the namespaces in /inc files
                fileContent = fileContent.replace(new RegExp('MatthiasWeb\\\\WPRJSS', 'g'), result.namespace.replace('\\\\', '\\'));
                
                // Apply for procedural functions
                _.each(functions, function(fnName) {
                    fileContent = fileContent.replace(new RegExp(fnName, 'g'), fnName.replace('wprjss', result.optPrefix));
                });
                
                // File specific replaces
                switch (_file) {
                    case 'general/Assets.class.php':
                        fileContent = fileContent.replace(new RegExp('wp-reactjs-starter', 'g'), result.textDomain);
                        fileContent = fileContent.replace('wprjssOpts', result.optPrefix + 'Opts');
                        break;
                    case 'rest/Service.class.php':
                        fileContent = fileContent.replace('wprjss/v1', result.apiPrefix);
                    case 'menu/Page.class.php':
                        fileContent = fileContent.replace(new RegExp('wp-react-component-library', 'g'), result.optPrefix + '-wp-react-component-library');
                    default:
                        break;
                }
                
                grunt.file.write(file, fileContent);
            }
        });
        
        // JS replacements
        grunt.log.writeln('Generate JavaScript files...');
        files = grunt.file.expand({
            cwd: './public/src'
        }, "** /*");
        _.each(files, function(_file) {
            file = './public/src/' + _file;
            if (grunt.file.isFile(file)) {
                fileContent = grunt.file.read(file);
                
                // Replace localized object
                fileContent = fileContent.replace(new RegExp('window.wprjssOpts', 'g'), 'window.' + result.optPrefix + 'Opts');
                
                // File specific replaces
                switch (_file) {
                    case 'admin.js':
                        fileContent = fileContent.replace('wp-react-component-library', result.optPrefix + '-wp-react-component-library');
                    default:
                        break;
                }
                
                grunt.file.write(file, fileContent);
            }
        });
        
        // Apply for language files
        grunt.log.writeln('Create language file...');
        var potFile = './languages/wp-reactjs-starter.pot', potContent = grunt.file.read(potFile);
        grunt.file.delete(potFile);
        grunt.file.write('./languages/' + result.textDomain + '.pot', potContent.replace('WP ReactJS Starter', result.pluginName));
        
        // Success
        grunt.log.ok('All files successfully created. Please read on the Documentation on https://github.com/matzeeeeeable/wp-reactjs-starter for more information. Happy coding and make something awesome. :-)');
        grunt.log.ok('Oh forgot... The package.json and composer.json files have to be adjusted to your needs.');
        resolve();
    });
});
*/