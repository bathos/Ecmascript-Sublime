/* eslint-disable */

// identifier substituion tests
/* syntax: js */ `
	let normal = 1;

	let ${decl} = 1;

	let pre_${decl} = 1;

	let ${decl}_post = 1;

	let pre_${decl}_post = 1;

	let pre_${decl}_mid_${mod}_post = 1;


	'normal';

	'${string}';

	'pre_${string}';

	'${string}_post';

	'pre_${string}_post';

	'pre_${string}_mid_${mod}_post';


	let thing = normal;

	let thing = ${value};

	let thing = pre_${value};

	let thing = ${value}_post;

	let thing = pre_${value}_post;

	let thing = pre_${value}_mid_${mod}_post;


	thing += normal;

	thing += ${value};

	thing += pre_${value};

	thing += ${value}_post;

	thing += pre_${value}_post;

	thing += pre_${value}_mid_${mod}_post;


	thing.normal();

	thing.${method}();

	thing.pre_${method}();

	thing.pre_${method}_post();

	thing.pre_${method}_mid_${mod}_post();


	normal.call();

	${value}.call();

	pre_${value}.call();

	${value}_post.call();

	pre_${value}_post.call();

	pre_${value}_mid_${mod}_post.call();


	function normal() {}

	function ${decl}() {}

	function pre_${decl}() {}

	function ${decl}_post() {}

	function pre_${decl}_post() {}

	function pre_${decl}_mid${mod}_post() {}


	function* normal() {}

	function* ${decl}() {}

	function* pre_${decl}() {}

	function* ${decl}_post() {}

	function* pre_${decl}_post() {}

	function* pre_${decl}_mid${mod}_post() {}


	class ${s_super} {
		constructor() {}
	}

	class ${s_class} extends ${s_super} {
		constructor() {}


		normal() {}

		${method}() {}

		pre_${method}() {}

		${method}_post() {}

		pre_${method}_post() {}

		pre_${method}_mid_${mod}_post() {}


		static normal() {}

		static ${method}() {}

		static pre_${method}() {}

		static ${method}_post() {}

		static pre_${method}_post() {}

		static pre_${method}_${mod}_post() {}


		get normal() {}

		get pre_${method}() {}

		get ${method}_post() {}

		get pre_${method}_post() {}

		get pre_${method}_mid_${mod}_post() {}


		set normal() {}

		set pre_${method}() {}

		set ${method}_post() {}

		set pre_${method}_post() {}

		set pre_${method}_mid_${mod}_post() {}


		async normal() {}

		async ${method}() {}

		async pre_${method}() {}

		async ${method}_post() {}

		async pre_${method}_post() {}

		async pre_${method}_mid_${mod}_post() {}


		* normal() {}

		* ${method}() {}

		* pre_${method}() {}

		* ${method}_post() {}

		* pre_${method}_post() {}

		* pre_${method}_mid_${mod}_post() {}


		async* normal() {}

		async* ${method}() {}

		async* pre_${method}() {}

		async* ${method}_post() {}

		async* pre_${method}_post() {}

		async* pre_${method}_mid_${mod}_post() {}
	}
`;


let script = `
	let vegetable = 'carrot';

	\`text\`;
	\`${fruit.name}\`;
	\`\${vegetable}\`;
	\`\\${fruit.color}\`;
	\`\\\${escaped text}\`;

	\`\n\`;  // line-break
	\`\\n\`;  // backslash, "n"
	\`\\\n\`;  // backslash, line-break
	\`\\\\n\`;  // backslash, backslash, "n"
`;

// the exact same string as above, but with js syntax highlighting:
script == /* syntax: js */ `
	let vegetable = 'carrot';

	\`text\`;
	\`${fruit.name}\`;
	\`\${vegetable}\`;
	\`\\${fruit.color}\`;
	\`\\\${escaped text}\`;

	\`\n\`;  // line-break
	\`\\n\`;  // backslash, "n"
	\`\\\n\`;  // backslash, line-break
	\`\\\\n\`;  // backslash, backslash, "n"
`;