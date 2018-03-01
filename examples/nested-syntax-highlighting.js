
/* syntax: bash */ `
	node $SCRIPT | grep '${find}' > out.txt 2>&1 \
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
		b [label="${label}"]
		a -> b [color="${color}"];
	}
`;

/* syntax: js */ `
	console.assert('hello' === '${world}');
`;

/* syntax: sql */ `
	select * from ${table}
	where ${conditions.join(' and ')}
`;

/* syntax: json */ `
	{
		"name": "douglas",
		"score": 42,
		"info": ${JSON.stringify(info)}
	}
`;

/* syntax: html */ `
	<div className="${class_name}">
		<span>content</span>
	</div>
`;

/* syntax: xml */ `
	<asset symbol="ETH" value="${price}">
		Ethereum
	</asset>
`;

/* syntax: yaml */ `
	env: development
`;

// Requires the "OpenGL Shading Language (GLSL)" plugin
/* syntax: glsl */ `
	uniform float time;
	void main() {
		gl_FragColor = vec4((time % ${span}) / ${span});
	}
`;
