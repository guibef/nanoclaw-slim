import { initDatabase, setRegisteredGroup } from '../src/db.js';
import { ASSISTANT_NAME } from '../src/config.js';

const jid = 'slack:C0AJ8GT1JJ0';
const name = 'all-frideg-ai';

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
