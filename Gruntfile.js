module.exports = function (grunt) {

    grunt.initConfig({
        jasmine_node: {
            testAll: {
                options: {
                    forceExit: false,
                    match: '.',
                    matchAll: false,
                    specFolders: ['.'],
                    extensions: 'js',
                    specNameMatcher: 'spec',
                    junitreport: {
                        report: true,
                        savePath : './build/reports/jasmine/',
                        useDotNotation: true,
                        consolidate: true
                    }
                },
                src: ['.']
            }
        }
    });
    grunt.loadNpmTasks('grunt-jasmine-node-coverage');

    grunt.registerTask('default', ['jasmine_node']);
};