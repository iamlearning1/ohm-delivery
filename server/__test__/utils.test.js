const utils = require('../src/utils');

const trackingId = '1e62adfe';

describe('get ohm', () => {
  test('returns correct ohm based on tracking id', async () => {
    const ohm = await utils.getOhmByTrackingId(trackingId);
    expect(ohm.trackingId).toBe(trackingId);
    expect(ohm.id).toBe('0');
    expect(ohm.history).toHaveLength(4);
  });

  test('returns undefined when no ohm found for the tracking id', async () => {
    const ohm = await utils.getOhmByTrackingId('wrong id');
    expect(ohm).toBe(undefined);
  });
});

describe('update ohm', () => {
  test('change ohm status to delivered', async () => {
    const delivered = utils.statuses[utils.statuses.length - 1][0];
    const ohm = await utils.updateOhmByTrackingId({
      trackingId,
      query: { status: delivered },
    });
    expect(ohm.status).toBe(delivered);
  });

  test('change ohm status to refused with reason', async () => {
    const refused = utils.statuses[utils.statuses.length - 1][1];
    const reason = 'not needed anymore';

    const ohm = await utils.updateOhmByTrackingId({
      trackingId,
      query: { status: refused, reason },
    });

    expect(ohm.status).toBe(refused);
    expect(ohm.reason).toBe(reason);
  });

  test('add comment in ohm order', async () => {
    const comment = 'amazing product';

    const ohm = await utils.updateOhmByTrackingId({
      trackingId,
      query: { comment },
    });

    expect(ohm.comment).toBe(comment);
  });
});

describe('create new ohm', () => {
  test('create new ohm with a valid tracking id', async () => {
    const [created] = utils.statuses;

    const ohm = await utils.getOhmByTrackingId(trackingId);

    const newOhm = await utils.createOhm(ohm);

    expect(newOhm.trackingId).not.toBe(trackingId);
    expect(newOhm.status).toBe(created);
  });
});

describe('valid status updates', () => {
  test('change status from created to in_delivery and get false for invalid status change', async () => {
    const created = utils.statuses[0];
    const in_delivery = utils.statuses[3];

    const valid = utils.validateStatus(created, in_delivery);

    expect(valid).toBe(false);
  });

  test('change status from created to preparing and get true for valid status change', async () => {
    const [created, preparing] = utils.statuses;
    const valid = utils.validateStatus(created, preparing);

    expect(valid).toBe(true);
  });
});
