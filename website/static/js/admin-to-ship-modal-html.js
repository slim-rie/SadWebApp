// This file injects the To Ship Order Modal HTML into the admin dashboard when needed.
// Call injectToShipModalHtml() after DOMContentLoaded if the modal is not present.

function injectToShipModalHtml() {
  if (document.getElementById('toShipModal')) return; // Prevent duplicate
  const modalHtml = `
  <div class="modal fade" id="toShipModal" tabindex="-1" role="dialog" aria-labelledby="toShipModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <form id="toShipForm">
          <input type="hidden" id="toShipOrderId" name="order_id">
          <div class="modal-header">
            <h5 class="modal-title" id="toShipModalLabel">Update Shipping Details</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="courierSelect">Courier</label>
              <select class="form-control" id="courierSelect" name="courier" required>
                <option value="">Select Courier</option>
                <option value="J&T">J&T</option>
                <option value="LBC">LBC</option>
                <option value="Ninja Van">Ninja Van</option>
                <option value="JRS">JRS</option>
                <option value="Other">Other</option>
              </select>
              <div class="invalid-feedback">Please select a courier.</div>
            </div>
            <div class="form-group">
              <label for="referenceInput">Reference Number</label>
              <input type="text" class="form-control" id="referenceInput" name="reference_number" required maxlength="32">
              <div class="invalid-feedback">Reference number is required.</div>
            </div>
            <div class="form-group">
              <label for="trackingStatusSelect">Tracking Status</label>
              <select class="form-control" id="trackingStatusSelect" name="tracking_status" required>
                <option value="">Select Status</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              <div class="invalid-feedback">Please select a tracking status.</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Save</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Auto-inject on DOMContentLoaded (admin dashboard only)
document.addEventListener('DOMContentLoaded', injectToShipModalHtml);
