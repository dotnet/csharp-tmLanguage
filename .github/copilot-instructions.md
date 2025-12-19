# Copilot Instructions for csharp-tmLanguage

## Repository Purpose
This repository contains the TextMate grammar for C# with outputs for VSCode, Atom, and TextMate. The grammar defines syntax highlighting rules for C# code.

## Development Workflow

### Grammar Changes
- **All grammar changes** must go into `src/csharp.tmLanguage.yml`
- This YAML file is the single source of truth for the C# grammar
- Never directly edit the generated files in the `grammars/` directory

### Building and Testing
- Run `npm run compile` (or `npm test`) to build and test the grammar
  - This runs the default `gulp` task which:
    - Builds the grammar files from `src/csharp.tmLanguage.yml`
    - Generates output files in `grammars/` directory
    - Runs all tests to validate the grammar
- The build process generates three files:
  - `grammars/csharp.tmLanguage` - TextMate grammar (XML plist format)
  - `grammars/csharp.tmLanguage.json` - VSCode format
  - `grammars/csharp.tmLanguage.cson` - Atom format

### Getting Started
1. Run `npm install` to install dependencies
2. Make changes to `src/csharp.tmLanguage.yml`
3. Run `npm run compile` to build and test
4. Review the generated files in `grammars/` directory

### Testing
- Tests are located in the `test/` directory
- Test files use the pattern `*.tests.ts`
- Tests validate that the grammar correctly tokenizes C# code
- All tests must pass before changes can be merged

### Watch Mode
- Use `npm run watch` to automatically rebuild the grammar when `src/csharp.tmLanguage.yml` changes
- Note: Watch mode only rebuilds the grammar files, it does not run tests
- After making changes, run `npm run compile` to run the full test suite

## Grammar Structure
- The grammar follows the TextMate grammar format
- It uses scopes to define different syntax elements
- Patterns use regular expressions to match C# syntax
- The `repository` section contains reusable pattern definitions
