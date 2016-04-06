import {executeGitStatusPorcelainCommand, parseStdout} from "./lib";
export default function getGitStatusFiles(modes: string[]) {
    return executeGitStatusPorcelainCommand().then(parseStdout(modes));
}