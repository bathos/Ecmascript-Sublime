# Ecmascript Sublime Syntax

A sublime-syntax language definition for Ecmascript / Javascript / ES6 / ES2015
/ Babel or what have you.

> This is not yet ready for use, only testing! However, the syntax definition
  itself is tentatively complete. I will inevitably discover bugs and oversights
  as I test and begin on the themes, but if you’re a theme designer please feel
  free to take it for a ride at this point.

> Sublime syntax is only currently only available in Sublime Text’s dev channel.

<!-- MarkdownTOC autolink=true bracket=round -->

- [Remaining Work](#remaining-work)
- [Why Bother](#why-bother)
- [Feature Coverage](#feature-coverage)
- [SublimeText Symbols](#sublimetext-symbols)
- [Themes](#themes)
- [Scopes](#scopes)
- [About the Scope Conventions](#about-the-scope-conventions)
- [More Infobarf for Someone Hypothetically Curious About the Definition Itself](#more-infobarf-for-someone-hypothetically-curious-about-the-definition-itself)

<!-- /MarkdownTOC -->

## Remaining Work

 - I’d like to provide two themes with the definition package itself. One will
   be something tacky to show off the kinds of stuff you can do; the other will
   be something more usable.
 - The chunk of comment-delimited code starting at `assignmentExpression_NO_IN`
   is actually possible to generate as a build step. Doing so will reduce the
   chances of accidentally editing `assignmentExpression` without making the
   corresponding change in `assignmentExpression_NO_IN`. I’m not sure if this
   is worthwhile yet but it seems like a good idea. 
 - Ecmascript Sublime Syntax introduces many scopes not in the original Sublime
   Javascript tmLanguage or JSNext or Babel Sublime. However it also lacks some
   scopes from these. While these divergences were usually deliberate, I would
   like to add ‘double’ scopes to certain elements to increase compatibility
   with existing themes that target Babel Sublime and JSNext. 
 - A lot of the redundant-looking contexts exist for good reasons -- but not all
   of them. There should be a clean-up and consolidation phase for contexts,
   but more importantly, for patterns.

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

Contexts exist in a FIFO stack. They can be pushed, popped, or ‘set’ (pop-push).
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
are also individuated. In fact there are far, far more specific scopes available
than anyone would ever reasonably use, but that point was to allow the theme
designer to choose exactly which elements share colors (most good themes seem to
have relatively small palettes, really). 

However there are good reasons one might prefer one of the other choices for
syntax highlighting. For one, maybe you like a theme that plays better with one
of the others. But also, there are differences with the approach taken that may
or may not suit your style. And finally, Ecmascript Sublime is a lot more rigid
by nature, so invalid token sequences will not often pass unnoticed -- you may
find this useful, or you may find it bothersome.

## Feature Coverage

In addition to everything in the final draft of ES6, I’ve included support for
certain ES7 strawmen that have already been implemented in Babel or Firefox. The
depth is not always as great as with established language features, though. For
example, async/await keywords are supported, but I didn’t go whole hog by making
the whole async function targettable. Once async is formalized -- the grammar is
still up in the air -- then it will be implemented thoroughly like generators.

The following candidate ES7 features, as they stand today anyway, are covered:

 - async / await (minimal, but including methods, expressions, and arrows)
 - generator comprehensions
 - array comprehensions, but only as implemented by Babel and Mozilla. (Which
   differs from the current spec, as I understand it.)
 - exponentiation and mallet operators
 - class and method decorators
 - trailing commas where they don’t belong at all ugh
 - object literal spread and object binding pattern rest

There are a handful of optional ES7 Babel transforms I haven’t done yet:

 - class properties
 - export extensions
 - bind operator (this one is VERY cool, didn’t know about it till today!)

I didn’t include JSX. If you use JSX, you should use Babel Sublime, which
handles that in depth. I’m not opposed to adding it, but since I don’t use it
myself it wasn’t a priority. (Pull reqs welcome.)  

## SublimeText Symbols

A Sublime syntax definition involves more than the definition proper. These
other items use the tmPreferences format to describe how automatic identation
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

Note that only expressions that appear as the righthand side of a declaration
will be added to the list, so `const x = () => {}` is added as ‘arrow x’ but
`x = () => {}` is not.

All of these are local-only except classes. If people want the others to be
global (except default exports obviously) we can change that. This is what made
sense to me, but I pretty much only ever use the local list myself so I wasn’t
sure what habitual global users would like to see.

## Themes

As yet, there are none! Let’s fix that.

I intend to do one theme that’s really a demo of what’s possible -- in other
words, it will be tacky as hell. But of course I want to add a more reasonable
one as well.

If you’re interested in adding support for Ecmascript Sublime to your theme, or
are developing a new theme with this in mind, you’ll probably want a list of
the targettable scopes...

## Scopes

Once this is solidified I will add examples, at least for the ones that might
not otherwise be obvious. Right now it’s still likely that some of these will be
tweaked.

 - comment.block.es
 - comment.line.es
 - comment.line.shebang.es
 - constant.character.escape.control-char.regexp
 - constant.character.escape.es
 - constant.character.escape.hexadecimal.es
 - constant.character.escape.hexadecimal.regexp
 - constant.character.escape.newline.es
 - constant.character.escape.null.es
 - constant.character.escape.null.regexp
 - constant.character.escape.pointless.es
 - constant.character.escape.pointless.regexp
 - constant.character.escape.regexp
 - constant.character.escape.unicode.es
 - constant.character.escape.unicode.regexp
 - constant.language.boolean.false.es
 - constant.language.boolean.true.es
 - constant.language.infinity.es
 - constant.language.nan.es
 - constant.language.null.es
 - constant.language.undefined.es
 - constant.numeric.binary.es
 - constant.numeric.decimal.es
 - constant.numeric.hexadecimal.es
 - constant.numeric.octal.es
 - constant.other.character-class.predefined.regexp
 - constant.other.character-class.set.regexp
 - entity.name.accessor.get.es
 - entity.name.accessor.set.es
 - entity.name.class.es
 - entity.name.function.allCap.es
 - entity.name.function.es
 - entity.name.function.generator.es
 - entity.name.function.initCap.es
 - entity.name.method.async.es
 - entity.name.method.constructor.es
 - entity.name.method.es
 - entity.name.method.generator.es
 - entity.name.module.export.es
 - entity.name.module.import.es
 - entity.name.statement.es
 - entity.other.property-binding.es
 - entity.other.property-binding.parameter.es
 - invalid.deprecated.es
 - invalid.illegal.newline.es
 - invalid.illegal.octal-escape.es
 - invalid.illegal.token.es
 - keyword.control.anchor.regexp
 - keyword.control.conditional.else.es
 - keyword.control.conditional.if.es
 - keyword.control.flow.await.es
 - keyword.control.flow.break.es
 - keyword.control.flow.continue.es
 - keyword.control.flow.each.es
 - keyword.control.flow.return.es
 - keyword.control.flow.throw.es
 - keyword.control.flow.yield.es
 - keyword.control.flow.yield.iterate.es
 - keyword.control.loop.conditional.if.comprehension.array.es
 - keyword.control.loop.conditional.if.comprehension.generator.es
 - keyword.control.loop.do.es
 - keyword.control.loop.for.comprehension.array.es
 - keyword.control.loop.for.comprehension.generator.es
 - keyword.control.loop.for.es
 - keyword.control.loop.in.es
 - keyword.control.loop.of.comprehension.array.es
 - keyword.control.loop.of.comprehension.generator.es
 - keyword.control.loop.of.es
 - keyword.control.loop.while.es
 - keyword.control.switch.case.default.es
 - keyword.control.switch.case.es
 - keyword.control.switch.es
 - keyword.control.trycatch.catch.es
 - keyword.control.trycatch.finally.es
 - keyword.control.trycatch.try.es
 - keyword.control.with.es
 - keyword.operator.accessor.es
 - keyword.operator.arithmetic.addition.es
 - keyword.operator.arithmetic.decrement.postfix.es
 - keyword.operator.arithmetic.decrement.prefix.es
 - keyword.operator.arithmetic.division.es
 - keyword.operator.arithmetic.exponentiation.es
 - keyword.operator.arithmetic.increment.postfix.es
 - keyword.operator.arithmetic.increment.prefix.es
 - keyword.operator.arithmetic.modulo.es
 - keyword.operator.arithmetic.multiplication.es
 - keyword.operator.arithmetic.sign.negative.es
 - keyword.operator.arithmetic.sign.positive.es
 - keyword.operator.arithmetic.subtraction.es
 - keyword.operator.assignment.augmented.arithmetic.addition.es
 - keyword.operator.assignment.augmented.arithmetic.division.es
 - keyword.operator.assignment.augmented.arithmetic.exponentiation.es
 - keyword.operator.assignment.augmented.arithmetic.modulo.es
 - keyword.operator.assignment.augmented.arithmetic.multiplication.es
 - keyword.operator.assignment.augmented.arithmetic.subtraction.es
 - keyword.operator.assignment.augmented.bitwise.logical.and.es
 - keyword.operator.assignment.augmented.bitwise.logical.or.es
 - keyword.operator.assignment.augmented.bitwise.logical.xor.es
 - keyword.operator.assignment.augmented.bitwise.shift.left.es
 - keyword.operator.assignment.augmented.bitwise.shift.right.es
 - keyword.operator.assignment.augmented.bitwise.shift.right.unsigned.es
 - keyword.operator.assignment.conditional.default.es
 - keyword.operator.assignment.conditional.mallet.es
 - keyword.operator.assignment.es
 - keyword.operator.bitwise.logical.and.es
 - keyword.operator.bitwise.logical.not.es
 - keyword.operator.bitwise.logical.or.es
 - keyword.operator.bitwise.logical.xor.es
 - keyword.operator.bitwise.shift.left.es
 - keyword.operator.bitwise.shift.right.es
 - keyword.operator.bitwise.shift.right.unsigned.es
 - keyword.operator.comma.es
 - keyword.operator.comparison.equality.coercive.es
 - keyword.operator.comparison.equality.strict.es
 - keyword.operator.comparison.non-equality.coercive.es
 - keyword.operator.comparison.non-equality.strict.es
 - keyword.operator.logical.and.es
 - keyword.operator.logical.not.es
 - keyword.operator.logical.or.es
 - keyword.operator.negation.regexp
 - keyword.operator.new.es
 - keyword.operator.or.regexp
 - keyword.operator.quantifier.regexp
 - keyword.operator.relational.gt.es
 - keyword.operator.relational.gte.es
 - keyword.operator.relational.in.es
 - keyword.operator.relational.instanceof.es
 - keyword.operator.relational.lt.es
 - keyword.operator.relational.lte.es
 - keyword.operator.spread.es
 - keyword.operator.ternary.else.es
 - keyword.operator.ternary.if.es
 - keyword.operator.unary.delete.es
 - keyword.operator.unary.typeof.es
 - keyword.operator.unary.void.es
 - keyword.other.back-reference.regexp
 - keyword.other.debugger.es
 - keyword.other.extends.es
 - keyword.other.rest.es
 - meta.comment.body.es
 - meta.comment.border.es
 - meta.comment.box-drawing.es
 - meta.directive.use-strict.es
 - meta.group.assertion.negative.regexp
 - meta.group.assertion.positive.regexp
 - meta.group.capturing.regexp
 - meta.group.non-capturing.regexp
 - meta.idiomatic-cast.boolean.es
 - meta.invocation.es
 - meta.numeric.exponent.digit.es
 - meta.numeric.exponent.e.es
 - meta.numeric.exponent.sign.es
 - meta.numeric.prefix.es
 - meta.symbol-helper.arrow.es
 - meta.symbol-helper.class.es
 - meta.symbol-helper.function.es
 - meta.symbol-helper.generator.es
 - meta.whitespace.es
 - punctuation.decimal.es
 - punctuation.definition.accessor.begin.es
 - punctuation.definition.accessor.body.begin.es
 - punctuation.definition.accessor.body.end.es
 - punctuation.definition.accessor.end.es
 - punctuation.definition.accessor.parameter.begin.es
 - punctuation.definition.arguments.begin.es
 - punctuation.definition.arguments.end.es
 - punctuation.definition.array.begin.es
 - punctuation.definition.array.end.es
 - punctuation.definition.binding.array.begin.es
 - punctuation.definition.binding.array.end.es
 - punctuation.definition.binding.array.parameter.begin.es
 - punctuation.definition.binding.array.parameter.end.es
 - punctuation.definition.binding.object.begin.es
 - punctuation.definition.binding.object.end.es
 - punctuation.definition.binding.object.parameter.begin.es
 - punctuation.definition.binding.object.parameter.end.es
 - punctuation.definition.block.begin.es
 - punctuation.definition.block.conditional.begin.es
 - punctuation.definition.block.conditional.end.es
 - punctuation.definition.block.end.es
 - punctuation.definition.block.loop.begin.es
 - punctuation.definition.block.loop.end.es
 - punctuation.definition.block.switch.begin.es
 - punctuation.definition.block.switch.end.es
 - punctuation.definition.block.trycatch.begin.es
 - punctuation.definition.block.trycatch.end.es
 - punctuation.definition.block.with.begin.es
 - punctuation.definition.block.with.end.es
 - punctuation.definition.character-class.begin.regexp
 - punctuation.definition.character-class.dash.regexp
 - punctuation.definition.character-class.end.regexp
 - punctuation.definition.class.body.begin.es
 - punctuation.definition.class.body.end.es
 - punctuation.definition.comment.begin.es
 - punctuation.definition.comment.end.es
 - punctuation.definition.comprehension.array.begin.es
 - punctuation.definition.comprehension.array.end.es
 - punctuation.definition.comprehension.generator.begin.es
 - punctuation.definition.comprehension.generator.end.es
 - punctuation.definition.constructor.body.begin.es
 - punctuation.definition.constructor.body.end.es
 - punctuation.definition.decorator.es
 - punctuation.definition.expression.begin.es
 - punctuation.definition.expression.conditional.begin.es
 - punctuation.definition.expression.conditional.comprehension.array.begin.es
 - punctuation.definition.expression.conditional.comprehension.generator.begin.es
 - punctuation.definition.expression.conditional.end.es
 - punctuation.definition.expression.end.es
 - punctuation.definition.expression.loop.begin.es
 - punctuation.definition.expression.loop.comprehension.array.begin.es
 - punctuation.definition.expression.loop.comprehension.generator.begin.es
 - punctuation.definition.expression.loop.end.es
 - punctuation.definition.expression.switch.begin.es
 - punctuation.definition.expression.switch.end.es
 - punctuation.definition.expression.with.begin.es
 - punctuation.definition.expression.with.end.es
 - punctuation.definition.function.arrow.body.begin.es
 - punctuation.definition.function.arrow.body.end.es
 - punctuation.definition.function.body.begin.es
 - punctuation.definition.function.body.end.es
 - punctuation.definition.generator.body.begin.es
 - punctuation.definition.generator.body.end.es
 - punctuation.definition.group.begin.regexp
 - punctuation.definition.group.end.regexp
 - punctuation.definition.method.body.begin.es
 - punctuation.definition.method.body.end.es
 - punctuation.definition.method.generator.body.begin.es
 - punctuation.definition.method.generator.body.end.es
 - punctuation.definition.module-binding.begin.es
 - punctuation.definition.module-binding.end.es
 - punctuation.definition.object.begin.es
 - punctuation.definition.object.end.es
 - punctuation.definition.parameters.accessor.begin.es
 - punctuation.definition.parameters.accessor.end.es
 - punctuation.definition.parameters.catch.begin.es
 - punctuation.definition.parameters.catch.end.es
 - punctuation.definition.parameters.constructor.begin.es
 - punctuation.definition.parameters.constructor.end.es
 - punctuation.definition.parameters.function.arrow.begin.es
 - punctuation.definition.parameters.function.arrow.end.es
 - punctuation.definition.parameters.function.begin.es
 - punctuation.definition.parameters.function.end.es
 - punctuation.definition.parameters.generator.begin.es
 - punctuation.definition.parameters.generator.end.es
 - punctuation.definition.parameters.method.begin.es
 - punctuation.definition.parameters.method.end.es
 - punctuation.definition.parameters.method.generator.begin.es
 - punctuation.definition.parameters.method.generator.end.es
 - punctuation.definition.string.interpolated.begin.es
 - punctuation.definition.string.interpolated.element.begin.es
 - punctuation.definition.string.interpolated.element.end.es
 - punctuation.definition.string.interpolated.end.es
 - punctuation.definition.string.quoted.double.begin.es
 - punctuation.definition.string.quoted.double.end.es
 - punctuation.definition.string.quoted.double.parameter.begin.es
 - punctuation.definition.string.quoted.single.begin.es
 - punctuation.definition.string.quoted.single.end.es
 - punctuation.definition.string.quoted.single.parameter.begin.es
 - punctuation.definition.string.regexp.begin.es
 - punctuation.definition.string.regexp.end.es
 - punctuation.separator.argument.es
 - punctuation.separator.array-element.binding.es
 - punctuation.separator.array-element.es
 - punctuation.separator.binding-binding.es
 - punctuation.separator.case-statements.es
 - punctuation.separator.key-value.es
 - punctuation.separator.label-statement.es
 - punctuation.separator.loop-expression.es
 - punctuation.separator.module-binding.es
 - punctuation.separator.object-member.binding.es
 - punctuation.separator.object-member.es
 - punctuation.separator.parameter.es
 - punctuation.separator.property-binding.es
 - punctuation.separator.property-binding.parameter.es
 - punctuation.terminator.statement.es
 - source.es
 - storage.type.accessor.get.es
 - storage.type.accessor.set.es
 - storage.type.async.es
 - storage.type.async.expression.es
 - storage.type.class.es
 - storage.type.class.expression.es
 - storage.type.constant.es
 - storage.type.function.arrow.es
 - storage.type.function.es
 - storage.type.function.expression.es
 - storage.type.function.generator.asterisk.es
 - storage.type.function.generator.asterisk.expression.es
 - storage.type.function.generator.es
 - storage.type.function.generator.expression.es
 - storage.type.module.as.es
 - storage.type.module.default.es
 - storage.type.module.export.es
 - storage.type.module.from.es
 - storage.type.module.import.es
 - storage.type.module.namespace.es
 - storage.type.static.es
 - storage.type.variable.let.es
 - storage.type.variable.var.es
 - string.interpolated.es
 - string.quoted.double.es
 - string.quoted.single.es
 - string.regexp.es
 - string.regexp.flags.es
 - support.class.builtin.es
 - support.class.node.es
 - support.function.builtin.es
 - support.function.node.require.es
 - support.type.object.builtin.es
 - support.type.object.dom-library.es
 - support.type.object.dom.es
 - support.type.object.functional-library.es
 - support.type.object.node.es
 - variable.language.arguments.es
 - variable.language.new-target.fake-accessor.es
 - variable.language.new-target.fake-object.es
 - variable.language.new-target.fake-property.es
 - variable.language.proto.es
 - variable.language.prototype.es
 - variable.language.super.es
 - variable.language.this.es
 - variable.other.readwrite.allCap.es
 - variable.other.readwrite.constructor.es
 - variable.other.readwrite.decorator.es
 - variable.other.readwrite.es
 - variable.other.readwrite.export.es
 - variable.other.readwrite.import.es
 - variable.other.readwrite.initCap.es
 - variable.other.readwrite.property.allCap.es
 - variable.other.readwrite.property.es
 - variable.other.readwrite.property.initCap.es
 - variable.other.readwrite.property.proto.es
 - variable.other.readwrite.property.prototype.es
 - variable.other.readwrite.property.shorthand.allCap.es
 - variable.other.readwrite.property.shorthand.es
 - variable.other.readwrite.property.shorthand.initCap.es
 - variable.other.readwrite.property.shorthand.rest.allCap.es
 - variable.other.readwrite.property.shorthand.rest.es
 - variable.other.readwrite.property.shorthand.rest.initCap.es
 - variable.other.readwrite.tag.es
 - variable.parameter.catch.es
 - variable.parameter.es
 - variable.parameter.rest.es

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
already target `string.interpolated`. One of the things I will do later is
‘double scope’ these things so that you can refer to them either way in a theme.

Other divergences stem from the objective of the definition, which may differ a
bit in intent. I wanted the scopes to be very reflective of the language’s
grammar. For example, `entity.name.function` will appear in a function
declaration, but it won’t appear in function invocations; to Ecmascript Sublime,
in that context what you’re looking at is an identifier (which has a scope) and
an invocation (which also has a scope), but not an entity name.

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

If you’re new to theming, make sure you grab AAAPackageDev and ScopeAlways from
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
recovering. In the example above, the `label` would be an identifier, but the
colon would be understood correctly. The binding pattern would be an array, but
when it hit the `=4` it would correct the remainder. The `(c)` would be an
expression, but at the arrow it would figure out where it really is, etc.

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
