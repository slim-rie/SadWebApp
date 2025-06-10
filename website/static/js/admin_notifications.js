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
      res.notifications.forEach(function(n, idx) {
        html += `<div class='notif-item' data-idx='${idx}' style='cursor:pointer;padding:8px 10px;border-bottom:1px solid #f0f0f0;background:${n.read ? '#fff' : '#eef6ff'};'>
          <b>${n.username}</b> (<span style='font-size:12px;color:#888;'>${n.email}</span>)<br>
          <span>${n.message}</span><br>
          <span style='font-size:12px;color:${n.read ? '#888' : '#007bff'};font-weight:${n.read ? 'normal' : 'bold'};'>${n.read ? 'Read' : 'Unread'}</span>
        </div>`;
      });
      $('#chat-notification-list').html(html);

      // Click handler for notification details modal
      $('.notif-item').off('click').on('click', function() {
        var idx = $(this).data('idx');
        var notif = res.notifications[idx];
        // Mark as read
        $.post('/admin/mark_notification_read/' + idx, function(resp) {
          if (resp.success) {
            fetchNotifications();
          }
        });
        // Show modal with details
        var modalHtml = `<div id='notifDetailModal' style='position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);z-index:10000;display:flex;align-items:center;justify-content:center;'>
          <div style='background:#fff;padding:24px 28px;border-radius:8px;min-width:340px;max-width:90vw;box-shadow:0 6px 32px rgba(0,0,0,0.18);position:relative;'>
            <div style='font-weight:bold;font-size:18px;margin-bottom:8px;'>Subject: ${notif.subject || 'General Inquiry'}</div>
            <div style='font-size:13px;color:#888;margin-bottom:12px;'>${notif.timestamp || ''}</div>
            <div style='margin-bottom:8px;'><b>From:</b> ${notif.username} (${notif.email})</div>
            ${notif.order_id ? `<div style='margin-bottom:8px;'><b>Order ID:</b> ${notif.order_id}</div>` : ''}
            ${notif.products ? `<div style='margin-bottom:8px;'><b>Product(s):</b> ${notif.products}</div>` : ''}
            ${notif.product && !notif.products ? `<div style='margin-bottom:8px;'><b>Product:</b> ${notif.product}</div>` : ''}
            <div style='margin-bottom:12px;'><b>Message:</b><br>${notif.message}</div>
            <button id='closeNotifDetail' class='btn btn-sm btn-secondary' style='margin-top:6px;'>Close</button>
          </div>
        </div>`;
        $('body').append(modalHtml);
        $('#closeNotifDetail').on('click', function() {
          $('#notifDetailModal').remove();
        });
      });
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
  // Only toggle dropdown, do not mark all as read
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
