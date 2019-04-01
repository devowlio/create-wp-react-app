const execa = require('execa'),
    fs = require('fs'),
    Listr = require('listr'),
    rimraf = require('rimraf'),
    path = require('path'),
    glob = require('glob'),
    _ = require("lodash");

let __DRY__;

/**
 * Read the dynamic create-wp-react-app.js in the build folder
 * and return a given export function to allow extensibility.
 */
const extensibility = (pluginCwd, fn) => {
    if (__DRY__) {
        return undefined;
    }
    const jsFile = path.join(pluginCwd, 'build/create-wp-react-app.js'),
        dynamicCreateWpReactApp = require(jsFile);
    return dynamicCreateWpReactApp && dynamicCreateWpReactApp[fn];
};
exports.extensibility = extensibility;

const prompt = require('./prompt');

/**
 * Create the app.
 * 
 * @param {string} [slug] The plugin slug to use (also the new directory name)
 * @param {string} [repository] The repository to use instead of wp-reactjs-starter (URL)
 */
exports.create = ({
    slug = 'wp-reactjs-start',
    repository = 'https://github.com/matzeeable/wp-reactjs-starter.git',
    skip = false,
    dry = false,
    ...passedPrompts
}) => {
    // Check skip arguments
    if (skip) {
        const skipNeeded = ['textDomain', 'namespace', 'optPrefix', 'dbPrefix', 'constantPrefix', 'apiPrefix'],
            skipFailure = skipNeeded.filter(s => !passedPrompts[s]);
        if (skipFailure.length) {
            throw new Error("You are running the command in skip-mode and you have forgot to pass the following arguments: " + skipFailure.map(s => '--' + s).join(', '));
        }
    }
    let tmpl, pluginFileList = { }, constantList = [ ];
    __DRY__ = dry;
    
    const e2Error = e => new Error(e.message.replace(/\n/g, ' '));
    
    // Details
    const encoding = 'UTF-8',
        MIN_NODE_VERSION = 8,
        CWD = process.cwd(),
        pluginCwd = path.join(CWD, slug || '');
    
    new Listr([{
    		title: 'General checks for ' + slug + '...',
    		task: (ctx, headTask) => new Listr([{
    				title: 'Checking Node environment',
    				task: (ctx, task) => {
    				    const currentNodeVersion = process.versions.node,
            		        semver = currentNodeVersion.split('.'),
            		        major = semver[0];
            		    if (major < MIN_NODE_VERSION) {
            		        throw new Error('You are running node ' + currentNodeVersion + '. Create WP React App requires Node ' + MIN_NODE_VERSION + ' or higher. Please update your version of Node.');
            		    }
            		    task.title = 'Minimum Node version ' + MIN_NODE_VERSION + ' installed!';
    				}
    			}, {
    				title: 'Checking plugin slug',
    				task: (ctx, task) => {
            		    if (!/^[A-Za-z0-9-_]+$/.test(slug)) {
            		        throw new Error('Your plugin slug "' + slug + '" should be in format: /^[A-Za-z0-9-_]+$/');
            		    }
            		    task.title = '"' + slug + '" is a valid plugin slug!';
            		    headTask.title += ' Passed!';
    				}
    			}, {
    				title: 'Checking plugin slug',
    				task: (ctx, task) => {
    				    if (!slug) {
            		        throw new Error('Please provide a plugin slug in your command: create-wp-react-app your-plugin-slug');
            		    }
            		    
            		    if (!/^[A-Za-z0-9-_]+$/.test(slug)) {
            		        throw new Error('Your plugin slug "' + slug + '" should be in format: /^[A-Za-z0-9-_]+$/');
            		    }
            		    task.title = '"' + slug + '" is a valid plugin slug!';
            		    headTask.title += ' Passed!';
    				}
    			}
    		])
    	}, {
    		title: 'Download boilerplate',
    		skip: () => (dry ? 'Dry run skips this task' : undefined),
    		task: () => new Listr([{
    		    title: 'Clone git repository',
    		    task: () => new Promise((resolve, reject) =>
    		        execa('git', ['clone', repository, slug]).then(resolve, e => {
    		            reject(e2Error(e));
    		        }))
    		}, {
    		    title: 'Disconnect git repository',
    		    task: () => new Promise((resolve, reject) => {
    		        rimraf(path.join(slug, '.git'), () => {
                        pluginFileList.php = glob.sync('**/*.php', { cwd: pluginCwd, absolute: true });
                        pluginFileList.js = glob.sync('**/*.js', { cwd: pluginCwd, absolute: true });
    		            resolve();
    		        });
    		    })
    		}, {
        		title: 'Install package dependencies with npm',
        		task: () => execa('npm', ['install'], { cwd: pluginCwd })
        	}, {
        	    title: 'Install package dependencies with composer',
        		task: () => execa('composer', ['install'], { cwd: pluginCwd })
        	}])
    	}, prompt.listr(pluginCwd, dry, skip, passedPrompts), {
    	    title: 'Create boilerplate',
    	    skip: () => (dry ? 'Dry run skips this task' : undefined),
    	    task: (ctx, headTask) => new Listr([{
    	        title: 'Load template file',
    	        task: () => {
        	        headTask.title += ' for ' + prompt.data.pluginName;
        	        
        	        // Read template
        	        tmpl = fs.readFileSync(path.join(pluginCwd, 'build/grunt-index-php.tmpl'), { encoding });
    	        }
    	    }, {
    	        title: 'Create index.php',
    	        task: (ctx, task) => {
    	            // We have all the informations, let's parse the index.php file
                    let indexPHP = tmpl;
                    _.each(prompt.data, (value, key) => {
                    	switch (key) {
                    		case 'namespace':
                    			value = value.replace(/\\/g, '\\\\');
                    			break;
                    		default: break;
                    	}
                        indexPHP = indexPHP.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), value);
                    });
                    
                    // Create index.php file
                    fs.writeFileSync(path.join(pluginCwd, 'index.php'), indexPHP, { encoding });
            
                    // Read all available constants
                    let m, regex = /define\(\'([^\']+)/g;
                    while ((m = regex.exec(indexPHP)) !== null) {
                        if (m.index === regex.lastIndex) {
                            regex.lastIndex++;
                        }
                        
                        m.forEach((match, groupIndex) => {
                			if (groupIndex === 1) {
                				constantList.push(match);
                			}
                        });
                    }
    	        }
    	    }, {
    	        title: 'Modify PHP files',
    	        task: (ctx, task) => {
    	        	const parseOldConstant = constant => 'WPRJSS' + constant.slice(prompt.data.constantPrefix.length),
    	        		functions = ['wprjss_skip_php_admin_notice', 'wprjss_skip_wp_admin_notice', 'wprjss_skip_rest_admin_notice'];
    	        		
    	        	// Allow adding functions for extensibility
    	        	const fn = extensibility(pluginCwd, 'phpFunctions');
    	        	fn && fn({ functions, pluginCwd });
    	        		
    	            pluginFileList.php.forEach(file => {
    	            	let fileContent = fs.readFileSync(file, { encoding });
                		
                		// Replacing the constants
    	                _.each(constantList, constant => {
    	                    fileContent = fileContent.replace(new RegExp(parseOldConstant(constant), 'g'), constant);
    	                });
    	                
    	                // Replacing the namespaces in /inc files
                		fileContent = fileContent.replace(new RegExp('MatthiasWeb\\\\WPRJSS', 'g'), prompt.data.namespace.replace(/\\\\/g, '\\'));
                		
                		// Apply for procedural functions
    	                _.each(functions, fnName => {
    	                    fileContent = fileContent.replace(new RegExp(fnName, 'g'), fnName.replace('wprjss', prompt.data.optPrefix));
    	                });
    	                
    	                // File specific replaces
    	                switch (file) {
    	                    case path.join(pluginCwd, 'inc/general/Assets.class.php'):
    	                        fileContent = fileContent.replace(new RegExp('wp-reactjs-starter', 'g'), prompt.data.textDomain);
    	                        fileContent = fileContent.replace('wprjssOpts', prompt.data.optPrefix + 'Opts');
    	                        break;
    	                    case path.join(pluginCwd, 'inc/rest/Service.class.php'):
    	                        fileContent = fileContent.replace('wprjss/v1', prompt.data.apiPrefix);
    	                        break;
    	                    case path.join(pluginCwd, 'inc/menu/Page.class.php'):
    	                        fileContent = fileContent.replace(new RegExp('wp-react-component-library', 'g'), prompt.data.optPrefix + '-wp-react-component-library');
    	                        break;
    	                    default:
    	                        break;
    	                }
    	                
    	                // Write file
                    	fs.writeFileSync(file, fileContent, { encoding });
    	            });
    	        }
    	    }, {
    	        title: 'Modify JS files',
    	        task: () => {
    	            pluginFileList.js.forEach(file => {
    	            	let fileContent = fs.readFileSync(file, { encoding });
    	            	
    	            	// Replace localized object
    		            fileContent = fileContent.replace(new RegExp('window.wprjssOpts', 'g'), 'window.' + prompt.data.optPrefix + 'Opts');
    		            
    		            // File specific replaces
    		            switch (file) {
    		                case path.join(pluginCwd, 'public/src/admin.js'):
    		                    fileContent = fileContent.replace('wp-react-component-library', prompt.data.optPrefix + '-wp-react-component-library');
    		                default:
    		                    break;
    		            }
    		            
    		            // Write file
                    	fs.writeFileSync(file, fileContent, { encoding });
    	            });
    	        }
    	    }, {
    	        title: 'Create language POT file',
    	        task: () => {
    			    const potFile = path.join(pluginCwd, 'languages/wp-reactjs-starter.pot'), potContent = fs.readFileSync(potFile, { encoding });
    			    fs.unlinkSync(potFile);
    			    fs.writeFileSync(
    			    	path.join(pluginCwd, 'languages/' + prompt.data.textDomain + '.pot'),
    			    	potContent.replace('WP ReactJS Starter', prompt.data.pluginName),
    			    	{ encoding }
    			    );
    	        }
    	    }])
    	}, {
    	    title: 'First build',
    	    skip: () => (dry ? 'Dry run skips this task' : undefined),
    	    task: (ctx, headTask) => new Listr([{
    	        title: 'Generate documentations (PHP, JS, API, Hooks)',
    	        task: () => execa('npm', ['run', 'docs'], { cwd: pluginCwd })
    	    }, {
    	        title: 'Webpack /public/dist build',
    	        task: () => execa('npm', ['run', 'build'], { cwd: pluginCwd })
    	    }, {
    	        title: 'Webpack /public/dev build',
    	        task: () => execa('npm', ['run', 'build-dev'], { cwd: pluginCwd })
    	    }, {
    	        title: 'Copy public library files from node_modules',
    	        task: () => new Promise((resolve, reject) => {
    	        	execa('grunt', ['copy-npmLibs'], { cwd: pluginCwd }).then(() => {
    		            headTask.title = 'First build done, navigate to your plugins admin page and activate "' + prompt.data.pluginName +
    		            	'". Learn more about the boilerplate here: https://git.io/fxTg6';
    		            resolve();
    	        	}, reject);
            	})
    	    }])
    	}, {
    	    title: 'Dry test results',
    	    enabled: () => dry,
    	    task: (ctx, task) => {
    	        task.title += ':\n\n' + JSON.stringify(prompt.data, null, 4);
    	    }
    	}
    ], {
        collapse: true
    }).run().catch(err => {
    	// Silence is golden.
    });
};