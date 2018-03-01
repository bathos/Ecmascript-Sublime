# Ecmascript Sublime Syntax

A sublime-syntax language definition for Ecmascript / Javascript / ES6 / ES2015
/ Babel or what have you.

> Sublime syntax is only available in Sublime Text 3.0.

**New in 1.6**

- Nested syntax highlighting

A common use of mutli-line template literals is to embed snippets of code. For instance, it could be snippets of HTML/CSS in the browser or SQL queries in node.js. For those longer template literals, it may be useful to enable nested syntax highlighting and make snippets of code easier to read. You can enable this by adding a block comment directive before a template literal. The complete syntax for the directive is as follows:

```
/* syntax: {SYNTAX_NAME} */ tag? `contents`
```

Where the `tag` identifier may appear before or after the syntax block comment directive.

One of the perks to using this directive is that nested syntax blocks will inherit their usual functionality from their syntax definition, such as keybindings, snippets, autocompletions, and commenting:

![Nested Syntaxes](https://github.com/bathos/Ecmascript-Sublime/raw/master/examples/nested-syntax-commenting.gif)

**Supported Syntaxes:**
Here's the list of currently supported syntaxes. I just went with all the ones that I assume are reasonable to use in the browser / node.js. Feel free to open an issue if you think another syntax would be useful.

 - `bash` | `shell`
 - `css`
 - `html`
 - `javascript` | `js`
 - `json`
 - `dot` (Graphviz)
 - `glsl` (GLslang for WebGL)
 - `sql`
 - `xml`
 - `yaml`

And here is a demonstration of all the currently supported syntaxes:

![Nested Syntaxes](https://github.com/bathos/Ecmascript-Sublime/raw/master/examples/nested-syntax-highlighting.png)


**New in 1.3**

- Improvements to JSX scopes
- JSX fragment support
- Styled JSX support
- Numeric separators support
- BigInt support
- Regexp features: dotall flag, property escapes, named captures, lookbehinds
- Private instance fields

The Styled JSX additions merit some explanation. Earlier I half-assed this by
delegating to the CSS syntax definition when a JSX element with a template child
met the expected conditions for styled JSX. This doesn’t work well in practice
because of the context sensitivity of the matches in the default CSS syntax
definition — that is, in any position after interpolation, one was apt to get
bad highlighting of the CSS since the it no longer knew if it was in a selector
or a value, etc.

To address this, I added a deliberately forgiving and imprecise, simple ("flat")
CSS matcher that is chiefly concerned with identifying lexical constructs for
this context. It uses a subset of the same scope names as the pre-bundled
sublime CSS definition, but some of the scopes needed to be conflated due to the
lost context awareness. The end result is CSS highlighting for Styled JSX
templates that should be consistent and helpful in the great majority of cases
despite the lost distinctions.

![Styled JSX example](https://github.com/bathos/Ecmascript-Sublime/raw/master/examples/styled-jsx-example.png)

Support for XML-style namespacing (ns colon) in JSX has been removed. It was in
the official grammar, but afaict it is not used in practice and isn’t supported
by Babel’s JSX transform. Instead, scoping for member expression style component
names is improved, and html (lowercase / possible hyphens) names are scoped
distinctly from component references (pascalcase / es identifier).

JSX fragments are a new way to indicate unkeyed groups of sibling nodes without
the need for extraneous divs: `<>stuff</>`.

The numeric separators proposal, which permits underscores within numeric
literals in most positions for improved readability of (mainly) hex and binary
notated numbers recently advanced to stage 3.

The BigInt proposal did as well. This is a new numeric type which is represented
syntactically by the suffixing "n" to a numeric literal.

The new RegExp features at stage 3 are the dotall ("s") flag, Unicode property
character class escapes, named capture groups and named capture backreferences,
and positive and negative lookbehind assertions.

Private instance fields (prefixed with '#') are included, with the caveat that
for practical reasons our definition can’t recognize most situations where a
reference to such a property would be illegal.

Although not very thorough, some color schemes have been updated a bit to
take advantage of the new scopes. (Always looking to add better color schemes
if anybody has stuff to contribute!)

**New in 1.1**

- Most currently-stage-3 proposals (likely ES2018) and some stage 2 now covered.
- Added new theme, Haydn

![Haydn example](https://github.com/bathos/Ecmascript-Sublime/raw/master/examples/haydn-example.png)

**New in 1.0**

 - Highlighting for merge conflict markers (cannot be perfect by its nature, but
   better than nothing)
 - New theme, Sibelius, which is probably the first tasteful one. Between that
   and the fact that this has been around for a year, bugs seem under control,
   and a fair number of people are using this, I figured I should do '1.0'.

![Sibelius example](https://github.com/bathos/Ecmascript-Sublime/raw/master/examples/sibelius.png)

**New in 0.3**

 - JSX support
 - Adds source.js at root to increase compatibility with other packages

![JSX example](https://github.com/bathos/Ecmascript-Sublime/raw/master/examples/example-jsx.png)

**New in 0.2**

 - ‘Villa-Lobos’ theme
 - Async functions/methods/arrows are fully scoped the way generators are
 - <strike>Promise and its methods are uniquely scoped</strike>
 - Added ‘todo’ scope per http://www.sublimetext.com/forum/viewtopic.php?f=2&t=18882
 - Various minor fixes, like allowing multiple spreads in an array literal

<!-- MarkdownTOC autolink=true bracket=round -->

- [Remaining Work](#remaining-work)
- [Why Bother](#why-bother)
- [Feature Coverage](#feature-coverage)
- [SublimeText Symbols](#sublimetext-symbols)
- [Themes](#themes)
- [Scopes](#scopes)
  - [‘Official’ Scopes](#%E2%80%98official%E2%80%99-scopes)
  - [Symbol Helper Scopes](#symbol-helper-scopes)
  - [Interoperability Scopes](#interoperability-scopes)
  - [Nested Syntax Scopes](#nested-syntax-scopes)
- [About the Scope Conventions](#about-the-scope-conventions)
- [More Infobarf for Someone Hypothetically Curious About the Definition Itself](#more-infobarf-for-someone-hypothetically-curious-about-the-definition-itself)
  - [Why Is It Huge?](#why-is-it-huge)
  - [Why Does Almost Everything Related to Expressions Appear Twice?](#why-does-almost-everything-related-to-expressions-appear-twice)
  - [Does a Byzantine Maze of Context Transitions Make Highlighting Slow?](#does-a-byzantine-maze-of-context-transitions-make-highlighting-slow)
  - [How Do I Break It?](#how-do-i-break-it)

<!-- /MarkdownTOC -->

## Remaining Work

 - I’d like to provide more themes with the definition package itself. The first
   of these is ‘Excelsior,’ a kind of tacky attempt to demonstrate what can be
   done that I’ve grown very fond of as it matured. It’s (mostly) complete now.
   Still, it’s probably a bit much for many users.
 - The chunk of comment-delimited code starting at `assignmentExpression_NO_IN`
   is actually possible to generate as a build step. Doing so will reduce the
   chances of accidentally editing `assignmentExpression` without making the
   corresponding change in `assignmentExpression_NO_IN`. I’m not sure if this
   is worthwhile yet but it’s rolling around in my head.
 - A lot of the redundant-looking contexts exist for good reasons -- but not all
   of them. There should be a clean-up and consolidation phase for contexts,
   but more importantly, for patterns (or more often, pattern components).

## Why Bother

There are at least three tmLanguage syntax definitions available for Javascript
right now, and two support ES6+: JSNext and Babel Sublime (which I think is a
fork of the former). Since they’re actually great already, I should explain what
the point of this fourth one is.

Sublime syntax is a brand new YAML syntax definition system that was introduced
in Sublime Text dev build 3084 in April of 2015. Previously the only definition
system Sublime supported was tmLanguage, originally from TextMate. In addition
to cutting out the common build step of YAML -> heinous XML, Sublime syntax
introduced a ‘context’ system for controlling what kinds of matches could take
place at a given juncture.

Contexts exist in a FILO stack. They can be pushed, popped, or ‘set’ (pop-push).
As in tmLanguage, matching cannot look past the current line, but using contexts
bypasses some of the old consequences of that constraint, allowing more advanced
and accurate scope assignment.

The number one reason why I made this is that it bothered me that many disparate
elements of the grammar that just happened to look similar had to share generic
scopes like `meta.brace.curly`. Thanks to Sublime syntax, Ecmascript Sublime
doesn’t have to have scopes that describe what something *looks* like. In the
case of braces, instead you will find scopes for block statements, object
literals, object binding patterns, class and function bodies, namespace imports,
etc -- the things that the braces mean.

It goes a bit beyond that, too. If you like, you can color if statements
differently from loop statements for example. Generators, methods, and accessors
are also individuated. In fact there are far more very specific scopes available
than anyone would ever reasonably use, but the point is to allow the theme
designer to choose exactly which elements share colors (most good themes seem to
have relatively small palettes, really).

However there are good reasons one might prefer one of the other choices for
syntax highlighting. For one, maybe you like a theme that plays better with one
of the others. There are also differences with the approaches taken that may
or may not suit your style. And finally, Ecmascript Sublime is a lot more rigid
by nature, so invalid token sequences will not often pass unnoticed -- you may
find this useful, or you may find it bothersome.

Here’s an early shot of Excelsior. I should add an updated one soon:

![Early Excelsior example](https://github.com/bathos/Ecmascript-Sublime/raw/master/examples/example-okay.png)

And here’s an example I’m fond of, using background colors to indicate the depth
of matching groups in a regular expression:

![Excelsior regex example](https://github.com/bathos/Ecmascript-Sublime/raw/master/examples/example-regex.png)

## Feature Coverage

In addition to everything in the final draft of ES6, I’ve included support for
certain ES7 strawmen that have already been implemented in Babel or Firefox. The
depth is not always as great as with established language features, though.

The following proposed features, as they stand today anyway, are covered:

 - generator & array comprehensions (should probably remove at some point)
 - class and method decorators
 - object literal spread and object binding pattern rest
 - bind operator
 - do expression
 - async iteration (for-async & async generators)
 - optional catch binding
 - dynamic import & import.meta
 - function.sent
 - class fields
 - export extensions

In addition to ES and some proposed ES, JSX is supported.

## SublimeText Symbols

A Sublime syntax definition involves more than the definition proper. These
other items use the tmPreferences format to describe how automatic indentation
works, as well as how the "symbol list" is populated.

If you haven’t used Sublime symbol navigation before, I recommend checking it
out. It’s a quick way to navigate the local file or all open files by keyboard
shortcut (local is ctrl+r, global is shift+ctrl+r).

In Ecmascript Sublime, function, generator and class declarations will show up
in Sublime’s symbol list, as well as default exports. It will also pick up
function, generator, and class expressions that either have names or are
directly assigned as part of a var, let or const statement. In this last case
it will display the name of the variable the expression was bound to, and this
can include arrow functions.

Note that only expressions that appear as the initializer in a variable or
constant declaration will be added to the list, so `const x = () => {}` is added
as ‘arrow x,’ but `x = () => {}` is not.

All of these are local-only except classes. If people want the others to be
global (except default exports obviously), we can change that. This is what made
sense to me, but I pretty much only ever use the local list myself so I wasn’t
sure what habitual global users would like to see.

## Themes

At present there are four:

 - Carthage (eh)
 - Excelsior (most elaborate; I love it, but it’s too much)
 - Sibelius (most sane)
 - Villa-Lobos (okay)

As of version 0.1.2, I’ve also added many additional scopes and tweaked a number
of things to increase interoperability with existing themes. Monokai, Cobalt,
and Brogrammer were my reference themes; the goal was to make them match as
closely as is reasonable to how they look when using Babel Sublime. There’s a
handful of things that cannot be made to match because of what I guess could be
called philosophical differences, but it should now be possible to use
Ecmascript Sublime with just about any theme without cringing.

I should note, there is another theme included with the package. It isn’t a real
theme though -- it assigns random colors to hundreds of scopes. It is useful for
referencing when designing themes but you’d be insane to actually use it.

If you’re interested in adding support for Ecmascript Sublime to your theme, or
are developing a new theme with this in mind, you’ll probably want a list of
the targetable scopes...

## Scopes

It goes without saying that only a minority of these will be truly useful to
most themers; on the other hand, you get to decide which those are.

### ‘Official’ Scopes

These are the scopes generally intended for targeting. For readability, I’ve
omitted the ‘.es’ suffix as well as ‘.begin.es’ and ‘.end.es’ for various
punctuation, as these are only useful for debugging. Note that the scopes ending
in ‘.regexp’ do not also have ‘.es’.

- **Comments & Directives**
  - `comment`
  - `comment.block`
  - `comment.line`
  - `comment.line.shebang` (e.g. `#!/usr/bin/env node`)
  - `comment.line.todo` (matches the words 'todo' and 'hack' within comments)
  - `meta.comment.body` (content that is not part of the delimiter(s) or border)
  - `meta.comment.border` (includes anything that seems like a border, and `//`)
  - `meta.comment.box-drawing` (box drawing characters can be targeted)
  - `meta.directive.use-strict` (the `'use strict'` directive)
  - `punctuation.definition.comment` (the delimiting `//`, `/*` or `*/`)
- **Comprehensions**
  - `keyword.control.loop.conditional.if.comprehension.array`
  - `keyword.control.loop.conditional.if.comprehension.generator`
  - `keyword.control.loop.for.comprehension.array`
  - `keyword.control.loop.for.comprehension.generator`
  - `keyword.control.loop.of.comprehension.array`
  - `keyword.control.loop.of.comprehension.generator`
  - `punctuation.definition.comprehension.array`
  - `punctuation.definition.comprehension.generator`
  - `punctuation.definition.expression.conditional.comprehension.array`
  - `punctuation.definition.expression.conditional.comprehension.generator`
  - `punctuation.definition.expression.loop.comprehension.array`
  - `punctuation.definition.expression.loop.comprehension.generator`
- **Constants & Literals**
  - **General**
    - `constant`
    - `constant.language`
    - `constant.language.boolean`
    - `constant.language.boolean.false`
    - `constant.language.boolean.true`
    - `constant.language.null`
    - `constant.language.undefined`
  - **Arrays**
    - `punctuation.definition.array`
    - `punctuation.separator.array-element`
  - **Numbers**
    - `constant.language.infinity`
    - `constant.language.nan`
    - `constant.numeric`
    - `constant.numeric.binary`
    - `constant.numeric.decimal`
    - `constant.numeric.hexadecimal`
    - `constant.numeric.octal`
    - `meta.numeric.exponent.digit`
    - `meta.numeric.exponent.e`
    - `meta.numeric.exponent.sign`
    - `meta.numeric.prefix` (0x, 0b, 0o)
    - `meta.numeric.suffix` ('n' of BigInt; may expand in the future)
    - `punctuation.decimal`
  - **Objects**
    - `punctuation.definition.object` (the braces in `let x = { a: 1 };`)
    - `punctuation.separator.key-value` (the colon in `let x = { a: 1 };` and the equals sign in the class properties proposal)
    - `punctuation.separator.object-member` (commas between properties)
    - `variable.other.readwrite.property.object-literal`
    - `variable.other.readwrite.property.object-literal.allCap`
    - `variable.other.readwrite.property.object-literal.initCap`
    - `variable.other.readwrite.property.shorthand`
    - `variable.other.readwrite.property.shorthand.allCap`
    - `variable.other.readwrite.property.shorthand.initCap`
    - `variable.other.readwrite.property.shorthand.rest`
    - `variable.other.readwrite.property.shorthand.rest.allCap`
    - `variable.other.readwrite.property.shorthand.rest.initCap`
    - *see also Functions for accessors and methods*
  - **Regexp**
    - `constant.character.escape.control-char.regexp`
    - `constant.character.escape.hexadecimal.regexp`
    - `constant.character.escape.null.regexp`
    - `constant.character.escape.pointless.regexp`
    - `constant.character.escape.regexp`
    - `constant.character.escape.unicode.regexp`
    - `constant.other.character-class.predefined.regexp`
    - `constant.other.character-class.set.regexp`
    - `constant.other.character-class.unicode-property-name.regexp`
    - `constant.other.character-class.unicode-property-value.regexp`
    - `keyword.control.anchor.regexp`
    - `keyword.operator.negation.regexp`
    - `keyword.operator.or.regexp`
    - `keyword.operator.quantifier.regexp`
    - `keyword.other.back-reference.regexp`
    - `meta.group.assertion.negative.regexp`
    - `meta.group.assertion.positive.regexp`
    - `meta.group.capturing.regexp`
    - `meta.group.non-capturing.regexp`
    - `meta.character-property.regexp`
    - `punctuation.definition.assertion.negative.regexp`
    - `punctuation.definition.assertion.positive.regexp`
    - `punctuation.definition.character-class.dash.regexp`
    - `punctuation.definition.character-class.regexp`
    - `punctuation.definition.character-property.regexp`
    - `punctuation.definition.string.regexp`
    - `punctuation.definition.group.capturing.regexp`
    - `punctuation.definition.group.non-capturing.regexp`
    - `punctuation.separator.character-property-name-value.regexp`
    - `string.regexp`
    - `string.regexp.flags`
    - `variable.other.named-capture.regexp`
  - **Strings**
    - `constant.character`
    - `constant.character.escape`
    - `constant.character.escape.hexadecimal` (e.g. `'\\x41'`)
    - `constant.character.escape.newline` (a terminal backslash)
    - `constant.character.escape.null` (i.e. `'\\0'`)
    - `constant.character.escape.pointless` (an escape that is not needed)
    - `constant.character.escape.unicode` (e.g. `'\\u0041'` or `'\\u{41}'`)
    - `punctuation.definition.string`
    - `punctuation.definition.string.interpolated`
    - `punctuation.definition.string.interpolated.element`
    - `punctuation.definition.string.quoted`
    - `punctuation.definition.string.quoted.double`
    - `punctuation.definition.string.quoted.double.parameter`
    - `punctuation.definition.string.quoted.single`
    - `punctuation.definition.string.quoted.single.parameter`
    - `string`
    - `string.interpolated`
    - `string.quoted`
    - `string.quoted.double`
    - `string.quoted.single`
- **Functions & Function-Related**
  - **General**
    - **Parameters**
      - `entity.other.property-binding.parameter`
      - `keyword.other.rest.parameter`
      - `keyword.other.rest`
      - `punctuation.definition.binding.array.parameter`
      - `punctuation.definition.binding.object.parameter`
      - `punctuation.separator.array-element.binding.parameter`
      - `punctuation.separator.object-member.binding.parameter`
      - `punctuation.separator.parameter`
      - `punctuation.separator.property-binding.parameter`
      - `variable.parameter`
      - `variable.parameter.rest`
    - **Execution & Do Expressions**
      - `keyword.control.do-expression.do` (the keyword from ES7, not the loop)
      - `meta.instantiation` (applied to identifier being instantiated)
      - `meta.invocation` (applied to identifier being invoked)
      - `punctuation.definition.arguments` (parens in invocation/instantiation)
      - `punctuation.definition.block.do-expression` (braces in `do` expression)
      - `punctuation.separator.argument` (comma in arguments)
      - `variable.other.readwrite.tag` (foo in <code>foo&grave;str${ exp }&grave;</code>)
  - **Types**
    - **Accessors**
      - `entity.name.accessor.get` (name of accessor)
      - `entity.name.accessor.set` (name of accessor)
      - `keyword.control.flow.return.accessor` (not sure why I gave it its own)
      - `punctuation.definition.accessor`
      - `punctuation.definition.accessor.body` (braces)
      - `punctuation.definition.accessor.parameter` (the param id in a `set`)
      - `punctuation.definition.parameters.accessor` (parens)
      - `storage.modifier.accessor.get` (keyword `get`)
      - `storage.modifier.accessor.set` (keyword `set`)
    - **Async Functions**
      - `entity.name.method.async` (name of async function)
      - `entity.name.function.async`
      - `entity.name.function.async.arrow`
      - `keyword.control.flow.await` (keyword `await`)
      - `punctuation.definition.function.async`
      - `punctuation.definition.function.async.arrow`
      - `punctuation.definition.function.async.arrow.body`
      - `punctuation.definition.function.async.body`
      - `punctuation.definition.method.async.body`
      - `punctuation.definition.parameters.function.async`
      - `punctuation.definition.parameters.function.async.arrow`
      - `punctuation.definition.parameters.method.async`
      - `storage.modifier.async` (keyword `async`, general)
      - `storage.modifier.async.expression` (keyword `async`, in expression)
      - `storage.modifier.async.method` (keyword `async`, in method declaration)
    - **Classes**
      - `entity.name.class`
      - `entity.name.constructor`
      - `meta.super-expression`
      - `punctuation.definition.class.body`
      - `punctuation.definition.constructor.body`
      - `punctuation.definition.decorator`
      - `punctuation.definition.parameters.constructor`
      - `punctuation.terminator.property` (es7? class property semicolon)
      - `storage.modifier.extends`
      - `storage.modifier.static`
      - `storage.type.class`
      - `storage.type.class.expression`
      - `variable.other.readwrite.property.class.es` (es7? class property key)
      - `variable.language.private`
      - `variable.language.private.class`
    - **Functions**
      - `entity.name.function`
      - `entity.name.function.arrow`
      - `entity.name.function.allCap`
      - `entity.name.function.initCap`
      - `entity.name.method`
      - `keyword.control.flow.return`
      - `punctuation.definition.function`
      - `punctuation.definition.function.arrow.body`
      - `punctuation.definition.function.body`
      - `punctuation.definition.method`
      - `punctuation.definition.method.body`
      - `punctuation.definition.parameters`
      - `punctuation.definition.parameters.function`
      - `punctuation.definition.parameters.function.arrow`
      - `punctuation.definition.parameters.method`
      - `storage.type.function.arrow`
      - `storage.type.function.async`
      - `storage.type.function.async.arrow`
      - `storage.type.function.async.expression`
      - `storage.type.function`
      - `storage.type.function.expression`
    - **Generators**
      - `entity.name.function.generator`
      - `entity.name.method.generator`
      - `keyword.control.flow.yield.iterate`
      - `keyword.control.flow.yield`
      - `punctuation.definition.generator`
      - `punctuation.definition.generator.body`
      - `punctuation.definition.method.generator`
      - `punctuation.definition.method.generator.body`
      - `punctuation.definition.parameters.generator`
      - `punctuation.definition.parameters.method.generator`
      - `storage.modifier.generator.asterisk`
      - `storage.modifier.generator.asterisk.expression`
      - `storage.modifier.generator.asterisk.method`
      - `storage.type.function.generator`
      - `storage.type.function.generator.expression`
- **Operators**
  - **Assignment**
    - **General**
      - `keyword.operator.assignment`
      - `keyword.operator.assignment.conditional`
      - `keyword.operator.assignment.conditional.default` (default initializer)
      - `keyword.operator.assignment.conditional.mallet` (`||=` -- used to be in Babel)
      - `keyword.operator.unary.delete`
    - **Augmented**
      - `keyword.operator.assignment.augmented`
      - `keyword.operator.assignment.augmented.arithmetic`
      - `keyword.operator.assignment.augmented.arithmetic.addition`
      - `keyword.operator.assignment.augmented.arithmetic.division`
      - `keyword.operator.assignment.augmented.arithmetic.exponentiation`
      - `keyword.operator.assignment.augmented.arithmetic.modulo`
      - `keyword.operator.assignment.augmented.arithmetic.multiplication`
      - `keyword.operator.assignment.augmented.arithmetic.subtraction`
      - `keyword.operator.assignment.augmented.bitwise`
      - `keyword.operator.assignment.augmented.bitwise.logical`
      - `keyword.operator.assignment.augmented.bitwise.logical.and`
      - `keyword.operator.assignment.augmented.bitwise.logical.or`
      - `keyword.operator.assignment.augmented.bitwise.logical.xor`
      - `keyword.operator.assignment.augmented.bitwise.shift`
      - `keyword.operator.assignment.augmented.bitwise.shift.left`
      - `keyword.operator.assignment.augmented.bitwise.shift.right`
      - `keyword.operator.assignment.augmented.bitwise.shift.right.unsigned`
  - **Bitwise**
    - `keyword.operator.bitwise`
    - `keyword.operator.bitwise.logical`
    - `keyword.operator.bitwise.logical.and`
    - `keyword.operator.bitwise.logical.not`
    - `keyword.operator.bitwise.logical.or`
    - `keyword.operator.bitwise.logical.xor`
    - `keyword.operator.bitwise.shift`
    - `keyword.operator.bitwise.shift.left`
    - `keyword.operator.bitwise.shift.right`
    - `keyword.operator.bitwise.shift.right.unsigned`
  - **Comparison**
    - `keyword.operator.comparison`
    - `keyword.operator.comparison.equality`
    - `keyword.operator.comparison.equality.coercive`
    - `keyword.operator.comparison.equality.strict`
    - `keyword.operator.comparison.non-equality`
    - `keyword.operator.comparison.non-equality.coercive`
    - `keyword.operator.comparison.non-equality.strict`
    - `keyword.operator.relational`
    - `keyword.operator.relational.gt`
    - `keyword.operator.relational.gte`
    - `keyword.operator.relational.in`
    - `keyword.operator.relational.instanceof`
    - `keyword.operator.relational.lt`
    - `keyword.operator.relational.lte`
  - **Evaluative**
    - `keyword.operator.accessor`
    - `keyword.operator.bind`
    - `keyword.operator.comma`
    - `keyword.operator.new`
    - `keyword.operator.spread`
    - `keyword.operator.ternary`
    - `keyword.operator.ternary.else`
    - `keyword.operator.ternary.if`
    - `keyword.operator.unary`
    - `keyword.operator.unary.typeof`
    - `keyword.operator.unary.void`
  - **Logical**
    - `keyword.operator.logical`
    - `keyword.operator.logical.and`
    - `keyword.operator.logical.not`
    - `keyword.operator.logical.or`
    - `meta.idiomatic-cast.boolean` (i.e. `!!val`)
  - **Mathematic**
    - `keyword.operator.arithmetic`
    - `keyword.operator.arithmetic.addition`
    - `keyword.operator.arithmetic.decrement`
    - `keyword.operator.arithmetic.decrement.postfix`
    - `keyword.operator.arithmetic.decrement.prefix`
    - `keyword.operator.arithmetic.division`
    - `keyword.operator.arithmetic.exponentiation`
    - `keyword.operator.arithmetic.increment`
    - `keyword.operator.arithmetic.increment.postfix`
    - `keyword.operator.arithmetic.increment.prefix`
    - `keyword.operator.arithmetic.modulo`
    - `keyword.operator.arithmetic.multiplication`
    - `keyword.operator.arithmetic.sign`
    - `keyword.operator.arithmetic.sign.negative`
    - `keyword.operator.arithmetic.sign.positive`
    - `keyword.operator.arithmetic.subtraction`
- **Statements**
  - **General**
    - `entity.name.statement` (statement label)
    - `keyword.control.flow.break`
    - `keyword.control.flow.throw`
    - `punctuation.definition.block` (braces of any block statement)
    - `punctuation.separator.label-statement` (statement label colon)
    - `punctuation.terminator.statement` (terminal semicolon or empty statement)
  - **Conditional Statements**
    - `keyword.control.conditional`
    - `keyword.control.conditional.else`
    - `keyword.control.conditional.if`
    - `keyword.control.switch` (the switch keyword)
    - `keyword.control.switch.case` (the case keyword)
    - `keyword.control.switch.case.default` (the default keyword, in a switch)
    - `punctuation.definition.block.conditional` (braces for `if` or `else`)
    - `punctuation.definition.block.switch` (braces for `switch`)
    - `punctuation.definition.expression.conditional` (parens for `if`)
    - `punctuation.definition.expression.switch` (parens for `switch`)
    - `punctuation.separator.case-statements` (colon after `case` or `default`)
  - **Loop Statements**
    - `keyword.control.flow.continue`
    - `keyword.control.flow.loop`
    - `keyword.control.loop.do`
    - `keyword.control.loop.each` (deprecated)
    - `keyword.control.loop.for`
    - `keyword.control.loop.in`
    - `keyword.control.loop.of`
    - `keyword.control.loop.while`
    - `punctuation.definition.block.loop` (braces in `while (x) {...}`)
    - `punctuation.definition.expression.loop` (parens in ``while (x) {...}``)
    - `punctuation.separator.loop-expression` (semicolons in a C-style `for`)
  - **Try Statements**
    - `keyword.control.trycatch`
    - `keyword.control.trycatch.catch`
    - `keyword.control.trycatch.finally`
    - `keyword.control.trycatch.try`
    - `punctuation.definition.block.trycatch` (braces in all three)
    - `punctuation.definition.parameters.catch` (parens in `catch (err)`)
    - `variable.parameter.catch` (err in `catch (err)`)
  - **Module Statements**
    - `entity.name.module.export`
    - `entity.name.module.import`
    - `punctuation.definition.module-binding` (braces in `import { x, y } from 'z'`)
    - `punctuation.separator.module-binding` (comma in `import { x, y } from 'z'`)
    - `storage.modifier.module.as`
    - `storage.modifier.module.default`
    - `storage.modifier.module.from`
    - `storage.modifier.module.namespace` (the asterisk in `import * from z`)
    - `storage.type.module.export`
    - `storage.type.module.import`
    - `variable.other.readwrite.export`
    - `variable.other.readwrite.import`
  - **Nonsense**
    - `keyword.control.with` (deprecated)
    - `keyword.other.debugger` (deprecated)
    - `punctuation.definition.block.with` (deprecated)
    - `punctuation.definition.expression.with` (deprecated)
- **Variables & Constants**
  - **Declarations**
    - `storage.type.constant`
    - `storage.type.variable.let`
    - `storage.type.variable.var`
  - **Binding Patterns (Destructuring)**
    - `entity.other.property-binding` (y in `let { y: z } = x`)
    - `punctuation.definition.binding`
    - `punctuation.definition.binding.array`
    - `punctuation.definition.binding.object`
    - `punctuation.separator.array-element.binding` (comma in array binding)
    - `punctuation.separator.binding-binding` (the comma here: `let x, y`)
    - `punctuation.separator.object-member.binding` (commas in object patterns)
    - `punctuation.separator.property-binding` (colon in `let { y: z } = x`)
    - *see also Functions for binding patterns in parameter declarations*
- **Identifiers**
  - **General**
    - `variable.other.readwrite`
    - `variable.other.readwrite.allCap`
    - `variable.other.readwrite.initCap`
    - `variable.other.readwrite.property`
    - `variable.other.readwrite.property.allCap`
    - `variable.other.readwrite.property.initCap`
  - **Contextual References & Pseudo-References**
    - `variable.language.arguments`
    - `variable.language.function-sent` (proposed generator initial next arg)
    - `variable.language.import-dynamic`
    - `variable.language.import-meta`
    - `variable.language.new-target.fake-accessor` (the dot in `new.target`)
    - `variable.language.new-target.fake-object` (the new in `new.target`)
    - `variable.language.new-target.fake-property` (the target in `new.target`)
    - `variable.language.super`
    - `variable.language.this`
  - **Special Properties**
    - `variable.other.readwrite.property.proto` (i.e., `x.__proto__`; a certified Bad Part)
    - `variable.other.readwrite.property.prototype` (i.e. `X.prototype`)
  - **Native (& Nearly Native) Objects**
    - `support.class.builtin` (e.g. `Array`)
    - `support.function.builtin` (e.g. `parseInt`)
    - `support.variable.builtin` (e.g. `Math`)
  - **Domain-Specific Objects**
    - `support.class.node` (that is, `Buffer`)
    - `support.variable.node.module` (module & exports environmental vars)
    - `support.function.node.require`
    - `support.variable.dom` (e.g. `document`; kept this list minimal though)
    - `support.variable.dom-library` (e.g. `$`)
    - `support.variable.functional-library` (e.g. `_`)
    - `support.variable.node` (e.g. `process`)
- **JSX**
  - `entity.name.tag.jsx` (html element name)
  - `keyword.operator.accessor.jsx` (access dot in ‘namespaced’ element name)
  - `keyword.operator.spread.jsx` (spread operator in attribute interpolation)
  - `meta.interpolation.jsx` (covers interpolated sequences)
  - `meta.namespace.jsx` (prefix sequence in component member expression)
  - `punctuation.definition.attribute.begin.jsx` (single or double quotes)
  - `punctuation.definition.attribute.end.jsx`
  - `punctuation.definition.interpolation.begin.jsx` (curly braces)
  - `punctuation.definition.interpolation.end.jsx`
  - `punctuation.definition.tag.begin.jsx` (element tag delimiter)
  - `punctuation.definition.tag.end.jsx`
  - `punctuation.definition.tag.fragment.begin.jsx`
  - `punctuation.definition.tag.fragment.end.jsx`
  - `punctuation.separator.attribute-value.jsx` (equals sign)
  - `string.attribute.jsx` (literal attribute value)
  - `string.text.jsx` (literal chardata)
  - `variable.other.entity-reference.jsx` (html/xml entity refs)
  - `variable.other.attribute.jsx` (attribute name)
- **Styled JSX (from Sublime’s CSS syntax)**
  - `comment.block.css`
  - `constant.numeric.css`
  - `entity.other.attribute-name.class.css`
  - `entity.other.attribute-name.id.css`
  - `entity.other.pseudo-class.css`
  - `entity.other.pseudo-element.css`
  - `keyword.control.at-rule.css`
  - `keyword.operator.attribute-selector.css`
  - `keyword.other.unit.css`
  - `meta.function-call.css`
  - `meta.property-name.css`
  - `meta.property-value.css` (actually inclusive of many other items)
  - `meta.styled-jsx.global.jsx`
  - `punctuation.definition.comment.css`
  - `punctuation.section.property-list.css`
  - `punctuation.separator.combinator.css` (inclusive of calc operators, etc)
  - `punctuation.separator.key-value.css`
  - `punctuation.terminator.rule.css`
  - `source.css`
  - `string.quoted.css`
  - `string.unquoted.css`
  - `support.type.custom-property.name.css`
- **Other**
  - `invalid`
  - `invalid.deprecated` (e.g. `with`)
  - `invalid.illegal.newline` (e.g., inside a single-quote string)
  - `invalid.illegal.octal-escape` (e.g. `'\\101'`; not valid since ES3)
  - `invalid.illegal.token` (syntax error)
  - `invalid.merge-conflict`
  - `invalid.merge-conflict.delimiter` (e.g. `'<<<<<<< HEAD'`)
  - `meta.whitespace`
  - `punctuation.definition.expression` (parentheses of a parenthetic expression)
  - `variable.other.readwrite.decorator` (if a decorator expression begins with an identifier, as is typical, it will have this scope applied)

### Symbol Helper Scopes

These scopes are used to facilitate proper population of the symbol list.

 - `meta.symbol-helper.arrow.es`
 - `meta.symbol-helper.class.es`
 - `meta.symbol-helper.function.es`
 - `meta.symbol-helper.generator.es`

### Interoperability Scopes

These scopes exist alongside others above to maximize interoperability with
existing themes, especially those targetting JSNext and Babel Sublime.

 - `constant.other.object.key.js`
 - `entity.name.class.js`
 - `entity.name.function.js`
 - `entity.name.method.js`
 - `entity.name.tag.js`
 - `entity.name.type.new`
 - `entity.quasi.element.js`
 - `entity.quasi.tag.name.js`
 - `keyword.generator.asterisk.js`
 - `keyword.operator.module.js`
 - `keyword.other.js`
 - `meta.brace.curly.js`
 - `meta.brace.round.js`
 - `meta.brace.square.js`
 - `meta.delimiter.comma.js`
 - `meta.function-call`
 - `meta.function.arrow.js`
 - `meta.function.js`
 - `meta.instance.constructor`
 - `meta.separator.comma.js`
 - `punctuation.definition.tag.js`
 - `punctuation.quasi.element.begin.js`
 - `punctuation.quasi.element.end.js`
 - `storage.type.accessor.js`
 - `storage.type.extends.js`
 - `storage.type.function.js`
 - `storage.type.js`
 - `string.regexp.js`
 - `string.unquoted.label.js`
 - `variable.language.proto`
 - `variable.language.prototype`


### Nested Syntax Scopes

These scopes are for the contents of template strings that have a syntax directive, and are suffixed by the short name of their syntax.

 - `meta.interpolation.syntax.css`
 - `meta.interpolation.syntax.html`
 - `meta.interpolation.syntax.js`
 - `meta.interpolation.syntax.json`
 - `meta.interpolation.syntax.dot`
 - `meta.interpolation.syntax.glsl`
 - `meta.interpolation.syntax.shell`
 - `meta.interpolation.syntax.sql`
 - `meta.interpolation.syntax.xml`
 - `meta.interpolation.syntax.yaml`

## About the Scope Conventions

I’ve used existing tmLanguage conventions, plus JSNext and Babel Sublime, as
guides for scope naming. Nonetheless there’s a fair amount of divergence. Some
of this is just the consequence of disambiguating previously conflated elements.

In a few cases, the original Sublime JS tmLanguage had errors, and Babel and
JSNext preserved them. I chose to correct these at the risk of decreasing
compatibility with existing themes. For example, ‘with’ is not an operator. But
there aren’t many of these and they are usually minor things that won’t affect
most themes.

Sometimes I opted to use a pre-existing tmLanguage convention over a domain-
specific choice. For example, Babel uses `quasi` but many tmLanguages and themes
already target `string.interpolated`. In cases like this I typically ‘double
scope’ the tokens so that they can be targetted either way.

Other divergences stem from the objective of the definition, which may differ a
bit. I wanted the scopes to be very reflective of the language’s grammar. For
example, `entity.name.function` will appear in a function declaration, but it
won’t appear in function invocations; to Ecmascript Sublime, in that context
what you’re looking at is an identifier (which has a scope) and an invocation
(which also has a scope), but not an entity name.

Many of the new scopes concern punctuation. The `punctuation.definition` scope
namespace is the existing convention for these things. So for if statements, for
example, you have the following to work with:

 - `keyword.control.conditional.else`
 - `keyword.control.conditional.if`
 - `punctuation.definition.block.conditional.begin`
 - `punctuation.definition.block.conditional.end`
 - `punctuation.definition.expression.conditional.begin`
 - `punctuation.definition.expression.conditional.end`

One would probably never have a reason to include ‘begin’ or ‘end’ but this kind
of trailing specificity helps sometimes with debugging and in any case is an
existing convention. Scopes are hierarchical selectors, so if you wanted to have
one color for the whole statement, the definition in your YAML-tmTheme could
look like this:

    - name: If / else statements
      scope: >-
        keyword.control.conditional,
        punctuation.definition.block.conditional,
        punctuation.definition.expression.conditional
      settings:
        foreground: '#FF0000'

If you’re new to theming, make sure you grab
[AAAPackageDev](https://packagecontrol.io/packages/AAAPackageDev) and
[ScopeAlways](https://packagecontrol.io/packages/ScopeAlways) from
Package Control. The former will let you translate human-readable YAML into
tmTheme XML, and the latter will show, in the status bar, what scopes are being
applied where your cursor is.

## More Infobarf for Someone Hypothetically Curious About the Definition Itself

### Why Is It Huge?

If you’re poking around in there you might think it’s insane to have so many
redundant components. In many cases, similar results could be achieved using
meta_scopes on a deeper context stack, since multiple scopes can appear in a
selector.

To keep it brief...ish: this very un-DRY approach was the arrived at after a lot
of experimenting. Sublime syntax is powerful, but I might be trying to do some
stuff that wasn’t anticipated. Taking a very ‘grammatical’ approach (in fact I
worked right off the ES6 final draft) is what lets us have all the new &
disambiguated scopes to work with, but the price paid for syntactic precision is
the need to pay special attention to failing as gracefully as possible when
facing a bad token.

There are a few techniques I’ve found to prevent or mitigate ‘bad input
cascade,’ and the most important is keeping the context stack as shallow as is
reasonable at any given time -- that is, preferring linear over vertical context
transitions. This is what necessitates the repetition.

That said there certainly are places where we could merge things, especially by
making tertiary contexts that exist only as includes for building others which
are actually visited.

If it ever becomes possible to pop multiple contexts, like you can set multiple
contexts, we could probably cut the complexity and repetitiveness of the
definition by a ton.

The other main technique for preventing cascade effects is to handle some of the
illegal cases explicitly. There’s quite a bit of this ‘handmade’ correction
actually. Since we know what kind of things are likely to be temporary artifacts
of someone being midway through typing something that will soon be valid, we can
mark a single bad token invalid but then still transition to what we are pretty
sure should be next. With time I plan to add more of this sort of thing, but I
only discover good places for it with use.

### Why Does Almost Everything Related to Expressions Appear Twice?

I was absolutely determined to disambiguate ‘in’ (operator) from ‘in’ (control
word). As far as I can tell, this is the only way we can achieve that. This idea
is actually present in the formal grammar definition, too; I didn’t make it up
myself.

### Does a Byzantine Maze of Context Transitions Make Highlighting Slow?

Surprisingly, no. Well, I haven’t noticed a problem anyway. I don’t know about
the inner workings of Sublime Text, but if you think about it, if regex matches
are the most expensive part, then sublime syntax with atomic contexts is
probably efficient: each context will only try matching things that are actually
expected to appear there.

### How Do I Break It?

Wacky linebreaks! Actually it can correctly scope weird line break situations a
lot more often than is possible in tmLanguage, because in linear grammar
sequences, like those that define most statements, the context stack is all we
need to get 100% perfect matches. But there are cases in ES expressions -- more
than I initially thought, too -- where a token is ambiguous until accounting for
a later token that is allowed to be on the next line (where we can’t look).

Fortunately, save one, all of these linebreaks are, while legal, totally
asinine. That is, if a person really wrote this:

    label
    : {
      [ a,
      b=4 ]
      = [ (c)
      => { c * 2, d } ]
    }

... they don’t *deserve* syntax highlighting. So consider it a feature.

However even in these cases, Ecmascript Sublime will make a noble attempt at
recovering. In the example above. The binding pattern would be an array, but
when it hit the `=4` it would correct the remainder. The `(c)` would be an
expression, but at the arrow it would figure out where it really is, etc. But
not everything can be salvaged: the `label` would be an identifier, but the
colon would seem to be invalid because at that point we have to assume we’re in
a context expecting this series of tokens to resolve to an expression.

These are some of the cases where a technically-legal-but-obnoxious linebreaks
can cause mismatching, where the pipe represents a problematic linebreak:

 - Distinguishing between ‘in’ and ‘in’ in a for loop depends on lookaheads
   for sequences that could cross lines.
 - Statement label | `:`
 - Parameter(s) | `=>`
 - `function` | `*`
 - [ or ( of a comprehension | for
 - `async` | `function` (but only in expressions -- this is because async could
   also be an identifier, and accomodating that is important because of the
   popular Node library)
 - identifier | `(` (identifier will not be recognized as an invocation)
 - identifier | ``` (identifier will not be recognized as a tag)
 - There are various other situations similar to the last two, mainly concerning
   ‘secondary’ scopes like invocation rather than core scopes.

One more is a sore spot for me:

 - binding pattern | assignment operator

Unlike the others, this one could reasonably show up in code written by a sane
person. But even so, it’s probably quite rare in practice.
