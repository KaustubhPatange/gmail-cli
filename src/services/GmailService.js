import { google } from 'googleapis';
import { AuthenticationManager } from '../auth/AuthenticationManager.js';
import { MessageFormatter } from '../utils/MessageFormatter.js';
import { logger } from '../utils/logger.js';

export class GmailService {
    constructor(auth) {
        this.gmail = google.gmail({ version: 'v1', auth });
    }

    static async initialize(config) {
        const auth = await AuthenticationManager.authorize(config);
        return new GmailService(auth);
    }

    async getProfile() {
        try {
            const response = await this.gmail.users.getProfile({ userId: 'me' });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch profile: ${error.message}`);
        }
    }

    async fetchAndDisplayMessages(count) {
        try {
            const messages = await this.listMessages();
            await this.processMessages(messages, count);
        } catch (error) {
            throw new Error(`Failed to fetch messages: ${error.message}`);
        }
    }

    async listMessages() {
        const response = await this.gmail.users.messages.list({ userId: 'me' });
        return response.data.messages || [];
    }

    async processMessages(messages, count) {
        const limit = Math.min(count, messages.length);

        for (let i = 0; i < limit; i++) {
            await this.processMessage(messages[i]);
        }
    }

    async processMessage(message) {
        try {
            const response = await this.gmail.users.messages.get({
                userId: 'me',
                id: message.id
            });

            if (!response.data.payload.parts) {
                logger.warn(`Message ${message.id} has no parts`);
                return;
            }

            const messageContent = MessageFormatter.extractMessageContent(response.data);
            MessageFormatter.displayMessage(messageContent);
        } catch (error) {
            logger.error(`Failed to process message ${message.id}:`, error);
        }
    }
}
