ALTER TABLE orders
ADD COLUMN cancellation_requested_by VARCHAR(50) AFTER cancellation_reason;