import {GmailService} from './services/GmailService.js';
import {logger} from './utils/logger.js';
import {ConfigManager} from './config/ConfigManager.js';

async function main() {
    try {
        const config = await ConfigManager.initialize();
        const gmailService = await GmailService.initialize(config);

        await gmailService.getProfile();

        await gmailService.fetchAndDisplayMessages(config.messageCount);
    } catch (error) {
        logger.error('Application error:', error);
        process.exit(1);
    }
}

main();
