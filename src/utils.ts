import {exec} from 'child_process';
const GIT_STATUS_MODES = ['AM', 'A', 'M', 'C', 'D', 'R', 'U']; 
const TIMEOUT = 5 * 1000;

export const parse_stdout = (modes: string[]) => (stdout: string) => {
    modes = modes || GIT_STATUS_MODES;
    var template = new RegExp("^(" + modes.join("|") + ")\\s{1,2}(\\S+)");
    return stdout.split("\n").map(function (str) {
        return str.trim().match(template);
    }).filter(function (matched) {
        return !!matched;
    }).map(function (matched) {
        return matched[2];
    });
};

export const exec_git_status_porcelain_request = () => new Promise((resolve, reject) => {
    exec('git status --porcelain', function(error, stdout, stderr) {
        if (error) {
            reject(stderr);
        } else {
            resolve(stdout);
        }
    });
});

function start_timeout(time: number, callback: Function): Function {
    let timeoutId = setTimeout(callback, time);
    return clearTimeout.bind(null, timeoutId);    
}

export const create_timeout_fn = (time, errorMessage) => (request: Promise<string>) => new Promise((resolve, reject) => {
    let stop_timeout = start_timeout(time, reject.bind(null, errorMessage));
    
    request.then((response) => {
        stop_timeout();
        resolve(response);
    }, (error) => {
        stop_timeout();
        reject(error);
    })
})

export const is_modes_valid = (modes: string[]): boolean => {
    let not_in_git_status_modes = modes.filter((mode) => {
        return GIT_STATUS_MODES.indexOf(mode) === -1;
    });
    
    return !not_in_git_status_modes.length
}
