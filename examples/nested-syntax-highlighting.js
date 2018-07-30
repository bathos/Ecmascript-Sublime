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

/* syntax: json */ `
	{
		"name": "douglas",
		"score": 42,
		"info": ${JSON.stringify(info)}
	}
`;

// Requires a GLSL language, such as the "OpenGL Shading Language (GLSL)" plugin
/* syntax: glsl */ `
	uniform float time;
	void main() {
		gl_FragColor = vec4((time % ${span}) / ${span});
	}
`;

/* syntax: html */ `
	<div className="${class_name}">
		<span>content</span>
	</div>
	<script type="text/javascript">
		// look, nested Ecmascript!
		if(nested_javascript) {
			for(let i=0; i<set.size(); i++) {
				console.log('${channel}: '+set[i]);
			}
		}
	</script>
`;

/* syntax: md */ `
# README

List of **${category} items** to buy:
${items.map(s => ` - ${s}`).join('\n')}

> Notice: ${notice_message}
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
