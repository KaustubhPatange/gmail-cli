import fs from 'fs/promises';
import path from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { logger } from '../utils/logger.js';

export class AuthenticationManager {
    static SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

    static async authorize(config) {
        try {
            const savedCredentials = await this.loadSavedCredentials(config.tokenPath);
            if (savedCredentials) {
                return savedCredentials;
            }

            const client = await authenticate({
                scopes: this.SCOPES,
                keyfilePath: config.credentialsPath,
            });

            if (client.credentials) {
                await this.saveCredentials(client, config);
            }

            return client;
        } catch (error) {
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    static async loadSavedCredentials(tokenPath) {
        try {
            const content = await fs.readFile(tokenPath);
            const credentials = JSON.parse(content);
            return google.auth.fromJSON(credentials);
        } catch (error) {
            logger.debug('No saved credentials found');
            return null;
        }
    }

    static async saveCredentials(client, config) {
        try {
            const content = await fs.readFile(config.credentialsPath);
            const keys = JSON.parse(content);
            const key = keys.installed || keys.web;

            const payload = {
                type: 'authorized_user',
                client_id: key.client_id,
                client_secret: key.client_secret,
                refresh_token: client.credentials.refresh_token,
            };

            await fs.writeFile(config.tokenPath, JSON.stringify(payload, null, 2));
            logger.debug('Credentials saved successfully');
        } catch (error) {
            throw new Error(`Failed to save credentials: ${error.message}`);
        }
    }
}