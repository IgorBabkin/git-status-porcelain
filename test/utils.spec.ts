import { create_timeout_fn, parse_stdout, validate_modes } from '../src/utils';
import {expect} from 'chai';
import {responseMock1} from './fixtures';

describe('Utils', () => {
    it('is_modes_valid:Success', (done) => {
        try {
            validate_modes(['A', 'M', 'AM', 'C', 'U', 'D', 'R']);
            done();
        } catch (error) {
            done(error);
        }
    });

    it('is_modes_valid:Fail', (done) => {
        try {
            validate_modes(['A', 'M', 'AM', 'C', 'U', 'D', 'R', 'T']);
        } catch (error) {
            expect(error instanceof Error).to.be.ok;
            expect(error.message).to.eql('T is invalid');
            done();
        }
    });

    it('create_timeout_fn:Success', (done) => {
        let exec_git_status_porcelain_request_mock = Promise.resolve('hey');
        let set_100_ms_timeout = create_timeout_fn(100);

        set_100_ms_timeout(exec_git_status_porcelain_request_mock).then((response) => {
            try {
                expect(response).to.eql('hey');
                done();
            } catch (error) {
                done(error);
            }
        });
    });

    it('create_timeout_fn:Fail', (done) => {
        let exec_git_status_porcelain_request_mock = new Promise((resolve) => {
            setTimeout(resolve, 5000);
         });
        let set_100_ms_timeout = create_timeout_fn(100);

        set_100_ms_timeout(exec_git_status_porcelain_request_mock).catch((error: Error) => {
            try {
                expect(error instanceof Error).to.be.ok;
                done();
            } catch (error) {
                done(error);
            }
        });
    });

    it('parse_stdout', () => {
        let parse_response = parse_stdout(['M']);
        expect(parse_response(responseMock1)).to.eql([
            'index.js',
            'package.json',
            'tsd.json'
        ]);
    });

    it('parse_stdout: NO MODES', () => {
        let parse_response = parse_stdout(null);
        expect(parse_response(responseMock1)).to.eql([
            'index.js',
            'package.json',
            'parser.ts',
            'src/get_git_status_files.ts',
            'src/utils.ts',
            'tsd.json'
        ]);
    });
});
