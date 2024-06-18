import { task, src, dest, series, parallel } from "gulp";
import mocha from "gulp-mocha";
import json2cson from "gulp-json2cson";
import yaml from "gulp-yaml";
import { createProject } from "gulp-typescript";
import { load } from "js-yaml";
import pkg from 'plist';
const { build } = pkg;
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { exec } from "child_process";

const inputGrammar = "src/csharp.tmLanguage.yml";
const grammarsDirectory = "grammars/";
const jsOut = "out/";


function handleError(err) {
    console.log(err.toString());
    process.exit(-1);
}

task('buildTmLanguage', done => {
    const text = readFileSync(inputGrammar);
    const jsonData = load(text);
    const plistData = build(jsonData);

    if (!existsSync(grammarsDirectory)) {
        mkdirSync(grammarsDirectory);
    }

    writeFileSync(join(grammarsDirectory, 'csharp.tmLanguage'), plistData);

    done();
});

task('buildVSCode', done => {
    const text = readFileSync(inputGrammar);
    const jsonData = load(text);

    if (!existsSync(grammarsDirectory)) {
        mkdirSync(grammarsDirectory);
    }

    // These fields aren't used.
    jsonData.uuid = undefined;
    jsonData.fileTypes = undefined;

    // Get the SHA of the last commit.
    exec("git rev-parse HEAD", (err, stdout, stderr) => {
        if (err) {
            handleErr(err);
        }

        const commitSha = stdout.trim();

        // Add the additional properties used in the VSCode repo.
        const enhancedJson = {
            "information_for_contributors": [
                "This file has been converted from https://github.com/dotnet/csharp-tmLanguage/blob/main/grammars/csharp.tmLanguage",
                "If you want to provide a fix or improvement, please create a pull request against the original repository.",
                "Once accepted there, we are happy to receive an update request."
            ],
            "version": `https://github.com/dotnet/csharp-tmLanguage/commit/${commitSha}`,
            ...jsonData
        }

        writeFileSync(join(grammarsDirectory, 'csharp.tmLanguage.json'), JSON.stringify(enhancedJson, null, '\t'));

        done();
    });
});

task('buildAtom', () => {
    return src(inputGrammar)
        .pipe(yaml())
        .pipe(json2cson())
        .pipe(dest(grammarsDirectory))
        .on("error", handleError);
});

task('compile', () => {
    const tsProject = createProject("./tsconfig.json");
    return tsProject.src()
        .pipe(tsProject())
        .pipe(dest(jsOut));
});

task('test', series('compile', done => {
    const result = src(jsOut + "test/**/*.tests.js")
        .pipe(mocha())
        .on("error", handleError);

    done();

    return result;
}));

task('default',
    series(
        parallel('buildAtom', 'buildVSCode', 'buildTmLanguage'),
        'test'));
