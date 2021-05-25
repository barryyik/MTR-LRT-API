const staticCacheName = 'site-static-v5'
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/getResponse.js',
    '/js/main.js',
    '/js/multi-lang.js',
    '/styles/style.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0'
]

// install service worker
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets)
        })
    )
})

// activate event
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key)))
        })
    )
})

// fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request)
        }).catch(() => {
            if (evt.request.url.indexOf('https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule?station_id=') > -1) {
                let myBlob = new Blob()
                return new Response(myBlob, {"status": 599})
            }
        })
    )
})