import {args} from "./cli";

const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const {authenticate} = require("@google-cloud/local-auth");
const {google} = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = args.credentials || path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}


async function getProfile(gmail) {
    const profile = await gmail.users.getProfile({userId: "me"});
    return profile.data
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function getMessages(auth) {
    const gmail = google.gmail({version: "v1", auth});

    const messagesRes = await gmail.users.messages.list({userId: "me"});
    const messages = messagesRes.data.messages;


    let m = await gmail.users.messages.get({userId: "me", id: messages[0].id});

    let base64String = m.data.payload.parts[1].body.data;
    let text = Buffer.from(base64String, 'base64').toString('utf-8')
    console.log(text);


    // const threads = await gmail.users.threads.list({
    //     userId: "me",
    // });

    // console.log(threads.data);


}

const clientAuth = authorize()

export async function gg() {
    const auth = await clientAuth;
    return google.gmail({version: "v1", auth});
}


export function forEachTake(array, count, callback) {
    for (let i = 0; i < Math.min(count, array.length); i++) {
        callback(array[i]);
    }
}