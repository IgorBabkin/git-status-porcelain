import { create_timeout_fn, exec_git_status_porcelain_request, parse_stdout, is_modes_valid } from '../src/utils';
import {expect} from 'chai';
import {responseMock1} from './fixtures';

describe('Success', () => {
    // let modes = ['A', 'M', 'C'];
    
    // if (is_modes_valid(modes)) {
    //     let parseResponse = parse_stdout(['A', 'M', 'C']);
    //     let set_5_sec_timeout = create_timeout_fn(5000, 'Timeout has exceeded'); 
    //     return set_5_sec_timeout(exec_git_status_porcelain_request()).then(parseResponse);
    // }
        
    it('isModesValid', () => {
        expect(is_modes_valid(['A', 'M', 'AM', 'C', 'U', 'D', 'R'])).to.be.ok;
        expect(is_modes_valid(['A', 'M', 'AM', 'C'])).to.be.ok;
        expect(is_modes_valid(['A', 'M', 'AM', 'C', 'U', 'D', 'R', 'T'])).not.to.be.ok;
        expect(is_modes_valid(['A', 'B', 'T'])).not.to.be.ok;            
    })
    
    it('checkForTimeout', (done) => {
        let exec_git_status_porcelain_request_mock = new Promise((resolve, reject) => {});
        let error_message = 'Timeout has exceed';
        let set_100_ms_timeout = create_timeout_fn(100, error_message);
        
        set_100_ms_timeout(exec_git_status_porcelain_request_mock).catch((error) => {
            try {
                expect(error).to.eql(error_message);
                done();    
            } catch(error) {
                done(error);     
            }
        });
    })
    
    it('parseStdout', () => {
        let parse_response = parse_stdout(['M']);
        expect(parse_response(responseMock1)).to.eql([
            'index.js',
            'package.json',
            'tsd.json'
        ])
    });
});