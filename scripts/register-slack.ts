import { initDatabase, setRegisteredGroup } from '../src/db.js';
import { ASSISTANT_NAME } from '../src/config.js';
import { readEnvFile } from '../src/env.js';

// Read Slack JID from .env
const env = readEnvFile(['SLACK_MAIN_JID']);
const jid = env.SLACK_MAIN_JID;

if (!jid) {
  console.error('Error: SLACK_MAIN_JID not set in .env');
  process.exit(1);
}

const name = `My DM with ${ASSISTANT_NAME}`;

initDatabase();

setRegisteredGroup(jid, {
  name: name,
  folder: 'slack_main',
  trigger: `@${ASSISTANT_NAME}`,
  added_at: new Date().toISOString(),
  requiresTrigger: false,
  isMain: true,
});

console.log(`Registered Slack group: ${name} (${jid})`);
