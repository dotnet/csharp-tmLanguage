import { ensureDir, getCommitSha, paths, readGrammarYaml, writeJson } from "./lib/common.mjs";

function main() {
  const grammar = readGrammarYaml();

  grammar.uuid = undefined;
  grammar.fileTypes = undefined;

  const commitSha = getCommitSha();

  const enhancedJson = {
    information_for_contributors: [
      "This file has been converted from https://github.com/dotnet/csharp-tmLanguage/blob/main/grammars/csharp.tmLanguage",
      "If you want to provide a fix or improvement, please create a pull request against the original repository.",
      "Once accepted there, we are happy to receive an update request."
    ],
    version: `https://github.com/dotnet/csharp-tmLanguage/commit/${commitSha}`,
    ...grammar
  };

  ensureDir(paths.grammarsDir);
  writeJson(paths.vscodeGrammar, enhancedJson, "\t");
}

main();
