const shortid = require('shortid');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');
const config = require('../db.config.json');

// alternate approach, thought of it later on, so just adding here
// const validateStatus = (oldStatus, newStatus) => {
//   const statuses = {
//     CREATED: 1,
//     PREPARING: 2,
//     READY: 3,
//     IN_DELIVERY: 4,
//     DELIVERED: 5,
//     REFUSED: 6,
//   };

//   const oldStatusValue = statuses[oldStatus];
//   const newStatusValue = statuses[newStatus];

//   // checks if old status comes after new status
//   if (oldStatusValue >= newStatusValue) return false;

//   /* checks if new status doesn't directly preceed old status
//    and there is difference of more than one */
//   if (newStatusValue - oldStatusValue > 1) return false;

//   return true;
// };

const statuses = [
  'CREATED',
  'PREPARING',
  'READY',
  'IN_DELIVERY',
  ['DELIVERED', 'REFUSED'],
];

const validateStatus = (oldStatus, newStatus) => {
  let oldStatusIndex;
  let newStatusIndex;

  statuses.forEach((status, index) => {
    if (typeof status === 'string') {
      if (status === oldStatus) oldStatusIndex = index;
      if (status === newStatus) newStatusIndex = index;
    } else {
      const [delivered, refused] = statuses[statuses.length - 1];

      if (delivered === oldStatus || refused === oldStatus)
        oldStatusIndex = index;

      if (delivered === newStatus || refused === newStatus)
        newStatusIndex = index;
    }
  });

  // checks if old status comes after new status
  if (oldStatusIndex >= newStatusIndex) return false;

  /* checks if new status doesn't directly preceed old status
   and there is difference of more than one */
  if (newStatusIndex - oldStatusIndex > 1) return false;

  return true;
};

const db = (async () => {
  const _db = await low(adapter);
  await _db.defaults(config).write();
  return _db;
})();

async function getOhmByTrackingId(trackingId) {
  const _db = await db;
  const ohm = _db.get('ohms').find({ trackingId }).value();

  return ohm;
}

async function updateOhmByTrackingId({ trackingId, query }) {
  const _db = await db;
  const ohm = _db
    .get('ohms')
    .find({ trackingId })
    .assign({
      ...query,
    })
    .write();

  return ohm;
}

async function createOhm(data) {
  const _db = await db;
  const trackingId = shortid.generate();

  _db
    .get('ohms')
    .push({ ...data, trackingId, status: 'CREATED', comment: '', reason: '' })
    .write();

  return getOhmByTrackingId(trackingId);
}

module.exports = {
  getOhmByTrackingId,
  updateOhmByTrackingId,
  validateStatus,
  createOhm,
  statuses,
};
