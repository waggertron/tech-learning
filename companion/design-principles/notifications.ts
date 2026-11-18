export type Visit = Readonly<{ id: string; complete: boolean }>;
export type Delivery = Readonly<{ receipt: string }>;
export type Sender = (message: string) => Promise<Delivery>;
export type AuditEvent =
  | Readonly<{ outcome: 'sent'; receipt: string }>
  | Readonly<{ outcome: 'failed' }>;

export function buildReport(visits: readonly Visit[]): string {
  const ids = visits.filter((visit) => visit.complete).map((visit) => visit.id).sort();
  return `Completed visits: ${ids.join(', ') || 'none'}`;
}

export async function notify(visits: readonly Visit[], send: Sender): Promise<Delivery> {
  return send(buildReport(visits));
}

export function withAudit(send: Sender, record: (event: AuditEvent) => void): Sender {
  return async (message) => {
    let delivery: Delivery;
    try {
      delivery = await send(message);
    } catch (error) {
      record({ outcome: 'failed' });
      throw error;
    }
    record({ outcome: 'sent', receipt: delivery.receipt });
    return delivery;
  };
}

export async function assertSenderContract(send: Sender): Promise<void> {
  const delivery = await send('contract probe');
  if (typeof delivery.receipt !== 'string' || delivery.receipt.trim() === '') {
    throw new Error('Successful delivery requires a nonempty receipt');
  }
}
