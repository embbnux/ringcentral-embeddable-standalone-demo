// open rc widget window
function openRingCentralWidget() {
  var opened = localStorage.getItem('standalone-widget-opened');
  var windowFeatures = 'menubar=no,location=no, scrollbars=yes, width=' + 300 + ', height=' + 520;
  if (opened) {
    setTimeout(window.blur, 0);
    localStorage.setItem('standalone-widget-focus', Date.now());
    return;
  }
  window.open('./standalone-widget.html', 'embeddable-standalone-widget', windowFeatures)
}

// handle rc widget event
function onRingCentralWidgetMessageEvent(data) {
  console.log(data);
  switch (data.type) {
    case 'rc-call-ring-notify':
      // get call when user gets a ringing call
      console.log('ringing call:', data.call);
      openRingCentralWidget();
      break;
    case 'rc-call-init-notify':
      // get call when user creates a call from dial
      console.log(data.call);
      break;
    case 'rc-call-start-notify':
      // get call when a incoming call is accepted or a outbound call is connected
      console.log(data.call);
      break;
    case 'rc-call-hold-notify':
      // get call when user holds a call
      console.log(data.call);
      break;
    case 'rc-call-resume-notify':
      // get call when user unholds call
      console.log(data.call);
      break;
    case 'rc-call-end-notify':
      // get call on call end event
      console.log(data.call);
      break;
    default:
      break;
  }
}

// send message to rc widget by storage
function setMessageToRingCentralWidget(message) {
  localStorage.setItem('widget-command-key', JSON.stringify(message));
  localStorage.removeItem('widget-command-key');
}

var openAppBtn = document.getElementById('open-app-btn');
openAppBtn.addEventListener('click', function() {
  openRingCentralWidget();
});

// listen message from standalone window
window.addEventListener('storage', function(event) {
  if (event.key === 'message-transport-key' && event.newValue && event.newValue !== '') {
    onRingCentralWidgetMessageEvent(JSON.parse(event.newValue));
  }
});

// Listen for click to dial
document.addEventListener('click', function (event) {
  var target = event.target;
  if (!target) {
    return;
  }
  if (target && !target.href) {
    target = target.parentElement;
  }
  if (target && !target.href) {
    target = target.parentElement;
  }
  if (!target) {
    return;
  }
  if (target.matches('a[href^="sms:"]')) {
    event.preventDefault();
    var hrefStr = target.href;
    var pathStr = hrefStr.split('?')[0];
    var phoneNumber = pathStr.replace(/[^\d+*-]/g, '');
    setMessageToRingCentralWidget({
      type: 'rc-adapter-new-sms',
      phoneNumber: phoneNumber,
    });
    openRingCentralWidget();
  } else if (target.matches('a[href^="tel:"]')) {
    event.preventDefault();
    var hrefStr = target.href;
    var phoneNumber = hrefStr.replace(/[^\d+*-]/g, '');
    setMessageToRingCentralWidget({
      type: 'rc-adapter-new-call',
      phoneNumber: phoneNumber,
      toCall: false,
    });
    openRingCentralWidget();
  }
}, false);
