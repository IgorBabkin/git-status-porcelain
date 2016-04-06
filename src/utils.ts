import {exec} from 'child_process';

export var parseStdout = (modes: string[]) => (stdout: string) => {
    modes = modes || ['AM', 'A', 'M', 'C', 'D', 'R', 'U'];
    var template = new RegExp("^(" + modes.join("|") + ")\\s{1,2}(\\S+)");
    return stdout.split("\n").map(function (str) {
        return str.match(template);
    }).filter(function (matched) {
        return !!matched;
    }).map(function (matched) {
        return matched[2];
    });
}

export function executeGitStatusPorcelainCommand(): Promise<string> {
    return new Promise(function (resolve) {
        exec('git status --porcelain', function(error, stdout, stderr) {
            resolve(stdout);
        });
    });
}
