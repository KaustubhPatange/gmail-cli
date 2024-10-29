import path from 'path';
import { args } from '../cli.js';

export class ConfigManager {
    static async initialize() {
        return {
            credentialsPath: args.credentials || path.join(process.cwd(), 'credentials.json'),
            tokenPath: path.join(process.cwd(), 'token.json'),
            messageCount: args.count || 5
        };
    }
}