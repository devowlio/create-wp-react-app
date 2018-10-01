#!/usr/bin/env node

/*
var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];

if (major < 8) {
  console.error(
    console.error(
      'You are running Node ' +
        currentNodeVersion +
        '.\n' +
        'Create React App requires Node 8 or higher. \n' +
        'Please update your version of Node.'
    )
  );
  process.exit(1);
}
*/

const execa = require('execa'),
    Listr = require('listr'),
    rimraf = require('rimraf'),
    path = require('path');

const e2Error = e => new Error(e.message.replace(/\n/g, ' '));

// Details
const pluginSlug = process.argv.length >= 3 ? process.argv[2] : null,
    MIN_NODE_VERSION = 8,
    GIT_URL = 'git@github.com:matzeeable/wp-reactjs-starter.git';

new Listr([{
		title: 'General checks...',
		task: (ctx, headTask) => new Listr([{
				title: 'Checking Node environment...',
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
				title: 'Checking plugin slug...',
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
	}, {
		title: 'Download boilerplate...',
		task: () => new Listr([{
		    title: 'Clone git repository...',
		    task: () => new Promise((resolve, reject) =>
		        execa('git', ['clone', GIT_URL, pluginSlug]).then(resolve, e => {
		            reject(e2Error(e));
		        }))
		}, {
		    title: 'Disconnect git repository...',
		    task: () => new Promise((resolve, reject) => rimraf(path.join(pluginSlug, '.git'), resolve))
		}])
	}
], {
    collapse: false
}).run().catch(err => {
	// Silence is golden.
});