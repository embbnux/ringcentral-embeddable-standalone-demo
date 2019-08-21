// set window opened flag
localStorage.setItem('standalone-widget-opened', 1);

window.addEventListener('unload', function() {
  localStorage.removeItem('standalone-widget-opened');
});

window.addEventListener('message', (e) => {
  const data = e.data;
  if (data) {
    localStorage.setItem('message-transport-key', JSON.stringify(data));
    localStorage.removeItem('message-transport-key');
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
