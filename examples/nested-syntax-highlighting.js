/* eslint-disable */

/* syntax: bash */ `
	node $SCRIPT | grep '${find? find: '.'}' > out.txt 2>&1 \\
		&& cat out.txt
`;

/* syntax: css */ `
	.window {
		color: rgba(231, 76, 60, ${transparency});
	}
`;

	/* syntax: css.style */ `font-size: ${size}pt`;

/* syntax: dot */ `
	digraph graph_name {
		a [label="apple"];
		b [label="${fruit.label}"]
		a -> b [color="${edge.color}"];
	}
`;

/* syntax: js */ `
	class example extends ${super_class} {
		constructor(input) {
			super(input+'\n');
		}

		get ${property}() {
			return this._${property}.toString();
		}
	}
`;

	/* syntax: js.object-literal */ `
		color: 'yellow',
		taste: ${flavor},
		organic: true,
	`;

	/* syntax: js.value */ `.toString()`;

	/* syntax: js.method */ `
		anonymous() {
			return true;
		}
	`;

	new Regexp(/* syntax: js.regexp */ `(a+b[a-c]){2}`);

/* syntax: json */ `
	{
		"name": "douglas",
		"score": 42,
		"info": ${JSON.stringify(info)}
	}
`;

/* syntax: lua */ `
	local function cleanup()
		for i, v in ipairs(${handler}) do
			pcall(v)
		end

		table.insert(${handler}, f)
	end
`;

// Requires a GLSL language, such as the "OpenGL Shading Language (GLSL)" plugin
/* syntax: glsl */ `
	uniform float time;
	void main() {
		gl_FragColor = vec4((time % ${span}) / ${span});
	}
`;

/* syntax: html */ `
	<style>
		.large {
			font-size: 24pt;
		}
	</style>
	<div className="large ${class_name}">
		<span style="display:${display_format}; font:12pt">
			content
		</span>
	</div>
	<script type="text/javascript">
		// look, nested Ecmascript! its inside a script tag, within an interpolated HTML template literal string
		if(nested_javascript) {
			for(let i=0; i<set.size(); i++) {
				console.log(\`${channel}: \${set[i]}\`);
			}
		}
	</script>
`;

/* syntax: md */ `
# README

List of **${category} items** to buy:
${items.map(s => ` - ${s}`).join('\n')}

> Notice: ${notice_message}

~~~js
All code-fenced blocks in nested markdown are neutered
~~~
`;

/* syntax: sql */ `
	select * from ${table}
	where ${conditions.join(' and ')}
`;

/* syntax: xml */ `
	<asset symbol="ETH" value="${price}">
		Ethereum
	</asset>
`;

/* syntax: yaml */ `
	env: development
	  - label: ${this.label}
	  - debug: true
`;
