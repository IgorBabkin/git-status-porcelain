import { create_timeout_fn, validate_modes, parse_stdout } from '../src/utils';
import exec from '../src/exec';
import {expect} from 'chai';
import {responseMock1} from './fixtures';

describe('All together', () => {
    it('validate_modes: Fail', (done) => {
        let exec_shell_command = () => Promise.resolve(responseMock1);
        let set_5_sec_timeout = create_timeout_fn(5000);
        exec(
            validate_modes,
            set_5_sec_timeout,
            exec_shell_command,
            parse_stdout
        )(['A', 'T', 'S'])
            .catch((error) => {
                try {
                    expect(error instanceof Error).to.be.ok;
                    expect(error.message).to.eql('T is invalid');
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('timeout: Fail', (done) => {
        let exec_shell_command = () => new Promise((resolve) => {
            setTimeout(resolve, 5000);
        });
        let set_5_sec_timeout = create_timeout_fn(100);
        exec(
            validate_modes,
            set_5_sec_timeout,
            exec_shell_command,
            parse_stdout
        )(['M'])
            .catch((error) => {
                try {
                    expect(error instanceof Error).to.be.ok;
                    expect(error.message).to.eql('Timeout has exceed(100)');
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('exec_command: Fail', (done) => {
        let error_msg = 'Something went wrong';
        let exec_shell_command = () => Promise.reject(new Error(error_msg));
        let set_5_sec_timeout = create_timeout_fn(100);
        exec(
            validate_modes,
            set_5_sec_timeout,
            exec_shell_command,
            parse_stdout
        )(['M'])
            .catch((error) => {
                try {
                    expect(error instanceof Error).to.be.ok;
                    expect(error.message).to.eql(error_msg);
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('all together: Success', (done) => {
        let exec_shell_command = () => Promise.resolve(responseMock1);
        let set_5_sec_timeout = create_timeout_fn(100);
        exec(
            validate_modes,
            set_5_sec_timeout,
            exec_shell_command,
            parse_stdout
        )(['M']).then((response) => {
            try {
                expect(response).to.eql([
                    'index.js',
                    'package.json',
                    'tsd.json'
                ]);
                done();
            } catch (error) {
                done(error);
            }
        }).catch((error) => {
            done(error);
        });
    });
});
