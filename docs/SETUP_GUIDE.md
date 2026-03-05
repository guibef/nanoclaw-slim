# NanoClaw Setup Guide

Follow these steps to set up your own private NanoClaw assistant (e.g., Mia) on your local machine using Slack.

## 1. Prerequisites

- **Node.js 22+**
- **Docker** (Running)
- **Git**

## 2. Bootstrap the Project

Clone the repository, then run the bootstrap script to install dependencies and verify your environment:

```bash
npm install
bash setup.sh
```

## 3. Create Your Slack App

To ensure your conversations are private, you **must** create your own Slack app.

1.  Go to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App** -> **From scratch**.
2.  **Socket Mode:** Go to **Settings** -> **Socket Mode**, toggle it **On**, and generate an App-Level Token (starts with `xapp-...`). Save this.
3.  **Event Subscriptions:** Go to **Features** -> **Event Subscriptions**, toggle it **On**, and add these **Bot Events**:
    - `message.channels`
    - `message.groups`
    - `message.im`
    - Click **Save Changes**.
4.  **OAuth & Permissions:** Go to **Features** -> **OAuth & Permissions** and add these **Bot Token Scopes**:
    - `chat:write`, `channels:history`, `groups:history`, `im:history`.
5.  **Install App:** Click **Install to Workspace** at the top of the page. Copy the **Bot User OAuth Token** (starts with `xoxb-...`). Save this.

## 4. Configure Environment

Create a `.env` file in the project root:

```bash
# Assistant Identity
ASSISTANT_NAME=Mia

# LiteLLM / Claude API
ANTHROPIC_API_KEY=your-api-key
ANTHROPIC_BASE_URL=http://host.docker.internal:4000
ANTHROPIC_MODEL=gemini-3-flash-preview

# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token

# Timing
IDLE_TIMEOUT=30000
```

## 5. Build and Start

Build the project, the container agent, and start the background service:

```bash
# Build the main project
npm run build

# Build the agent container (takes a few minutes the first time)
npx tsx setup/index.ts --step container -- --runtime docker

# Start the service
# macOS:
npx tsx setup/index.ts --step service
# Linux:
systemctl --user start nanoclaw
```

## 6. Register Your Private DM

First, you need to find the **JID** (unique ID) of your private DM with the bot.

### Option A: Manual (Slack UI)

1.  Open Slack and find your new app under **Apps**.
2.  Right-click the bot's name in the sidebar -> **Copy link**.
3.  Paste the link anywhere. It looks like `https://.../archives/D0123456789`.
4.  Your JID is `slack:` followed by that last ID (e.g., `slack:D0123456789`).

### Option B: Command Line (Database)

1.  Send a message (e.g., "hello") to the bot in its DM.
2.  Run this command to find the latest active DM:
    ```bash
    sqlite3 store/messages.db "SELECT jid FROM chats WHERE jid LIKE 'slack:D%' ORDER BY last_message_time DESC LIMIT 1;"
    ```

### Finish Registration

1.  Add the resulting JID to your `.env` file:
    ```bash
    SLACK_MAIN_JID=slack:D0123456789
    ```
2.  Register the group:
    ```bash
    npx tsx scripts/register-slack.ts
    ```
3.  Restart the service:
    ```bash
    # macOS
    launchctl kickstart -k gui/$(id -u)/com.nanoclaw
    ```

## 7. Verify

Send a message in your DM. Mia should respond immediately.

To watch the logs in real-time:

```bash
tail -f logs/nanoclaw.log
```
