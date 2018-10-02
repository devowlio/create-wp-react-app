#!/usr/bin/env node

const program = require('commander');
 
program
	.command('create <slug>')
	.description('Create a new WP plugin with the given plugin slug')
	.option('-r, --repository [repository]', 'The repository URL, default is https://github.com/matzeeable/wp-reactjs-starter')
	.action((slug, options) => {
		require('../lib/create').create(Object.assign({
			slug
		}, options));
	});
	
program.parse(process.argv);