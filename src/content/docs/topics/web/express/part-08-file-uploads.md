---
title: "Part 8, File uploads"
description: "Multer for multipart/form-data, file size and type validation, serving static files, and streaming large files to avoid memory exhaustion."
parent: express
tags: [express, nodejs, javascript, web, backend, uploads, multer, files]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## How file uploads work over HTTP

File uploads use `multipart/form-data`, a content type that interleaves text fields and binary file data in a single request body. Express's built-in `express.json()` does not parse this format. You need dedicated middleware.

Multer is the standard choice:

```bash
npm install multer
```

## Disk storage vs memory storage

Multer offers two storage engines:

**Memory storage** buffers the file entirely in RAM as a `Buffer`. Simple, but dangerous for large files or high concurrency.

**Disk storage** streams the file directly to disk as it arrives. Use this for anything that might be large.

### Memory storage (small files only)

```javascript
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});
```

`req.file.buffer` contains the raw bytes. Useful when you immediately pass the file to an external service (S3, image processor) without touching disk.

### Disk storage

```javascript
const multer = require('multer');
const path = require('path');
const { randomUUID } = require('crypto');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // directory must exist
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${randomUUID()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 5,                    // max 5 files per request
  },
});
```

Use a UUID for the filename: it prevents collisions and avoids path traversal attacks from malicious `originalname` values.

## File type validation

Multer's `fileFilter` callback runs before writing the file. Reject unwanted types early:

```javascript
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);   // accept
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`), false); // reject
    }
  },
});
```

The `file.mimetype` is what the client reports. Do not rely on it alone for security. After upload, verify the actual magic bytes:

```bash
npm install file-type
```

```javascript
const { fileTypeFromBuffer } = require('file-type');

app.post('/upload', upload.single('avatar'), async (req, res) => {
  const detected = await fileTypeFromBuffer(req.file.buffer);
  if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
    return res.status(422).json({ error: 'File content does not match claimed type' });
  }
  // proceed
});
```

## Single file upload

```javascript
// upload.single('fieldName') handles one file from a field named 'fieldName'
app.post('/upload/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    path: `/files/${req.file.filename}`,
  });
});
```

Test with curl:

```bash
curl -X POST http://localhost:3000/upload/avatar \
  -F "avatar=@/path/to/photo.jpg"
```

## Multiple file upload

```javascript
// upload.array('photos', 10): up to 10 files from field 'photos'
app.post('/upload/photos', upload.array('photos', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const uploaded = req.files.map((file) => ({
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    url: `/files/${file.filename}`,
  }));

  res.status(201).json({ files: uploaded });
});
```

Mixed fields (file plus text in the same form):

```javascript
// upload.fields(): specify each field individually
app.post(
  '/upload/document',
  upload.fields([
    { name: 'document', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  (req, res) => {
    const doc = req.files['document']?.[0];
    const thumb = req.files['thumbnail']?.[0];
    const { title, description } = req.body; // text fields still in req.body

    res.json({ doc: doc?.filename, thumb: thumb?.filename, title, description });
  }
);
```

## Serving static files

After upload, serve files from the uploads directory:

```javascript
const path = require('path');

// Serve /files/... from the uploads/ directory
app.use('/files', express.static(path.join(__dirname, 'uploads')));
```

For production: serve files from object storage (S3, GCS, Cloudflare R2) and have Express return signed URLs rather than serving the bytes itself. Express is not an efficient static file server at scale.

## Streaming large files

For downloads of large files (CSV exports, video, archives), stream from disk rather than loading into memory:

```javascript
const fs = require('fs');
const path = require('path');

app.get('/files/:filename', (req, res) => {
  const filename = path.basename(req.params.filename); // prevent path traversal
  const filePath = path.join(__dirname, 'uploads', filename);

  // Check existence before streaming
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const stat = fs.statSync(filePath);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  const stream = fs.createReadStream(filePath);
  stream.on('error', (err) => {
    if (!res.headersSent) res.status(500).json({ error: 'Read error' });
  });
  stream.pipe(res);
});
```

`path.basename` strips any directory components from the filename, blocking path traversal (`../../etc/passwd`).

## Range requests for video

Browsers expect range requests for video (`<video>` tag):

```javascript
app.get('/videos/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(__dirname, 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Not found' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });

    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    });
    fs.createReadStream(filePath).pipe(res);
  }
});
```

## Error handling for Multer

Multer throws its own error types. Handle them in the error handler:

```javascript
const multer = require('multer');

function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: `Unexpected field: ${err.field}` });
    }
    return res.status(400).json({ error: err.message });
  }

  // fileFilter rejection
  if (err.message?.startsWith('Unsupported file type')) {
    return res.status(415).json({ error: err.message });
  }

  next(err);
}
```

## Cleaning up failed uploads

If processing fails after Multer writes the file, clean up:

```javascript
app.post('/upload/avatar', upload.single('avatar'), async (req, res, next) => {
  try {
    const result = await processImage(req.file.path); // might throw
    res.json({ url: result.url });
  } catch (err) {
    // Delete the uploaded file so it doesn't accumulate garbage
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {}); // best-effort, ignore errors
    }
    next(err);
  }
});
```

## Gotchas

- **Upload directory must exist.** Multer does not create the destination directory. Create it at startup or use `fs.mkdirSync('uploads', { recursive: true })`.
- **MIME type spoofing.** Clients can send any `Content-Type`. Always validate magic bytes for security-sensitive uploads.
- **Memory storage OOM.** Memory storage is dangerous for files over a few MB under any real concurrency. Default to disk storage.
- **`req.body` with multipart.** Text fields in a multipart form are available in `req.body` after Multer parses the request. `express.json()` does not run for multipart requests.
- **Serving uploads directly.** Do not serve user-uploaded files from the same origin as your app without scanning them. A malicious HTML file served from your domain can run scripts in the context of your origin.

## What's next

Part 9 covers testing with Jest and Supertest: integration tests for every route, mocking database calls, and setting up a test database.

## References

- [Multer on npm](https://www.npmjs.com/package/multer)
- [file-type on npm](https://www.npmjs.com/package/file-type)
- [Node.js fs.createReadStream](https://nodejs.org/api/fs.html#fscreatereadstreampath-options)

## Related topics

- [Part 7, Validation and error handling](./part-07-validation-and-errors/)
- [Part 9, Testing](./part-09-testing/)
- [Part 10, Production](./part-10-production/)
