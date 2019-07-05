const execa = require('execa'),
    fs = require('fs'),
    Listr = require('listr'),
    rimraf = require('rimraf'),
    path = require('path'),
    glob = require('glob'),
	_ = require("lodash"),
	streamToObservable = require('@samverschueren/stream-to-observable');

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
	checkout = 'master',
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
    let tmpl_indexPHP, tmpl_readme, pluginFileList = { }, constantList = [ ];
    __DRY__ = dry;
    
    const e2Error = e => new Error(e.message.replace(/\n/g, ' '));
    
    // Details
    const encoding = 'UTF-8',
        MIN_NODE_VERSION = 8,
        CWD = process.cwd(),
		pluginCwd = path.join(CWD, slug || ''),
		globFiles = pattern => glob.sync(pattern, { cwd: pluginCwd, absolute: true });
    
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
    		skip: () => (dry ? 'Dry run skips this task' : (fs.existsSync(pluginCwd) ? 'Folder ' + slug + ' already exists, skip downloading...' : undefined)),
    		task: () => new Listr([{
    		    title: 'Clone git repository',
    		    task: () => streamToObservable(execa('git', ['clone', repository, slug]).stdout)
    		}, {
				title: 'Checkout git tree',
    		    task: () => streamToObservable(execa('git', ['checkout', checkout], { cwd: pluginCwd }).stdout)
    		}, {
    		    title: 'Disconnect git repository',
    		    task: () => new Promise((resolve, reject) => {
    		        rimraf(path.join(slug, '.git'), () => {
    		            resolve();
    		        });
    		    })
    		}, {
        		title: 'Install package dependencies with yarn',
        		task: () => streamToObservable(execa('yarn', ['install', '--verbose'], { cwd: pluginCwd }).stdout)
        	}, {
        	    title: 'Install package dependencies with composer',
        		task: () => streamToObservable(execa('composer', ['install', '--no-ansi', '--no-progress'], { cwd: pluginCwd }).stdout)
        	}])
    	}, prompt.listr(pluginCwd, dry, skip, passedPrompts), {
    	    title: 'Create boilerplate',
    	    skip: () => (dry ? 'Dry run skips this task' : undefined),
    	    task: (ctx, headTask) => new Listr([{
    	        title: 'Load template file',
    	        task: () => {
        	        headTask.title += ' for ' + prompt.data.pluginName;
        	        
        	        // Read template
					tmpl_indexPHP = fs.readFileSync(path.join(pluginCwd, 'build/grunt-index-php.tmpl'), { encoding });
					if (fs.existsSync(path.join(pluginCwd, 'build/grunt-readme-txt.tmpl'))) {
						tmpl_readme = fs.readFileSync(path.join(pluginCwd, 'build/grunt-readme-txt.tmpl'), { encoding });
					}
    	        }
    	    }, {
    	        title: 'Create index.php and READMe from templates',
    	        task: () => {
    	            // We have all the informations, let's parse the index.php file
                    const applyPromptData = (tmpl) => {
						_.each(prompt.data, (value, key) => {
							switch (key) {
								case 'namespace':
									value = value.replace(/\\/g, '\\\\');
									break;
								default: break;
							}
							tmpl = tmpl.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), value);
						});
						return tmpl;
					};
                    
					// Create index.php file
					const indexPHP = applyPromptData(tmpl_indexPHP);
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
					
					// Create README.wporg.txt file
					if (tmpl_readme) {
						fs.writeFileSync(path.join(pluginCwd, 'README.wporg.txt'), applyPromptData(tmpl_readme), { encoding });
					}
    	        }
    	    }, {
    	        title: 'Search and replace constants, namespaces, and so on...',
    	        task: () => {
    	        	const functions = ['wprjss_skip_php_admin_notice', 'wprjss_skip_wp_admin_notice', 'wprjss_skip_rest_admin_notice'];
    	        		
    	        	// Allow adding functions for extensibility
    	        	const fn = extensibility(pluginCwd, 'phpFunctions');
					fn && fn({ functions, pluginCwd });

					pluginFileList.php = globFiles('inc/**/*.php');
					pluginFileList.tsx = globFiles('public/src/**/*.{tsx,js}'); // Legacy: Also add js files
					pluginFileList.docker = globFiles('docker/**/*.{yml,sh,php}');
					pluginFileList.pkg = globFiles('package.json');
					
					// Create extensible replace bottle
					let replaceBottle = [{ // Slug relevant
						files: globFiles('inc/general/Assets.class.php' /* legacy */).concat(pluginFileList.docker, pluginFileList.pkg, globFiles('.gitlab-ci.yml'), globFiles('build/vuepress-php.js')),
						search: /wp-reactjs-starter/g,
						replace: slug
					}, { // Asset option name
						files: globFiles('inc/general/Assets.class.php' /* legacy */).concat(pluginFileList.tsx),
						search: /wprjssOpts/g,
						replace: prompt.data.optPrefix + 'Opts'
					}, { // Service REST URL
						files: globFiles('inc/rest/Service.class.php').concat(pluginFileList.tsx, pluginFileList.pkg, globFiles('.gitlab-ci.yml')),
						search: /wprjss\/v1/g,
						replace: prompt.data.apiPrefix
					}, { // Namespaces
						files: pluginFileList.php,
						search: /MatthiasWeb\\WPRJSS/g,
						replace: prompt.data.namespace.replace(/\\\\/g, '\\')
					}, { // CHANGELOG initial version
						files: globFiles('CHANGELOG'),
						search: /([0-9.]+)/g,
						replace: prompt.data.version
					}, { // package.json: Version
						files: pluginFileList.pkg,
						search: /"version":\s*"([0-9.]+)"/g,
						replace: '"version": "' + prompt.data.version + '"'
					}, { // package.json: Description
						files: pluginFileList.pkg,
						search: /"description":\s*"([^"]+)"/g,
						replace: '"description": "' + prompt.data.pluginDescription + '"'
					}, { // package.json: Author
						files: pluginFileList.pkg,
						search: /"author":\s*"([^"]+)"/g,
						replace: '"author": "' + prompt.data.author + '"'
					}, { // package.json: Homepage
						files: pluginFileList.pkg,
						search: /"homepage":\s*"([^"]+)"/g,
						replace: '"homepage": "' + prompt.data.pluginURI + '"'
					}];

					// Replacing the constants
					_.each(constantList, constant => replaceBottle.push({
						files: pluginFileList.php,
						search: new RegExp('WPRJSS' + constant.slice(prompt.data.constantPrefix.length), 'g'),
						replace: constant
					}));

					// Apply for procedural functions
					_.each(functions, fnName => replaceBottle.push({
						files: pluginFileList.php,
						search: new RegExp(fnName, 'g'),
						replace: fnName.replace('wprjss', prompt.data.optPrefix)
					}));

					// (legacy) Page react component id
					replaceBottle.push({
						files: globFiles('inc/menu/Page.class.php').concat(pluginFileList.tsx),
						search: /wp-react-component-library/g,
						replace: prompt.data.optPrefix + '-wp-react-component-library'
					});

					// Iterate all files and search & replace
					replaceBottle.forEach(r => r.files.forEach(file => {
						const newContent = fs.readFileSync(file, { encoding }).replace(r.search, r.replace);
						fs.writeFileSync(file, newContent, { encoding });
					}))
    	        }
    	    }, {
				title: 'Create language POT file',
				skip: () => fs.existsSync(path.join(pluginCwd, 'languages/wp-reactjs-starter.pot')) ? undefined : 'POT file no longer exists, perhaps the language file is already created',
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
    	        task: () => streamToObservable(execa('yarn', ['docs', '--verbose'], { cwd: pluginCwd }).stdout)
    	    }, {
    	        title: 'Webpack /public/dist build',
    	        task: () => streamToObservable(execa('yarn', ['build', '--verbose'], { cwd: pluginCwd }).stdout)
    	    }, {
    	        title: 'Webpack /public/dev build',
    	        task: () => streamToObservable(execa('yarn', ['build-dev', '--verbose'], { cwd: pluginCwd }).stdout)
    	    }, {
    	        title: 'Copy public library files from node_modules',
    	        task: () => new Promise((resolve, reject) => {
    	        	execa('grunt', ['copy-npmLibs'], { cwd: pluginCwd }).then(() => {
    		            headTask.title = 'First build done. Learn more about the boilerplate here: https://git.io/fxTg6';
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