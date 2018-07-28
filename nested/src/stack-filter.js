const syntax = require('./syntax.js');

module.exports = {
	analyze(g_analyze) {
		let k_syntax = new syntax(g_analyze);

		return k_syntax.analyze();
	},
};


// cli
if(module === require.main) {
	// parse json from input argument
	let a_scopes = JSON.parse(Buffer.from(process.argv[2], 'base64').toString('utf8'));

	// source syntax file
	let p_file = process.argv[3];

	// instance
	let k_syntax = new syntax({
		source: p_file,
		scopes: a_scopes,
	});

	// mutate and print
	process.stdout.write(k_syntax.mutate());
}
