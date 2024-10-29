# Gmail CLI

A command-line interface for accessing Gmail, built with Bun and the Gmail API. Efficiently manage and read your Gmail messages directly from the terminal.

## Prerequisites

- [Bun](https://bun.sh) (v1.0.0 or higher)
- Gmail API Credentials (see [Setup](#setup))
- macOS or Linux operating system

## Setup

### 1. Install Bun

```bash
# macOS or Linux
curl -fsSL https://bun.sh/install | bash
```

### 2. Install Dependencies

Clone the repository and install dependencies:

```bash
git clone https://github.com/EsmaeelNabil/gmail-cli
cd gmail-cli
bun install
```

### 3. Gmail API Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API:
    - Go to "APIs & Services" > "Library"
    - Search for "Gmail API"
    - Click "Enable"
4. Set up credentials:
    - Go to "APIs & Services" > "Credentials"
    - Click "Create Credentials" > "OAuth client ID"
    - Choose "Desktop app" as the application type
    - Name your client
    - Download the JSON file
5. Save the downloaded JSON file as `credentials.json` in `~/.config/gmail/`

Your credentials file should look similar to this:
```json
{
  "installed": {
    "client_id": "your-client-id.apps.googleusercontent.com",
    "project_id": "your-project-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_type": "https://oauth2.googleapis.com/token",
    "client_secret": "your-client-secret",
    "redirect_uris": ["http://localhost"]
  }
}
```

## Usage

### Basic Commands

```bash
# Read latest 5 messages (default)
bun src/gmail.js

# Read specific number of messages
bun src/gmail.js -m 10

# Use custom credentials file location
bun src/gmail.js -c /path/to/credentials.json

# Enable debug logging
bun src/gmail.js --debug
```

### Command Line Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--count` | `-m` | Number of messages to fetch | 5 |
| `--credentials` | `-c` | Path to credentials file | `./credentials.json` |
| `--debug` | | Enable debug logging | `false` |
| `--help` | | Show help | |
| `--version` | | Show version | |

### First Run

On first run, the application will:
1. Open your default browser
2. Ask you to login to your Google account
3. Request permission to access your Gmail
4. Save the authentication token locally in `token.json`

Subsequent runs will use the saved token.

## Build From Source

To build a standalone binary:

```bash
# Make the release script executable
chmod +x release.sh

# Build the binary
./release.sh gmail-client src/gmail.js

# The binary will be created in the current directory
./gmail-client
```

## Project Structure

```
gmail-cli/
├── src/
│   ├── gmail.js           # Main entry point
│   ├── cli.js            # CLI argument handling
│   ├── services/         # Core services
│   ├── auth/            # Authentication handling
│   ├── config/          # Configuration management
│   └── utils/           # Utility functions
├── credentials.json     # Gmail API credentials
├── token.json          # Generated auth token
├── release.sh          # Build script
└── package.json        # Project dependencies
```

## Security Notes

- `credentials.json` and `token.json` contain sensitive information
- Never commit these files to version control
- Keep these files secure on your local machine
- Added them to `.gitignore`

## Troubleshooting

### Token Issues
If you experience authentication issues:
1. Delete `token.json`
2. Run the application again
3. Complete the authentication flow

### Permission Issues
Ensure your Google Cloud Project has:
- Gmail API enabled
- Valid OAuth 2.0 credentials
- Correct application type (Desktop)

### Build Issues
Make sure:
- Bun is installed and in PATH
- `release.sh` is executable
- You're on a supported platform (macOS/Linux)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[MIT License](LICENSE)

## Support

For issues and feature requests, please [open an issue](../../issues) on GitHub.
