const shortid = require('shortid');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const Utils = require('./utils');

var app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/ohms/:id', async (req, res) => {
  try {
    const ohm = await Utils.getOhmByTrackingId(req.params.id);
    if (!ohm) throw new Error('Ohm not found');

    return res.send(ohm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/ohms/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const ohm = await Utils.getOhmByTrackingId(id);

    if (!ohm) throw new Error('Ohm not found');

    const newOhm = await Utils.createOhm(ohm);

    return res.send(newOhm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/ohms/:id', async (req, res) => {
  const { id } = req.params;
  const { status, reason = '' } = req.body;

  try {
    const oldOhm = await Utils.getOhmByTrackingId(id);

    if (!oldOhm) throw new Error('Ohm not found');

    if (oldOhm.status === status)
      throw new Error('New status and old status are same');

    const validated = Utils.validateStatus(oldOhm.status, status);

    if (!validated) throw new Error('Status flow is not correct');

    const ohm = await Utils.updateStatusByTrackingId({
      trackingId: id,
      status,
      reason,
    });

    return res.send(ohm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(3000, () => console.log('listening on port 3000'));
