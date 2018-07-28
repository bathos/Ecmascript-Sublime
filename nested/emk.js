const fs = require('fs');

const syntax = require('./src/syntax.js');
const stack_filter = require('./src/stack-filter.js');

// directory to keep syntax modules
const pd_syntaxes = 'syntax_modules';

// hash of syntax modules to source from
const h_syntax_modules = {
	'base-packages': {
		repository: 'https://github.com/sublimehq/Packages',
	},
	glsl: {
		repository: 'https://github.com/euler0/sublime-glsl',
		tag: 'v1.0.1',
	},
};


// search for syntax files under a given directory
const find_syntaxes = (p_scan, h_syntaxes) => {
	// scan directory
	let a_files = fs.readdirSync(p_scan);

	// each file
	for(let s_file of a_files) {
		let p_file = `${p_scan}/${s_file}`;

		// stat file
		let dk_stats = fs.statSync(p_file);

		// directory; recurse
		if(dk_stats.isDirectory()) {
			find_syntaxes(p_file, h_syntaxes);
		}
		// syntax file
		else if(p_file.endsWith('.sublime-syntax-source')) {
			// parse syntax def as yaml
			let k_syntax = new syntax({
				source: p_file,
			});

			// make scope association
			h_syntaxes[k_syntax.scope()] = p_file;
		}
	}
};

// initial set of dirty syntaxes
let h_dirty = {
	'source.js': 'scope:source.js.nested.es',
	'text.html.jsp': 'scope:text.plain',
	'text.tex.latex': 'scope:text.plain',
	'source.asp': 'scope:text.plain',
	'commands.builtin.shell.bash': 'scope:text.plain',
};

// scope to syntaxes hash
let h_syntaxes = {};

// graph
let h_outs = {};

GRAPH: {
	let b_modules_absent = false;

	// syntax modules directory exists?
	try {
		fs.accessSync(pd_syntaxes);
	}
	catch(e_access) {
		b_modules_absent = true;
	}

	// no modules yet
	if(b_modules_absent) break GRAPH;

	// load scope to syntaxes hash
	let a_repos = fs.readdirSync(pd_syntaxes);
	for(let s_repo of a_repos) {
		find_syntaxes(`${pd_syntaxes}/${s_repo}`, h_syntaxes);
	}

	// until there are no new dependents
	for(;;) {
		let b_clean = true;

		// each syntax file
		for(let [si_scope, p_syntax] of Object.entries(h_syntaxes)) {
			// already a dependent; skip
			if(si_scope in h_dirty) continue;

			// check if it includes any of the current dependents
			let [b_dirty, as_nested] = stack_filter.analyze({
				source: p_syntax,
				scopes: Object.keys(h_dirty),
			});

			// save to graph
			h_outs[si_scope] = as_nested;

			// syntax is dirty
			if(b_dirty) {
				// add to hash
				h_dirty[si_scope] = p_syntax;

				// scan again after this
				b_clean = false;
			}
		}

		// all dependents have been identified
		if(b_clean) break;
	}

	// check for cycles
	{
		let h_marks = {};
		const visit = (si_node, a_path) => {
			let xc_mark = h_marks[si_node];
			if(2 === xc_mark) return;
			if(1 === xc_mark) return console.error(`cycle detected @${a_path.join('/')}`);

			h_marks[si_node] = 1;

			if(h_outs[si_node]) {
				for(let si_out of h_outs[si_node]) {
					visit(si_out, [...a_path, si_out]);
				}
			}

			h_marks[si_node] = 2;
		};

		for(let si_node in h_outs) h_marks[si_node] = 0;
		for(let si_node in h_dirty) {
			if(!h_marks[si_node]) {
				visit(si_node, [si_node]);
			}
		}
	}
}


// only generate syntaxes that are directly or indirectly nested by Ecmascript
let a_nested_scopes = (() => {
	let as_nested_scopes = new Set();

	// reflection
	let k_ecmascript = new syntax({
		source: '../ecmascript.sublime-syntax',
	});

	// get nested scopes
	let [, as_nested] = k_ecmascript.analyze();

	// filter nested ones
	as_nested = new Set([...as_nested]
		.filter(s => s.endsWith('.nested.es'))
		.map(s => s.replace(/\.nested\.es$/, '')));

	const add_dependencies = (si_scope) => {
		// node has outgoing edges
		if(h_outs[si_scope]) {
			// each of its dependency
			for(let si_out of h_outs[si_scope]) {
				// already in output
				if(as_nested_scopes.has(si_out)) continue;

				// dirty dependency
				if(si_out in h_dirty) {
					// add to outputs
					as_nested_scopes.add(si_out);

					// check all of its dependencies
					add_dependencies(si_out);
				}
			}
		}
	};

	// each dirty syntax
	for(let si_scope of Object.keys(h_dirty)) {
		// direct dependent
		if(as_nested.has(si_scope)) {
			// add to outputs
			as_nested_scopes.add(si_scope);

			// check all of its dependencies
			add_dependencies(si_scope);
		}
	}

	return [...as_nested_scopes];
})();


// export emk build descriptor
module.exports = {
	defs: {
		ecmascript_mode: ['nest', 'safe']
			.map(s => `ecmascript-${s}.sublime-syntax`),

		syntax: a_nested_scopes
			.filter(s => 'source.js' !== s)
			.map(s => h_syntaxes[s].replace(/^(?:[^/]+\/)/, '').replace(/-source$/, '')),

		syntax_module: Object.keys(h_syntax_modules),
	},

	tasks: {
		all: 'build/**',

		init: {
			syntax_modules: `${pd_syntaxes}/**`,
		},

		update: {
			syntax_modules: () => ({
				run: Object.keys(h_syntax_modules)
					.map(s_dir => /* syntax: bash */ `
						pushd '${pd_syntaxes}/${s_dir}'
							git pull
						popd
					`).join('\n'),
			}),
		},

		clean: () => ({
			run: /* syntax: bash */ `rm -rf build/`,
		}),

		reset: () => ({
			deps: ['clean'],
			run: /* syntax: bash */ `rm -rf node_modules/ ${pd_syntaxes}/ && echo 'run \`npm i\` to reinitialize'`,
		}),
	},

	outputs: {
		build: {
			ecmascript: {
				':ecmascript_mode': h => ({
					deps: [
						'src/modify-ecmascript.js',
						'../ecmascript.sublime-syntax',
					],

					run: /* syntax: bash */ `
						node $1 $2 ${h.ecmascript_mode.replace(/^ecmascript-(.+)\.sublime-syntax$/, '$1')} > $@
					`,
				}),
			},

			':syntax': h => ({
				deps: [
					'src/stack-filter.js',
					`${pd_syntaxes}/${h.syntax}-source`,
				],

				run: /* syntax: bash */ `
					node $1 ${/* eslint-disable indent */
						Buffer.from(JSON.stringify(
							a_nested_scopes
						)).toString('base64')
					/* eslint-enable */} "$2" > $@
				`,
			}),
		},

		[pd_syntaxes]: {
			':syntax_module': h => (g_module => ({
				run: /* syntax: bash */ `
					# clone repository
					git clone --single-branch ${g_module.repository} $@ && cd $@

					${g_module.tag /* eslint-disable indent */
						? /* syntax: bash */ `
							# checkout a tagged release
							git checkout -b tags/${g_module.tag}
							git branch --set-upstream-to=origin/master tags/${g_module.tag}
						`.trim()
						: ''/* eslint-enable */}

					# rename all sublime-syntax files to avoid loading them in development
					IFS=$'\n'
					for file in $(find . -name "*.sublime-syntax"); do
						mv "$file" "\${file%.sublime-syntax}.sublime-syntax-source"
					done
				`,
			}))(h_syntax_modules[h.syntax_module]),
		},
	},
};
