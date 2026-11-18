import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildReport, notify, withAudit, assertSenderContract } from './notifications.ts';

test('a report ignores incomplete visits and sorts completed IDs', () => {
  assert.equal(buildReport([
    { id: 'v2', complete: true }, { id: 'v0', complete: false }, { id: 'v1', complete: true },
  ]), 'Completed visits: v1, v2');
});

test('channel selection changes the collaborator, not the report rule', async () => {
  const recorded = [];
  const sender = (channel) => async (message) => {
    recorded.push({ channel, message });
    return { receipt: `${channel}-1` };
  };
  const recipients = { email: sender('email'), inbox: sender('inbox') };
  assert.deepEqual(await notify([{ id: 'v1', complete: true }], recipients.email), { receipt: 'email-1' });
  assert.deepEqual(await notify([{ id: 'v1', complete: true }], recipients.inbox), { receipt: 'inbox-1' });
  assert.equal(recorded[0].message, recorded[1].message);
});

test('audit wraps delivery once and preserves its receipt', async () => {
  const events = [];
  let calls = 0;
  const sender = withAudit(async () => { calls++; return { receipt: 'r1' }; }, (event) => events.push(event));
  assert.deepEqual(await sender('report'), { receipt: 'r1' });
  assert.equal(calls, 1);
  assert.deepEqual(events, [{ outcome: 'sent', receipt: 'r1' }]);
});

test('failed delivery stays failed and is audited without message contents', async () => {
  const events = [];
  const failure = new Error('transport unavailable');
  const sender = withAudit(async () => { throw failure; }, (event) => events.push(event));
  await assert.rejects(sender('private report'), (error) => error === failure);
  assert.deepEqual(events, [{ outcome: 'failed' }]);
});

test('sender substitution requires a receipt, not merely a matching method shape', async () => {
  await assertSenderContract(async () => ({ receipt: 'valid' }));
  await assert.rejects(assertSenderContract(async () => ({ receipt: '' })), /receipt/);
});
