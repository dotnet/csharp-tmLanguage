module.exports = function () {
    return {
        files: [
            'src/**/*.ts',
            'test/**/*.ts',
            '!test/**/*.tests.ts',
            { pattern: 'src/**/*.yml', instrument: false, load: false, ignore: false },
            { pattern: 'grammars/*.*', instrument: false, load: false, ignore: false }
        ],

        tests: [
            'test/**/*.tests.ts'
        ],

        env: {
            type: 'node'
        }
    };
};