const gulp = require("gulp");
const mocha = require("gulp-mocha");
const json2cson = require("gulp-json2cson");
const yaml = require("gulp-yaml");
const ts = require("gulp-typescript");
const js_yaml = require("js-yaml");
const plist = require("plist");
const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

const inputGrammar = "src/csharp.tmLanguage.yml";
const grammarsDirectory = "grammars/";
const jsOut = "out/";


function handleError(err) {
    console.log(err.toString());
    process.exit(-1);
}

gulp.task('buildTmLanguage', done => {
    const text = fs.readFileSync(inputGrammar);
    const jsonData = js_yaml.load(text);
    const plistData = plist.build(jsonData);

    if (!fs.existsSync(grammarsDirectory)) {
        fs.mkdirSync(grammarsDirectory);
    }

    fs.writeFileSync(path.join(grammarsDirectory, 'csharp.tmLanguage'), plistData);

    done();
});

gulp.task('buildVSCode', done => {
    const text = fs.readFileSync(inputGrammar);
    const jsonData = js_yaml.load(text);

    if (!fs.existsSync(grammarsDirectory)) {
        fs.mkdirSync(grammarsDirectory);
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

        fs.writeFileSync(path.join(grammarsDirectory, 'csharp.tmLanguage.json'), JSON.stringify(enhancedJson, null, '\t'));

        done();
    });
});

gulp.task('buildAtom', () => {
    return gulp.src(inputGrammar)
        .pipe(yaml())
        .pipe(json2cson())
        .pipe(gulp.dest(grammarsDirectory))
        .on("error", handleError);
});

gulp.task('compile', () => {
    const tsProject = ts.createProject("./tsconfig.json");
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest(jsOut));
});

gulp.task('test', gulp.series('compile', done => {
    const result = gulp.src(jsOut + "test/**/*.tests.js")
        .pipe(mocha())
        .on("error", handleError);

    done();

    return result;
}));

gulp.task('default',
    gulp.series(
        gulp.parallel('buildAtom', 'buildVSCode', 'buildTmLanguage'),
        'test'));
