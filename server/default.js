import path from 'path';
import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '..', 'dist');

app.use(compression());

app.use((req, res, next) => {
    res.header('Cross-Origin-Embedder-Policy', 'require-corp');
    res.header('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

app.use(
    express.static(publicPath, {
        setHeaders(res, filePath) {
            if (filePath.endsWith('.html') || filePath.endsWith('manifest.json')) {
                res.setHeader('Cache-Control', 'public, max-age=0');
            } else if (filePath.includes('favicon')) {
                res.setHeader('Cache-Control', 'public, max-age=86400');
            } else {
                res.setHeader('Cache-Control', 'public, max-age=31536000');
            }
        },
    })
);

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});
