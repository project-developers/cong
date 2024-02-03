const CACHE_NAME = 'offline-first-cache-v1';

self.addEventListener('install', (event) => {
    // Precache essential assets during installation
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/offline.html',
                '/js/html2pdf.bundle.js',
                '/js/indexedDB.js',
                '/js/jszip.min.js',
                '/js/mammoth.browser.min.js',
                '/js/pdf-lib.js',
                '/js/script.js',
                '/js/vue.js',
                '/css/style.css',
                '/fonts/Helvetica Roman.ttf',
                '/service-worker.js',
                '/icons/icon-152.png',
                '/icons/icon-512.png',
                '/arrow.png',
                '/favicon.ico',
                'https://cdn.jsdelivr.net/npm/ol@v8.2.0/dist/ol.js',
                'https://html2canvas.hertzen.com/dist/html2canvas.js',
                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js',
                'https://cdn.jsdelivr.net/npm/ol@v8.2.0/ol.css',
                'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css',
                'https://fonts.googleapis.com/css?family=Raleway',
                'https://www.w3schools.com/w3css/4/w3.css',
                '/cong.webmanifest',
            ]).catch((error) => {
                console.error('Failed to cache resources:', error);
                throw error; // Propagate the error to reject the install event
            });
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Intercept network requests and serve from cache if available
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            return response || fetch(event.request);
        })
        .catch(() => {
            // If both cache and network fail, serve a fallback response
            return new Response('Offline content');
        })
    );
});
