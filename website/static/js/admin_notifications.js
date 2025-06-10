// --- Notification polling for admin ---
function fetchNotifications() {
  $.get('/admin/get_notifications', function(res) {
    console.log('Notifications response:', res);
    if (res.success && res.notifications.length > 0) {
      // Count unread notifications
      var unreadCount = res.notifications.filter(function(n) { return !n.read; }).length;
      if (unreadCount > 0) {
        $('#chat-badge').show().text(unreadCount);
      } else {
        $('#chat-badge').hide();
      }
      let html = '';
      res.notifications.forEach(function(n) {
        html += `<div style='padding:8px 10px;border-bottom:1px solid #f0f0f0;'>
          <b>${n.username}</b> (<span style='font-size:12px;color:#888;'>${n.email}</span>)<br>
          <span>${n.message}</span><br>
          <span style='font-size:12px;color:${n.read ? '#888' : '#007bff'};font-weight:${n.read ? 'normal' : 'bold'};'>${n.read ? 'Read' : 'Unread'}</span>
        </div>`;
      });
      $('#chat-notification-list').html(html);
    } else {
      $('#chat-badge').hide();
      $('#chat-notification-list').html('<div style="padding:12px;color:#888;">No new messages</div>');
    }
  });
}
setInterval(fetchNotifications, 5000); // Poll every 5s
fetchNotifications();

$('#chat-modal-btn').on('click', function(e) {
  e.stopPropagation();
  // Mark all notifications as read when opening dropdown
  $.post('/admin/mark_notifications_read', function(res) {
    if (res.success) {
      fetchNotifications(); // Refresh notifications after marking as read
    }
  });
  $('#chat-notification-dropdown').toggle();
});
$('#close-chat-dropdown').on('click', function() {
  $('#chat-notification-dropdown').hide();
});
$(document).on('click', function(e) {
  if (!$(e.target).closest('#chat-notification-dropdown, #chat-modal-btn').length) {
    $('#chat-notification-dropdown').hide();
  }
});
