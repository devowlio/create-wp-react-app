#!/usr/bin/env node

const execa = require('execa'),
    fs = require('fs'),
    Listr = require('listr'),
    rimraf = require('rimraf'),
    path = require('path'),
    glob = require('path'),
    prompt = require('../lib/prompt'),
    _ = require("lodash");

let tmpl, pluginFileList = { };

const e2Error = e => new Error(e.message.replace(/\n/g, ' '));

// Details
const pluginSlug = process.argv.length >= 3 ? process.argv[2] : null,
    encoding = 'UTF-8',
    MIN_NODE_VERSION = 8,
    GIT_URL = 'git@github.com:matzeeable/wp-reactjs-starter.git',
    CWD = process.cwd(),
    pluginCwd = path.join(CWD, pluginSlug);

new Listr([{
		title: 'General checks...',
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
				    if (!pluginSlug) {
        		        throw new Error('Please provide a plugin slug in your command: create-wp-react-app your-plugin-slug');
        		    }
        		    
        		    if (!/^[A-Za-z0-9-_]+$/.test(pluginSlug)) {
        		        throw new Error('Your plugin slug "' + pluginSlug + '" should be in format: /^[A-Za-z0-9-_]+$/');
        		    }
        		    task.title = '"' + pluginSlug + '" is a valid plugin name!';
        		    headTask.title += ' Passed!';
				}
			}
		])
	}, prompt.listr(pluginCwd, pluginSlug), {
		title: 'Download boilerplate',
		//enabled: () => false,
		task: () => new Listr([{
		    title: 'Clone git repository',
		    task: () => new Promise((resolve, reject) =>
		        execa('git', ['clone', GIT_URL, pluginSlug]).then(resolve, e => {
		            reject(e2Error(e));
		        }))
		}, {
		    title: 'Disconnect git repository',
		    task: () => new Promise((resolve, reject) => {
		        rimraf(path.join(pluginSlug, '.git'), () => {
                    pluginFileList.php = glob.sync('**/*.php', { cwd: pluginCwd });
                    pluginFileList.js = glob.sync('**/*.js', { cwd: pluginCwd });
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
	}, {
	    title: 'Create boilerplate',
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
                    indexPHP = indexPHP.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), value);
                });
                
                // Create index.php file
                fs.writeFileSync(path.join(pluginCwd, 'index.php'), indexPHP, { encoding });
        
                // Read all available constants
                let m, regex = /define\(\'([^\']+)/g, constants = [];
                while ((m = regex.exec(indexPHP)) !== null) {
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                    
                    m.forEach((match, groupIndex) => {
            			if (groupIndex === 1) {
            				constants.push(match);
            			}
                    });
                }
	        }
	    }, {
	        title: 'Modify PHP files',
	        task: (ctx, task) => {
	            pluginFileList.php.forEach(file => {
                    task.title += file + ';';
                });
	        }
	    }, {
	        title: 'Modify JS files',
	        task: () => {
	            
	        }
	    }, {
	        title: 'Create language POT files',
	        task: () => {
	            
	        }
	    }])
	}, {
	    title: 'First build',
	    task: () => new Listr([{
	        title: 'Generate documentations (PHP, JS, API, Hooks)',
	        task: () => {
	            
	        }
	    }, {
	        title: 'Webpack build (dist and dev)',
	        task: () => {
	            
	        }
	    }, {
	        title: 'Copy public library files from node_modules',
	        task: () => {
	            
	        }
	    }])
	}
], {
    collapse: false
}).run().catch(err => {
	// Silence is golden.
});