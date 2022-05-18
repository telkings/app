console.log('Custom service worker!');

self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

///////////////////////////////////////////////

// self.addEventListener('push', e => {
//   const data = e.data.json();
//   console.log(data)
//   console.log('Notification Received');
//   e.waitUntil(self.registration.showNotification(data.title, {
//     body: data.message,
//     icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Archlinux-icon-crystal-64.svg/1024px-Archlinux-icon-crystal-64.svg.png'
//   }));
// });

self.addEventListener('push', function (event) {
  const data = event.data.json();
  event.waitUntil(self.clients.matchAll().then(function (clientList) {
    var focused = clientList.some(function (client) {
      return client.focused;
    });

    var notificationMessage;
    if (focused) {
      notificationMessage = 'Estás en la pagina telkings';
    } else if (clientList.length > 0) {
      notificationMessage = 'No haz cerrado la página, ' +
        'click para enfocarla!';
    } else {
      notificationMessage = 'Cerraste la pagina, ' +
        'click aqui para abir la página nuevamente!';
    }

    return self.registration.showNotification(data.title, {
      body: data.message,
      icon: 'icon.png',
      vibrate: [500, 100, 500],
    });
  })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.waitUntil(self.clients.matchAll().then(function (clientList) {
    if (clientList.length > 0) {
      return clientList[0].focus();
    }
    return self.clients.openWindow('/perfil');
  })
  );
});

self.addEventListener('pushsubscriptionchange', function (event) {
  console.log('Subscription expired');
  event.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true })
      .then(function (subscription) {
        console.log('Subscribed after expiration', subscription.endpoint);
        return fetch('subscription', {
          method: 'post',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          })
        });
      })
  );
});