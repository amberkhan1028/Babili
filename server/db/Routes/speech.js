/* eslint-disable no-underscore-dangle */
const { Router } = require('express');
require('dotenv').config();
const speech = require('@google-cloud/speech');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');

const client = new speech.SpeechClient();
const storage = new Storage();

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const bucket = storage.bucket(process.env.GOOGLE_BUCKET);

router.post('/speech', upload.single('file'), async (req, res, next) => {
  try {
    console.warn(req.file);
    const file = await req.file;
    if (!file) {
      throw new Error('Please upload file');
    }
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream.on('error', (err) => { next(err); });
    blobStream.on('finish', async () => {
      try {
        const gcsUri = `gs://${bucket.name}/Recording (4).m4a`;
        const audio = {
          uri: gcsUri,
        };
        const config = {
          encoding: 'FLAC',
          sampleRateHertz: 44100,
          languageCode: 'en-US',
        };
        const request = {
          audio,
          config,
        };

        const [response] = await client.recognize(request);
        const transcription = response.results
          .map((result) => result.alternatives[0].transcript)
          .join('\n');

        res
          .status(200)
          .send({
            success: 'true',
            message: 'Text retrieved successfully',
            text: 'Hello Devi',
            transcript: transcription,
          })
          .end();
      } catch (e) {
        console.warn(e);
      }
    });
    blobStream.end(req.file.bufffer);
  } catch (e) {
    console.warn(e);
  }
});

module.exports = router;
