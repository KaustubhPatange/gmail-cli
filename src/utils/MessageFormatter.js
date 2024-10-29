export class MessageFormatter {
    static extractMessageContent(message) {
        const messagePart = message.payload.parts[0];
        if (!messagePart || !messagePart.body.data) {
            return '';
        }

        return Buffer.from(messagePart.body.data, 'base64').toString('utf-8');
    }

    static displayMessage(content) {
        console.log('-'.repeat(50));
        console.log('Message Content:');
        console.log('-'.repeat(50));
        console.log(content);
        console.log('-'.repeat(50));
    }
}