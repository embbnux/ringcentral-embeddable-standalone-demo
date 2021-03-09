// set window opened flag
localStorage.setItem('standalone-widget-opened', 1);

window.addEventListener('unload', function() {
  localStorage.removeItem('standalone-widget-opened');
});

var notificationEnabled = false;
function requireNotificationPermission() {
  if (!window.Notification) {
    console.warn('This browser does not support system notifications.')
    return;
  }
  if (notificationEnabled) {
    return;
  }
  if (window.Notification.permission !== 'denied') {
    window.Notification.requestPermission(function () {
      if (window.Notification.permission === 'granted') {
        notificationEnabled = true;
      }
    });
  }
}

function createDesktopNotification(options) {
  if (!notificationEnabled) {
    console.warn('Notifications is not enabled');
    return;
  }
  const n = new window.Notification(
    options.title, { body: options.text, icon: options.icon }
  );
  n.onclick = options.onClick;
}

window.addEventListener('message', (e) => {
  const data = e.data;
  if (data) {
    localStorage.setItem('message-transport-key', JSON.stringify(data));
    localStorage.removeItem('message-transport-key');
  }
  if (data.type === 'rc-call-ring-notify') {
    createDesktopNotification({
      title: 'New Call',
      text: 'New Call from ' + (data.call.fromUserName || data.call.from),
      onClick: function() {
        window.focus();
      };
    })
  }
});

window.addEventListener('storage', function(event) {
  if (event.key === 'standalone-widget-focus') {
    setTimeout(window.focus, 50);
    return;
  }
  if (event.key === 'widget-command-key' && event.newValue && event.newValue !== '') {
    document.querySelector("#rc-widget-adapter-frame").contentWindow.postMessage(JSON.parse(event.newValue), '*');
  }
});

requireNotificationPermission();
