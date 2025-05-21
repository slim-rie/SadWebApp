// Show the Add Product modal when the Add button is clicked
// Assumes the Add button has id 'product-add-btn' and modal has id 'addProductModal'
document.addEventListener('DOMContentLoaded', function() {
    const addProductBtn = document.getElementById('product-add-btn');
    const addProductModal = document.getElementById('addProductModal');
    if (addProductBtn && addProductModal) {
        addProductBtn.addEventListener('click', function() {
            if (typeof $ !== 'undefined' && $(addProductModal).modal) {
                $(addProductModal).modal('show');
            } else {
                addProductModal.style.display = 'block';
            }
        });
    }
});
