const fs = require('fs');
const yaml = require('js-yaml');
const jp = require('jsonpath');

const B_DEBUG_ILLEGAL = true;

// syntax file
let p_file = process.argv[2];

// mode
let s_mode = process.argv[3];

// load ecmascript syntax file contents
let s_syntax = fs.readFileSync(p_file, 'utf8');

// parse syntax def as yaml
let g_syntax = yaml.safeLoad(s_syntax, {
	filename: p_file,
});

// remove syntax contexts
{
	// each context
	let h_contexts = g_syntax.contexts;
	for(let [si_context, a_rules] of Object.entries(h_contexts)) {
		// remove blacklisted contexts
		if(si_context.startsWith('syntax_') || /(_JSX|JSX_)/.test(si_context)) {
			delete h_contexts[si_context];
		}

		// iterate in reverse to allow for splicing
		for(let i_rule=a_rules.length-1; i_rule>=0; i_rule--) {
			let g_rule = a_rules[i_rule];

			// rule has comment (could be annotation)
			if(g_rule.comment) {
				// match annotation
				let m_annotation = /\$(\w+)\(.*\)/.exec(g_rule.comment);
				if(m_annotation) {
					// blacklist
					if('blacklist' === m_annotation[1]) {
						a_rules.splice(i_rule, 1);
					}
				}
			}
		}
	}

	// remove ae_JSX
	let a_ae_rules = h_contexts.assignmentExpression_CORE;
	a_ae_rules.splice(a_ae_rules.findIndex(g => 'ae_JSX' === g.include), 1);

	// see: https://github.com/SublimeTextIssues/Core/issues/2395
	// see: https://github.com/bathos/Ecmascript-Sublime/issues/79
	// insert root rules into main context including import and export stmnts
	h_contexts.main.splice(-1, 1, ...[
		...h_contexts.root.slice(0, -1),
		{
			match: '{{PLA_anything}}',
			push: 'root',
		},
	]);
}

// make this syntax a nested one
if('nest' === s_mode) {
	let si_string_interp = 'punctuation.definition.string.interpolated';

	const gobble = (s_text, s_indent='') => {
		let m_pad = /^(\s+)/.exec(s_text.replace(/^([ \t]*\n)/, ''));
		if(m_pad) {
			return s_indent+s_text.replace(new RegExp(`\\n${m_pad[1]}`, 'g'), '\n'+s_indent.trim()).trim();
		}
		else {
			return s_indent+s_text.trim();
		}
	};

	const clone = (z_source) => {
		if(Array.isArray(z_source)) {
			return z_source.slice().map(z_item => clone(z_item));
		}
		else if('object' === typeof z_source) {
			let h_clone = {};
			for(let [s_key, z_value] of Object.entries(z_source)) {
				h_clone[s_key] = clone(z_value);
			}
			return h_clone;
		}

		return z_source;
	};

	const stack_top = (g_rule, f_set=null) => {
		let s_action;
		if(g_rule.set) s_action = 'set';
		else if(g_rule.push) s_action = 'push';

		if(s_action) {
			let z_action = g_rule[s_action];

			if(Array.isArray(g_rule[s_action])) {
				let a_stack = z_action;
				let si_scope_top = a_stack.pop();
				a_stack.push(f_set? f_set(si_scope_top): si_scope_top);
				return si_scope_top;
			}
			else {
				return g_rule[s_action] = f_set? f_set(g_rule[s_action]): g_rule[s_action];
			}
		}

		return null;
	};

	const distinct_id = n_id => Buffer.from(n_id+'').toString('base64').replace(/=+$/, '');

	const yaml_load = z_yaml => 'string' === typeof z_yaml
		? yaml.safeLoad(`%YAML 1.2\n---\n${gobble(z_yaml)}\n`)
		: z_yaml;

	const regexp = r_source => r_source.toString().replace(/^\/(.+)\/[^/]*/, '$1');

	const match_replace = (r_find, s_replace) => g_rule => g_rule.match = g_rule.match.replace(r_find, s_replace);

	const insert_rules = (z_inserts, i_insert) => a_rules => a_rules.splice(i_insert, 0, ...(yaml_load(z_inserts)).map(yaml_load));

	const captures = (i_group, si_scope) => `$.contexts..*[?(@.captures["${i_group}"]=="${si_scope}")]`;
	const scope_equals = si_scope => `$.contexts..*[?(@.scope=="${si_scope}")]`;

	let f_escape_backtick = match_replace(/([`])/g, '\\\\$1');

	let c_illegals = 0;

	// add escape character in front of template controls to keep nested
	let h_transforms = {
		[scope_equals(`${si_string_interp}.begin.es`)]: f_escape_backtick,
		[scope_equals(`${si_string_interp}.end.es`)]: f_escape_backtick,

		[captures(3, `${si_string_interp}.begin.es`)]: f_escape_backtick,

		'$.contexts.templateString_AFTER_OPEN[?(@.scope=="constant.character.escape.es")]': match_replace(/^(.)/, '\\\\\\\\$1'),

		[captures(2, `${si_string_interp}.element.begin.es`)]: match_replace(/\$/, '\\\\$'),

		'$.contexts.string_COMMON_QUOTED[?(@.match)]': match_replace(/^(.)/, '\\\\$1'),
		'$.contexts.string_COMMON_ESCAPES[?(@.match)]': match_replace(/^(.)/, '\\\\$1'),

		'$.variables': h_variables => Object.assign(h_variables, {
			identifierName: regexp(/(?:{{identifierStart}}{{identifierPart}}*|(?=[-+*/%&|^<>=:;\[\]?,(]|\.{{identifierStart}}))/),
			// identifierName: regexp(/(?:{{identifierStart}}{{identifierPart}}*|(?=\$\{))/),
			identifierPart: regexp(/(?:\$(?!\{)|[{{identifierContinueChars}}]|{{unicodeEscape}})/),
			identifierStart: regexp(/(?:\$(?!\{)|[\p{IDS}_]|{{unicodeEscape}})/),
			idEnd: regexp(/(?=\$(?!\{)|[^{{identifierContinueChars}}\\]|$)/),
		}),

		'$.contexts.assignmentExpression': insert_rules(/* syntax: sublime-syntax#context */ `
			- match: '\\.(?=\\s*[\\}\\)\\]])'
			  scope: invalid.illegal.token
			  pop: true
			- match: \\.(?!\\d|\\.\\.)
			  scope: keyword.operator.accessor.es
			  set: ae_AFTER_ACCESSOR_OPERATOR
			- match: \\?\\.(?!\\d)
			  scope: keyword.operator.accessor.optional-chaining.es
			  set: ae_AFTER_ACCESSOR_OPERATOR
		`, 1),

		'$.contexts.classDeclaration_AFTER_CLASS[?(@.set=="classDeclaration_AFTER_NAME")]': match_replace(/(\)+)$/, '|(?=\\s*(?:\\{|extends))$1'),

		'$.contexts.classDeclaration_AFTER_NAME': insert_rules(/* syntax: sublime-syntax#context */ `
			- match: '((extends))\\s*(?=\\$\\{)'
			  captures:
			    1: storage.type.extends.js
			    2: storage.modifier.extends.es
			  set: classDeclaration_AFTER_HERITAGE
		`, 1),

		'$.contexts.*': (a_rules) => {
			let h_resume_scopes = {};

			let r_regex_id = /^(.*\{\{identifierName\}\}\)*)(?:\{\{idEnd\}\})?$/;
			for(let i_rule=0, nl_rules=a_rules.length; i_rule<nl_rules; i_rule++) {
				let g_rule = a_rules[i_rule];
				if(g_rule.match) {
					let m_regex_id = r_regex_id.exec(g_rule.match);
					if(m_regex_id) {
						let [, s_pattern] = m_regex_id;

						let g_clone = clone(g_rule);
						stack_top(g_clone, (si_scope_resume) => {
							h_resume_scopes[si_scope_resume] = g_rule;
							return `${si_scope_resume}_INTERP`;
						});

						// clone rule, change match pattern
						a_rules.splice(i_rule++, 0, {
							...g_clone,
							match: `${s_pattern}(?=\\$\\{)`,
						});
					}
				}

				if('assignmentExpression' === stack_top(g_rule)) {
					let g_clone = clone(g_rule);
					g_clone.match += '(?=\\s*\\$\\{)';
					stack_top(g_clone, si_scope => `${si_scope}_INTERP`);
					a_rules.splice(i_rule++, 0, g_clone);
				}

				// illegal token distinct naming for debugging
				if(B_DEBUG_ILLEGAL) {
					if(g_rule.scope && 'invalid.illegal.token.es' === g_rule.scope) {
						g_rule.scope += '.'+distinct_id(c_illegals++);
					}

					if(g_rule.include && g_rule.include.startsWith('other_illegal')) {
						a_rules.splice(i_rule, 1, {
							match: '{{MAT_word_or_any_one_char}}',
							scope: `invalid.illegal.token.es.${distinct_id(c_illegals++)}`,
							...(g_rule.include.endsWith('_pop')? {pop:true}: {}),
						});
					}
				}
			}

			for(let [si_scope, g_rule] of Object.entries(h_resume_scopes)) {
				let si_scope_next = stack_top(g_rule);
				g_syntax.contexts[`${si_scope}_INTERP`] = [
					{
						match: '(({{identifierPart}}))(?=\\$\\{)',
						...(g_rule.captures? {captures:clone(g_rule.captures)}: {}),
						...(g_rule.scope? {scope:g_rule.scope}: {}),
					},
					{
						match: '(({{identifierName}}))',
						...(g_rule.captures? {captures:clone(g_rule.captures)}: {}),
						...(g_rule.scope? {scope:g_rule.scope}: {}),
						set: si_scope_next,
					},
					{
						include: si_scope_next,
					},
				];
			}
		},

		'$.contexts.classDeclaration_METHOD_COMMON': (a_rules) => {
			insert_rules(/* syntax: sublime-syntax#contexts */ `
				- match: (?=\\()
				  set: [ classDeclaration_AFTER_BRACE, method_AFTER_NAME ]
			`, 6)(a_rules);

			insert_rules([
				...yaml_load(/* syntax: sublime-syntax#contexts */ `
					- match: ((\\*))(?=\\s*\\$\{)
					  captures:
					    1: keyword.generator.asterisk.js
					    2: storage.modifier.generator.asterisk.method.es
					  set: [ classDeclaration_AFTER_BRACE, generatorMethod_AFTER_NAME_INTERP ]
				`),

				...(['get', 'set'].reduce((a_ins, s_modifier) => [...a_ins,
					...yaml_load(/* syntax: sublime-syntax#contexts */ `
						- match: ((${s_modifier}))(?=\\s*\\$\\{)(?!\\s*[\\(=;])
						  captures:
						    1: storage.type.accessor.js
						    2: storage.modifier.accessor.${s_modifier}.es
						  set: [ classDeclaration_AFTER_BRACE, accessorMethod_AFTER_${s_modifier.toUpperCase()}_NAME_INTERP ]
					`)], [])),

				...yaml_load(/* syntax: sublime-syntax#contexts */ `
					- match: ((async))((\\s*\\*))?(?=\\s*\\$\{)
					  captures:
					    1: storage.type.accessor.js
					    2: storage.modifier.async.method.es
					    3: keyword.generator.asterisk.js
					    4: storage.modifier.generator.asterisk.method.es
					  set: [ classDeclaration_AFTER_BRACE, asyncMethod_AFTER_NAME_INTERP ]
					- match: '(({{identifierName}}))(?=\\$\\{)'
					  captures:
					    1: entity.name.method.js
					    2: entity.name.method.es
					  set: [ classDeclaration_AFTER_BRACE, method_AFTER_NAME_INTERP ]
				`),
			], 0)(a_rules);
		},

		'$.contexts.constLetVarDeclaration_AFTER_WORD': insert_rules([
			{include:'constLetVarDeclaration_AFTER_BINDING_INTERP'},
		], -1),

		'$.contexts.functionDeclaration_AFTER_FUNCTION': (a_rules) => {
			insert_rules(/* syntax: sublime-syntax#context */ `
				- match: '(({{allThreeIDs}}))(?=\\$\\{)'
				  captures:
				    1: entity.name.function.allCap.es
				    2: entity.name.function.initCap.es
				    3: entity.name.function.es
			`, 0)(a_rules);

			insert_rules([
				{include:'functionDeclaration_AFTER_NAME'},
			], -1)(a_rules);
		},

		'$.contexts': h_contexts => Object.assign(h_contexts, {
			// method, asyncMethod, and generatorMethod
			...yaml_load(['', 'async', 'generator'].reduce((s_ins, s_mod) => s_ins + /* syntax: sublime-syntax#contexts */ `
					${s_mod? `${s_mod}M`: 'm'}ethod_AFTER_NAME_INTERP:
					  - match: '(({{identifierPart}}))(?=\\$\\{)'
					    captures:
					      1: entity.name.method.js
					      2: entity.name.method${s_mod? `.${s_mod}`: ''}.es
					  - match: '(({{identifierName}}))'
					    captures:
					      1: entity.name.method.js
					      2: entity.name.method${s_mod? `.${s_mod}`: ''}.es
					    set: ${s_mod? `${s_mod}M`: 'm'}ethod_AFTER_NAME
					  - include: ${s_mod? `${s_mod}M`: 'm'}ethod_AFTER_NAME
				`, '')),

			// get and set accessorMethods
			...(['get', 'set'].reduce((h_ins, s_modifier) => Object.assign(h_ins, {
				...yaml_load(/* syntax: sublime-syntax#contexts */ `
					accessorMethod_AFTER_${s_modifier.toUpperCase()}_NAME_INTERP:
					  - match: '(({{identifierPart}}))(?=\\$\\{)'
					    captures:
					      1: storage.type.accessor.js
					      2: storage.modifier.accessor.${s_modifier}.es
					  - match: '(({{identifierPart}})){{idEnd}}'
					    captures:
					      1: storage.type.accessor.js
					      2: storage.modifier.accessor.${s_modifier}.es
					    set: accessorMethod_AFTER_${s_modifier.toUpperCase()}_NAME
					  - include: accessorMethod_AFTER_${s_modifier.toUpperCase()}_NAME
				`),

				...yaml_load(/* syntax: sublime-syntax#contexts */ `
					constLetVarDeclaration_AFTER_BINDING_INTERP:
					  - match: '(({{allThreeIDs}}))(?=\\s*\\$\\{)'
					    captures:
					      1: variable.other.readwrite.allCap.es
					      2: variable.other.readwrite.initCap.es
					      3: variable.other.readwrite.es
					  - include: constLetVarDeclaration_AFTER_BINDING
					assignmentExpression_INTERP:
					  - include: ae_AFTER_IDENTIFIER
				`),
			}), {})),
		}),
	};

	// each transform
	for(let [s_json_path, f_transform] of Object.entries(h_transforms)) {
		for(let z_result of jp.query(g_syntax, s_json_path)) {
			f_transform(z_result);
		}
	}

	// rename syntax
	g_syntax.name = `Ecmascript nested syntax - Ecmascript`;

	// privatize scope
	g_syntax.scope = `source.js.nested.es`;
}
else if('safe' === s_mode) {
	// rename syntax
	g_syntax.name = `Ecmascript: Safe Mode`;

	// privatize scope
	g_syntax.scope = 'source.safe.es';
}
else {
	throw new Error(`unrecognized mode: ${s_mode}`);
}

// do not show in menu
g_syntax.hidden = true;

// reinsert safe contexts
Object.assign(g_syntax.contexts, {
	syntax_OPEN: [{include:'block_comment'}],
	syntax_NO_IN_OPEN: [{include:'block_comment'}],
});

// dump changes
process.stdout.write(`%YAML 1.2\n---\n${yaml.safeDump(g_syntax, {noRefs:true})}`);
