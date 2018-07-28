const fs = require('fs');
const yaml = require('js-yaml');
const jp = require('jsonpath');

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

// each context
let h_contexts = g_syntax.contexts;
for(let [si_context] of Object.entries(h_contexts)) {
	// remove blacklisted contexts
	if(si_context.startsWith('syntax_')) {
		delete h_contexts[si_context];
	}
}

// make this syntax a nested one
if('nest' === s_mode) {
	let si_string_interp = 'punctuation.definition.string.interpolated';

	const match_replace = (r_find, s_replace) => g_rule => g_rule.match = g_rule.match.replace(r_find, s_replace);

	const captures = (i_group, si_scope) => `$..*[?(@.captures["${i_group}"]=="${si_scope}")]`;
	const scope_equals = si_scope => `$..*[?(@.scope=="${si_scope}")]`;

	let f_escape_backtick = match_replace(/([`])/g, '\\\\$1');

	// add escape character in front of template controls to keep nested
	let h_transforms = {
		[scope_equals(`${si_string_interp}.begin.es`)]: f_escape_backtick,
		[scope_equals(`${si_string_interp}.end.es`)]: f_escape_backtick,

		[captures(3, `${si_string_interp}.begin.es`)]: f_escape_backtick,

		'$.templateString_AFTER_OPEN[?(@.scope=="constant.character.escape.es")]': match_replace(/^(.)/, '\\\\\\\\$1'),

		[captures(2, `${si_string_interp}.element.begin.es`)]: match_replace(/\$/, '\\\\$'),

		'$.string_COMMON_QUOTED[?(@.match)]': match_replace(/^(.)/, '\\\\$1'),
		'$.string_COMMON_ESCAPES[?(@.match)]': match_replace(/^(.)/, '\\\\$1'),
	};

	// each transform
	for(let [s_json_path, f_transform] of Object.entries(h_transforms)) {
		for(let g_rule of jp.query(h_contexts, s_json_path)) {
			f_transform(g_rule);
		}
	}

	// rename syntax
	g_syntax.name = `Ecmascript nested syntax - Ecmascript`;

	// do not show in menu
	g_syntax.hidden = true;

	// privatize scope
	g_syntax.scope = `source.js.nested.es`;
}
else if('safe' === s_mode) {
	// rename syntax
	g_syntax.name = `Ecmascript: Safe Mode`;
}
else {
	throw new Error(`unrecognized mode: ${s_mode}`);
}

// reinsert safe contexts
h_contexts.syntax_OPEN = [{include:'block_comment'}];
h_contexts.syntax_NO_IN_OPEN = [{include:'block_comment'}];

// dump changes
process.stdout.write(`%YAML 1.2\n---\n${yaml.safeDump(g_syntax)}`);
