import { google } from 'googleapis';
import { AuthenticationManager } from '../auth/AuthenticationManager.js';
import { MessageFormatter } from '../utils/MessageFormatter.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';

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
            const messages = await this.listMessages(count);
            await this.processMessages(messages, count);
        } catch (error) {
            throw new Error(`Failed to fetch messages: ${error.message}`);
        }
    }

    async listMessages(count) {
        const response = await this.gmail.users.messages.list({ userId: 'me', maxResults: count, q: 'in:inbox -from:me' });
        return response.data.messages || [];
    }

    async processMessages(messages, count) {
      for (const message of messages) {
        await this.processMessage(message)
      }
    }

    async processMessage(msg) {
        try {

          const msgRes = await this.gmail.users.messages.get({
            userId: 'me',
            id: msg.id,
            format: 'metadata',
            metadataHeaders: ['Subject', 'Date', 'From'],
          });

          const headers = msgRes.data.payload?.headers || [];
          const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
          const rawDate = headers.find(h => h.name === 'Date')?.value;
          const date = rawDate ? new Date(rawDate).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }) : '(No Date)';
          const from = headers.find(h => h.name === 'From')?.value || '(Unknown Sender)';
          const gmailUrl = `https://mail.google.com/mail/u/0/#all/${msg.id}`;

          // Output all in one line
          console.log(
            `${chalk.blue('📧')} ${chalk.bold(subject)} ` +
            `${chalk.gray('|')} ${chalk.yellow(date)} ` +
            `${chalk.gray('|')} ${chalk.green(from)}\n` +
            `${chalk.underline.grey(gmailUrl)}\n`
          );
        } catch (error) {
            logger.error(`Failed to process message ${message.id}:`, error);
        }
    }
}
