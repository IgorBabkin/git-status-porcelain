import {exec} from 'child_process';
const GIT_STATUS_MODES = ['AM', 'AD', 'A', 'M', 'C', 'D', 'R', 'U'];
const TIMEOUT = 5 * 1000;

export function parse_stdout(modes: string[]): Function {
    return function(stdout: string): string[] {
        modes = modes || GIT_STATUS_MODES;
        var template = new RegExp(`^(${modes.join('|')})\\s{1,2}(\\S+)`);
        return stdout.split('\n').map(function(str) {
            return str.trim().match(template);
        }).filter(function(matched) {
            return !!matched;
        }).map(function(matched) {
            return matched[2];
        });
    };
}

export function exec_git_status_porcelain_request(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec('git status --porcelain', function(error, stdout, stderr) {
            if (error) {
                reject(new Error(stderr));
            } else {
                resolve(stdout);
            }
        });
    });
}

function start_timeout(time: number, callback: Function): Function {
    let timeoutId = setTimeout(callback, time);
    return clearTimeout.bind(null, timeoutId);
}

export function create_timeout_fn(time): Function {
    return function(request: Promise<string>): Promise<string> {
        return new Promise((resolve, reject) => {
            let stop_timeout = start_timeout(time, reject.bind(null, new Error(`Timeout has exceed(${time})`)));
            request.then((response) => {
                stop_timeout();
                resolve(response);
            }, (error) => {
                stop_timeout();
                reject(error);
            });
        });
    };
}

export function validate_modes(modes: string[]): void {
    modes.forEach((mode) => {
        if (GIT_STATUS_MODES.indexOf(mode) === -1) {
            throw new Error(`${mode} is invalid`);
        }
    });
}
