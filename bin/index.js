#!/usr/bin/env node

const program = require('commander');
 
program
	.command('create <slug>')
	.description('Create a new WP plugin with the given plugin slug')
	.option('-r, --repository [value]', 'The repository URL, default is https://github.com/matzeeable/wp-reactjs-starter')
	.option('-g, --checkout [value]', 'The checkout tree, default is master (git checkout [value])')
	.option('-n, --pluginName <value>', 'Plugin name')
	.option('-u, --pluginURI <value>', 'Plugin URI')
	.option('-d, --pluginDescription <value>', 'Plugin description')
	.option('-a, --author <value>', 'Author')
	.option('-i, --authorURI <value>', 'Author URI')
	.option('-v, --version <value>', 'Plugin initial version')
	.option('-t, --textDomain <value>', 'Plugin slug for text domain, language files, ...')
	.option('-p, --minPHP <value>', 'Minimum PHP version (minimum of 5.4 required for the boilerplate)')
	.option('-w, --minWP <value>', 'Minimum WordPress version (minimum of 5.0 required for the boilerplate)')
	.option('-m, --namespace <value>', 'PHP Namespace')
	.option('-o, --optPrefix <value>', 'WordPress option names prefix')
	.option('-b, --dbPrefix <value>', 'WordPress database tables prefix')
	.option('-c, --constantPrefix <value>', 'PHP constants prefix for the above options')
	.option('-j, --apiPrefix <value>', 'REST API namespace prefix')
	.option('-s, --skip', 'Skip the prompts and use the default values if not specified with above arguments (prompt validators are skipped)')
	.option('-y, --dry', 'Dry run')
	.action((slug, options) => {
		require('../lib/create').create(Object.assign({
			slug
		}, options));
	});
	
program.parse(process.argv);