## Development

To **build and test** install Node.js do the following:

* Run `npm install` to install any dependencies.
* Run `npm run compile` to build and run tests.

Output grammars are output in the `grammars\` directory.

On Windows you may see a node-gyp error - [follow the instrutions here to resolve it](https://github.com/nodejs/node-gyp/blob/master/README.md).

## Supported outputs

* `grammars\csharp.cson` - for Atom
* `grammars\csharp.tmLanguage` - TextMate grammar (XML plist)


## Releasing

Tags on this repo get automatically published as a GitHub release and an NPM package through Travis CI.
