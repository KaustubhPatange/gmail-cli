#!/bin/bash
set -e

APP_NAME=$1
APP_ENTRY_POINT=$2

if [ -z "$APP_NAME" ] || [ -z "$APP_ENTRY_POINT" ]; then
    echo "Usage: $0 <app-name> <entry-point>"
    echo "Example: $0 gmail-client src/gmail.js"
    exit 1
fi

echo "Building $APP_NAME..."

# Determine platform-specific build settings
case "$(uname -s)" in
    Darwin*)
        PLATFORM="darwin"
        ARCH="arm64"
        if [ "$(uname -m)" = "x86_64" ]; then
            ARCH="x64"
        fi
        TARGET="bun-darwin-${ARCH}"
        ;;
    Linux*)
        PLATFORM="linux"
        ARCH="x64"
        if [ "$(uname -m)" = "aarch64" ]; then
            ARCH="arm64"
        fi
        TARGET="bun-linux-${ARCH}"
        ;;
    *)
        echo "Unsupported platform: $(uname -s)"
        exit 1
        ;;
esac

echo "Building for $PLATFORM-$ARCH..."

# Perform the build
bun build \
    --compile \
    --target="$TARGET" \
    "$APP_ENTRY_POINT" \
    --outfile "$APP_NAME"

# Make the binary executable
chmod +x "$APP_NAME"

echo "Build completed successfully!"
echo "Binary location: $(pwd)/$APP_NAME"