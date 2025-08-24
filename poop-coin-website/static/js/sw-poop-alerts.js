self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Site Alert';
  const options = {
    body: data.body || 'New alert!',
    icon: data.icon || '/static/images/arena_logo.png',
    badge: '/static/images/arena_logo.png',
    data: data.url || '/' // Optional: click to open
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    );
  }
});
