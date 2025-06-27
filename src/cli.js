import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';

export const args = yargs(hideBin(process.argv))
    .options({
        count: {
            alias: 'm',
            type: 'number',
            default: 5,
            description: 'Number of messages to fetch'
        },
        skip: {
            alias: 's',
            type: 'number',
            default: 0,
            description: 'Number of messages to skip'
        },
        credentials: {
            alias: 'c',
            type: 'string',
            description: 'Path to credentials file (default: ./credentials.json)',
            default: '~/.config/gmail/credentials.json'
        }
    })
    .help()
    .version()
    .argv;
