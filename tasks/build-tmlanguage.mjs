import plist from "plist";
import { ensureDir, paths, readGrammarYaml } from "./lib/common.mjs";
import { writeFileSync } from "fs";

const { build } = plist;

function main() {
  const grammar = readGrammarYaml();
  const plistData = build(grammar);

  ensureDir(paths.grammarsDir);
  writeFileSync(paths.tmLanguage, plistData);
}

main();
