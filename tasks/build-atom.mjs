import { ensureDir, paths, readGrammarYaml, removeFileIfExists, runCommandCapture, writeJson } from "./lib/common.mjs";
import { writeFileSync } from "fs";

function main() {
  ensureDir(paths.grammarsDir);
  ensureDir(paths.tempDir);

  const grammar = readGrammarYaml();
  writeJson(paths.tempJsonForAtom, grammar, 2);

  const cson = runCommandCapture("npm", ["exec", "--", "json2cson", "--2spaces", paths.tempJsonForAtom]);
  writeFileSync(paths.atomGrammar, cson);

  removeFileIfExists(paths.tempJsonForAtom);
}

main();
