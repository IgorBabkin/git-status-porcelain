import { create_timeout_fn, parse_stdout, exec_git_status_porcelain_request, validate_modes } from './utils';
import exec from './exec';

let set_5_sec_timeout = create_timeout_fn(5000);

export default exec(
    validate_modes,
    set_5_sec_timeout,
    exec_git_status_porcelain_request,
    parse_stdout
);
