const fs = require('fs');
const yaml = require('js-yaml');
const jp = require('jsonpath');

// -- rule for escaping interpolation element --
const interp_escape_lookahead = () => ({
	// The first match here captures cases like this in ES tagged templates:
	//
	//   <foo bar=${expression} baz=${expression}>
	//
	// If we did not treat this as a special case, ‘baz=’ would end up being seen
	// as an unquoted attribute value.
	//
	// Because there are various places where = is matched with special handling
	// for well-known attributes, this repeats a few times elsewhere.
	match: String.raw /* syntax: sublime-syntax.regex */ `=(?=\$\{)`,
	scope: 'punctuation.separator.key-value.html',
	pop: true,
});

// transforms for select syntaxes
const h_syntax_transforms = {
	// the default markdown syntax embeds LOTS of contexts recursively.
	//   this library CAN generate all the proper syntaxes to avoid
	//   an otherwise infinite recursion, but the resulting top-level
	//   syntax actually exceeds the 25,000 context limit  >_>
	//   so instead, we neuter the markdown syntax
	'text.html.markdown': {
		'$.contexts["fenced-code-block"]': (a_rules) => {
			for(let i_rule=a_rules.length-1; i_rule>=0; i_rule--) {
				let g_rule = a_rules[i_rule];

				if(g_rule.embed) a_rules.splice(i_rule, 1);
			}
		},
	},

	'text.html.basic': {
		'$.variables': (h_vars) => {
			h_vars.unquoted_attribute_value = String.raw /* syntax: sublime-syntax.regexp */ `(?:[^\s<>/''"]|/(?!>))+`;
		},

		'$.contexts["style-type-attribute"][0].set': (a_rules) => {
			a_rules.splice(1, 0, interp_escape_lookahead());
		},

		'$.contexts["script-type-attribute"][0].set': (a_rules) => {
			a_rules.splice(1, 0, interp_escape_lookahead());
		},

		// allow for empty attribute names so they can be interpolated
		'$.contexts["tag-generic-attribute"][0]': (g_rule) => {
			g_rule.match = g_rule.match.replace(/(\)?)$/, '|=$1');
		},

		'$.contexts': (h_contexts) => {
			// each context
			for(let [si_context, a_rules] of Object.entries(h_contexts)) {
				// an attribute equals context
				if(si_context.endsWith('-attribute-equals')) {
					a_rules.unshift(interp_escape_lookahead());
				}
			}
		},

		'$.contexts.main': (a_rules) => {
			a_rules.splice(-2, 0, {
				// Special case for handling ES tagged template where interpolation occurs in
				// tag name position:

				// <${expression} attr=val>

				// If we did not include this case, the ‘<’ would be scoped as ordinary
				// chardata.
				match: String.raw /* syntax: sublime-syntax.regexp */ `(</?)(?=\$\{)`,
				captures: {
					1: 'punctuation.definition.tag.begin.html',
				},
				push: [
					{
						meta_scope: 'meta.tag.other.html',
					},
					{
						match: `(?: ?/)?>`,
						scope: 'punctuation.definition.tag.end.html',
						pop: true,
					},
					{
						include: 'tag-attributes',
					},
				],
			});
		},
	},

	// makes it nice and easy to code custom syntax injections
	'source.yaml.sublime.syntax': {
		'$.contexts.context_definition': (a_rules) => {
			a_rules[0].match = a_rules[0].match.replace(/ \{1,2\}/, '[ \t]+');
		},
	},
};

module.exports = class syntax {
	constructor(g_analyze) {
		let {
			source: p_file,
			scopes: a_scopes=[],
		} = g_analyze;

		// load file contents into string
		let s_syntax = fs.readFileSync(p_file, 'utf8');

		// parse syntax def as yaml
		let g_syntax = yaml.safeLoad(s_syntax, {
			filename: p_file,
		});

		// scope has transformations
		if(h_syntax_transforms[g_syntax.scope]) {
			let h_transforms = h_syntax_transforms[g_syntax.scope];
			for(let [s_query, f_transform] of Object.entries(h_transforms)) {
				for(let z_item of jp.query(g_syntax, s_query)) {
					f_transform(z_item);
				}
			}
		}

		// save fields
		Object.assign(this, {
			dirty: false,
			source: p_file,
			syntax: g_syntax,
			scopes: a_scopes,
			nested: new Set(),
		});
	}

	scope() {
		return this.syntax.scope;
	}

	size() {
		return Object.keys(this.syntax.contexts).length;
	}

	clean_context(z_context, s_path, b_print) {
		// target is a context name
		if('string' === typeof z_context) {
			let si_context = z_context;

			// context name is scope
			if(si_context.startsWith('scope:')) {
				let [s_scope, s_subcontext] = si_context.slice('scope:'.length).split('#');

				// add to list of nested scopes
				this.nested.add(s_scope);

				// scope is hot
				if(this.scopes.includes(s_scope)) {
					// update dirty flag
					this.dirty = true;

					// replace it
					let s_replace = `scope:${s_scope}.nested.es${s_subcontext? '#'+s_subcontext: ''}`;

					// print notice to stderr
					if(b_print) console.warn(`[${si_context}] => [${s_replace}] @${s_path}`);

					// return to caller
					return s_replace;
				}
			}
		}
		// list of rules
		else if(Array.isArray(z_context)) {
			let a_rules = z_context;

			// each rule in context
			let i_rule = 0;
			for(let g_rule of a_rules) {
				this.clean_rule(g_rule, `${s_path}[${i_rule++}]`, b_print);
			}
		}

		// unaffected
		return z_context;
	}

	clean_rule(g_rule, s_path, b_print) {
		// rule has `set` action
		if(g_rule.set) g_rule.set = this.clean_context(g_rule.set, `${s_path}/#set`, b_print);

		// rule has `push` action
		if(g_rule.push) g_rule.push = this.clean_context(g_rule.push, `${s_path}/#push`, b_print);

		// rule has `embed` action
		if(g_rule.embed) g_rule.embed = this.clean_context(g_rule.embed, `${s_path}/#embed`, b_print);

		// rule has `include` action
		if(g_rule.include) g_rule.include = this.clean_context(g_rule.include, `${s_path}/#include`, b_print);

		// rule has `with_prototype` action
		if(g_rule.with_prototype) g_rule.with_prototype = this.clean_context(g_rule.with_prototype, `${s_path}/#with_prototype`, b_print);

		// return rule
		return g_rule;
	}

	analyze(b_print=false) {
		let g_syntax = this.syntax;

		// each context
		let h_contexts = g_syntax.contexts;
		for(let [si_context, z_context] of Object.entries(h_contexts)) {
			// clean out bad stack changes
			h_contexts[si_context] = this.clean_context(z_context, [si_context], b_print);
		}

		// made changes
		return [this.dirty, this.nested];
	}


	mutate() {
		let g_syntax = this.syntax;

		// // print scopes
		// console.warn('hot scopes: '+this.scopes.join(' | '));

		// analyze
		this.analyze(true);

		// make name clear
		g_syntax.name = `Ecmascript nested syntax - ${g_syntax.name}`;

		// do not show in menu
		g_syntax.hidden = true;

		// privatize scope
		g_syntax.scope = `${g_syntax.scope}.nested.es`;

		// remove file extensions / first line match
		if(g_syntax.file_extensions) delete g_syntax.file_extensions;
		if(g_syntax.first_line_match) delete g_syntax.first_line_match;

		// dump changes
		return `%YAML 1.2\n---\n${yaml.safeDump(g_syntax)}`;
	}
};
