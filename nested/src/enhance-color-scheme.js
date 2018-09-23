const fs = require('fs');
const yaml = require('js-yaml');
const plist = require('plist');


const recurse_rule = (g_rule, a_path, f_scope) => {
	// rule has `set` action
	if(g_rule.set) recurse_context(g_rule.set, [...a_path, 'set'], f_scope);

	// rule has `push` action
	if(g_rule.push) g_rule.push = recurse_context(g_rule.push, [...a_path, 'push'], f_scope);

	// rule has `embed` action
	if(g_rule.embed) g_rule.embed = recurse_context(g_rule.embed, [...a_path, 'embed'], f_scope);

	// rule has `include` action
	if(g_rule.include) g_rule.include = recurse_context(g_rule.include, [...a_path, 'include'], f_scope);

	// rule has `with_prototype` action
	if(g_rule.with_prototype) g_rule.with_prototype = recurse_context(g_rule.with_prototype, [...a_path, 'with_prototype'], f_scope);

	// ways that scopes are applied
	if(g_rule.scope) f_scope(g_rule.scope, [...a_path, 'scope']);
	if(g_rule.meta_scope) f_scope(g_rule.meta_scope, [...a_path, 'meta_scope']);
	if(g_rule.captures) {
		// each capture
		for(let [s_index, s_capture] of Object.entries(g_rule.captures)) {
			f_scope(s_capture, [...a_path, 'captures', s_index]);
		}
	}
};

const recurse_context = (z_context, a_path, f_scope) => {
	// context is list of rules
	if(Array.isArray(z_context)) {
		let a_rules = z_context;

		// each rule
		for(let [s_index, g_rule] of Object.entries(a_rules)) {
			recurse_rule(g_rule, [...a_path, s_index], f_scope);
		}
	}
};

const collect_scopes = (p_file, s_syntax) => {
	// load ecmascript syntax file contents
	let s_syntax_contents = fs.readFileSync(p_file, 'utf8');

	// parse syntax def as yaml
	let g_syntax = yaml.safeLoad(s_syntax_contents, {
		filename: p_file,
	});

	let as_scopes = new Set();

	// each context in syntax
	for(let [si_context, z_context] of Object.entries(g_syntax.contexts)) {
		recurse_context(z_context, [si_context], s_scopes => s_scopes.split(/\s+/g)
			.forEach((s_scope) => {
				if(s_scope.endsWith(`.${s_syntax}`)) as_scopes.add(s_scope);
			}));
	}

	return as_scopes;
};

let a_mappings_common = [
	[/^entity\.other\.attribute/, 'variable.other.attribute.jsx'],
	[/^entity\.name\.tag/, 'entity.name.tag.jsx'],
	[/^string\.quoted/, 'string.text.jsx'],
	[/^(punctuation\.(definition\.(?!comment)|separator)|keyword\.operator)/, 'punctuation.definition.tag.begin.jsx'],
];

// collect all XML-like syntax scopes
const H_XML_SYNTAXES = {
	html: {
		scopes: collect_scopes('./build/base-packages/HTML/HTML.sublime-syntax', 'html'),
		mappings: new Map([
			// make <script> and <style> tags stand out more
			[/^entity\.name\.tag\.(script|style)/, 'entity.name.class.jsx'],

			...a_mappings_common,
		]),
	},
	xml: {
		scopes: collect_scopes('./syntax_modules/base-packages/XML/XML.sublime-syntax-source', 'xml'),
		mappings: new Map([
			...a_mappings_common,
		]),
	},
};


// theme file
let p_file = process.argv[2];

// load color scheme file contents
let s_scheme = fs.readFileSync(p_file, 'utf8');

// parse scheme def as yaml
let g_scheme = yaml.safeLoad(s_scheme, {
	filename: p_file,
});

// each top-level entry in scheme
for(let g_setting of g_scheme.settings) {
	// setting has scope
	if(g_setting.scope) {
		// parse scopes
		let a_scopes_scheme = g_setting.scope.trim().split(/\s*,\s*/);

		// each scope
		for(let s_scope_scheme of a_scopes_scheme) {
			// scope is for JSX
			if(s_scope_scheme.endsWith('.jsx')) {
				// narrow to prefix
				let s_prefix = s_scope_scheme.replace(/\.jsx$/, '');

				// each XML-like scope
				for(let [, g_syntax_def] of Object.entries(H_XML_SYNTAXES)) {
					let as_scopes_syntax = g_syntax_def.scopes;

					// each scope of that syntax
					for(let s_scope_syntax of as_scopes_syntax) {
						// scope starts with target prefix
						if(s_scope_syntax.startsWith(s_prefix)) {
							// add to scheme
							a_scopes_scheme.push(s_scope_syntax);

							// remove from set
							as_scopes_syntax.delete(s_scope_syntax);
						}
					}
				}
			}
		}

		// reserialize and overwrite scheme scopes
		g_setting.scope = a_scopes_scheme.join(',\n');
	}
}

// each syntax
for(let [, g_syntax_def] of Object.entries(H_XML_SYNTAXES)) {
	let {
		scopes: as_scopes_syntax,
		mappings: hm_map,
	} = g_syntax_def;

	REMAINING:
	// each remaining scope
	for(let s_scope_syntax of as_scopes_syntax) {
		// search mappings for match in scope
		for(let [rt_scope, s_scope_scheme] of hm_map) {
			// matched syntax scope
			if(rt_scope.test(s_scope_syntax)) {
				// find rule where this scheme scope occurs
				for(let g_setting of g_scheme.settings) {
					// setting has scope
					if(g_setting.scope) {
						// parse scopes
						let a_scopes_scheme = g_setting.scope.trim().split(/\s*,\s*/);

						// scope includes target
						if(a_scopes_scheme.includes(s_scope_scheme)) {
							// add syntax scope to setting
							a_scopes_scheme.push(s_scope_syntax);

							// reserialize and overwrite scheme scopes
							g_setting.scope = a_scopes_scheme.join(',\n');

							// remove from set
							as_scopes_syntax.delete(s_scope_syntax);

							// next scope
							continue REMAINING;
						}
					}
				}
			}
		}
	}
}


// output new YAML-tmTheme file
process.stdout.write(plist.build(g_scheme));
