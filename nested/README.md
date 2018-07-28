# Building Nested Syntaxes

## Requirements
 - node.js (latest or stable)
 - npm


## Getting started

To download & install the required dependencies:
```sh
npm i
```

To build the nested syntaxes, run the `emk` build tool on the default main task:
```sh
npx emk
```


## Development

To continuously rebuild the syntaxes as you make edits, run `emk` in watch mode:
```sh
npx emk -w
```

To update the Sublime Packages dependency, run the `update.syntax_modules` task:
```sh
npx emk update.syntax_modules
```
