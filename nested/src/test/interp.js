const mods = s_label => [
	`\${${s_label}}`,
	`pre_\${${s_label}}`,
	`\${${s_label}}_post`,
	`pre_\${${s_label}}_post`,
	`pre_\${${s_label}}_mid_\${mod}_post`,
];

const gobble = (s_text, s_indent='') => {
	let m_pad = /^(\s+)/.exec(s_text.replace(/^([ \t]*\n)/, ''));
	if(m_pad) {
		return s_indent+s_text.replace(new RegExp(`\\n${m_pad[1]}`, 'g'), '\n'+s_indent.trim()).trim();
	}
	else {
		return s_indent+s_text.trim();
	}
};

const r_interp = /\$\{[^}]+}/g;

function* permutate(s_label, f_texts) {
	let a_mods = mods(s_label);
	for(let s_mod of a_mods) {
		let a_texts = f_texts(s_mod, (s_mark, s_scopes) => {
			let s_pad = s_mark.replace(/^[\n\t]+\/\//, '').slice(0, -1);
			let a_parts = [];
			let i_prev = 0;
			for(let m_interp=r_interp.exec(s_mod); null!==m_interp; m_interp=r_interp.exec(s_mod)) {
				if(m_interp.index) a_parts.push(`${' '.repeat(i_prev)}^ ${s_scopes}`);

				let i_interp = m_interp.index;
				a_parts.push(...[
					`${' '.repeat(i_interp)}^ punctuation.definition.string.interpolated.element.begin.es`,
					`${' '.repeat(i_interp+2)}^ meta.interpolation.interpolated.es variable.other.readwrite.es`,
				]);

				i_prev = m_interp.index+m_interp[0].length;
			}

			if(i_prev < s_mod.length) a_parts.push(`${' '.repeat(i_prev)}^ ${s_scopes}`);

			return a_parts.map(s => `//${s_pad}${s}`).join('\n');
		});

		for(let s_text of a_texts) {
			yield s_text.replace(/\n\t+/g, '\n').replace(/^\n/, '');
		}
	}
}


let s_out = [
	'class test_method_signatures {',
	...permutate('method', (s, ids) => [
		...['get', 'set'].map(s_type => `
			   ${s_type} ${s}() {}
			// ^ storage.type.accessor.js storage.modifier.accessor.${s_type}.es
			${ids(`
			//     ^`, `entity.name.method.js entity.name.accessor.${s_type}.es`)}
		`),
		`
			   static ${s}() {}
			// ^ storage.modifier.static.es storage.type.js
			//   ^ entity.name.method.js entity.name.method.static.es
			${ids(`
			//        ^`, `entity.name.method.js entity.name.method.async.es`)}
		`,
		`
			   * ${s}() {}
			// ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
			${ids(`
			//        ^`, `entity.name.method.js entity.name.method.generator.es`)}
		`,
		`
			   async ${s}() {}
			// ^ storage.modifier.async.method.es
			//      ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
			${ids(`
			//        ^`, `entity.name.method.js entity.name.method.async.es`)}
		`,
		`
			   async* ${s}() {}
			// ^ storage.modifier.async.method.es
			//      ^ keyword.generator.asterisk.js storage.modifier.generator.asterisk.method.es
			${ids(`
			//        ^`, `entity.name.method.js entity.name.method.async.es`)}
		`,
	]),
	'}',
].join('\n');

process.stdout.write(`// SYNTAX TEST "Packages/User/ecmascript-sublime/ecmascript.sublime-syntax"
/* eslint-disable */

/* syntax: js */ \`
${s_out}
\`;
`);
