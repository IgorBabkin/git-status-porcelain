export default function exec(validate_modes: Function, set_timeout: Function, exec_command: Function, parse_stdout): Function {
    return function(modes: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                validate_modes(modes);
                set_timeout(exec_command())
                    .then(parse_stdout(modes))
                    .then(resolve, reject);
            } catch (error) {
                reject(error);
            }
        });
    };
}
