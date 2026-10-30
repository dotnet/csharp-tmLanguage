## Development

To **build and test** install Node.js do the following:

* Run `npm install` to install any dependencies.
* Run `npm run compile` to build the grammars and run tests.

Output grammars are output in the `grammars\` directory.

The main grammar is defined in [`src/csharp.tmLanguage.yml`](src/csharp.tmLanguage.yml).
Hover classification rules live in
[`src/csharp-hover.tmlanguage.yml`](src/csharp-hover.tmlanguage.yml). The shared
build loader merges both repositories into every output grammar and rejects
duplicate rule names. Edit these YAML sources rather than the generated grammars.

On Windows you may see a node-gyp error - [follow the instructions here to resolve it](https://github.com/nodejs/node-gyp/blob/master/README.md).

## Supported outputs

* `grammars\csharp.cson` - for Atom
* `grammars\csharp.tmLanguage` - TextMate grammar (XML plist)


## Releasing

Tags on this repo get automatically published as a GitHub release and an NPM package through Travis CI.
