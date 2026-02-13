import { execSync, spawnSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import { load } from "js-yaml";

export const root = process.cwd();

export const paths = {
  grammarYaml: join(root, "src", "csharp.tmLanguage.yml"),
  grammarsDir: join(root, "grammars"),
  tmLanguage: join(root, "grammars", "csharp.tmLanguage"),
  vscodeGrammar: join(root, "grammars", "csharp.tmLanguage.json"),
  atomGrammar: join(root, "grammars", "csharp.tmLanguage.cson"),
  outDir: join(root, "out"),
  tempDir: join(root, ".tmp"),
  tempJsonForAtom: join(root, ".tmp", "csharp.tmLanguage.processed.json")
};

export function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

export function readGrammarYaml() {
  const text = readFileSync(paths.grammarYaml, "utf8");
  return load(text);
}

export function getCommitSha() {
  return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
}

export function runCommand(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.status ?? "unknown"}`);
  }
}

export function runCommandCapture(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8"
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || `${command} ${args.join(" ")} failed with exit code ${result.status ?? "unknown"}`);
  }

  return result.stdout;
}

export function writeJson(filePath, obj, indent = 2) {
  writeFileSync(filePath, JSON.stringify(obj, null, indent));
}

export function removeFileIfExists(filePath) {
  if (existsSync(filePath)) {
    unlinkSync(filePath);
  }
}
