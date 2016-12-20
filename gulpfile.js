const gulp = require("gulp");
const mocha = require("gulp-mocha");
const json2cson = require("gulp-json2cson");
const ts = require("gulp-typescript");
const fs = require("fs");
const plist = require("plist");
const path = require("path");

const sourceGrammarFile = "src/csharp.json";
const grammarOutputDirectory = "grammars/";
const jsOut = "out/";


function handleError (err) {
  console.log(err.toString());
  process.exit(-1);
}


gulp.task("default", ["test", "buildAtom", "buildVSCode", "buildTmLanguage"]);

gulp.task("buildTmLanguage", function () {
    let jsonData = JSON.parse(fs.readFileSync(sourceGrammarFile));
    let plistData = plist.build(jsonData);
    if (!fs.existsSync(grammarOutputDirectory))
        fs.mkdirSync(grammarOutputDirectory);
    fs.writeFileSync(path.join(grammarOutputDirectory, "csharp.tmLanguage"), plistData);
});

gulp.task("buildAtom", function () {
    return gulp.src(sourceGrammarFile)
        .pipe(json2cson())
        .pipe(gulp.dest(grammarOutputDirectory))
        .on("error", handleError);
});

gulp.task("buildVSCode", function() {
    return gulp.src(sourceGrammarFile)
        .pipe(gulp.dest(grammarOutputDirectory))
        .on("error", handleError);
});

gulp.task("compile", function() {
    var tsProject = ts.createProject("./tsconfig.json");
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest(jsOut));
});

gulp.task("test", ["compile"], () => {
    return gulp.src(jsOut + "test/**/*.tests.js")
        .pipe(mocha())
        .on("error", handleError);
});
