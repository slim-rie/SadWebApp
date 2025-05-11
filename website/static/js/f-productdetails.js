document.addEventListener('DOMContentLoaded', function () {
    const productDatabase = {
        "China Cotton 135 GSM": {
            brand: "Cotton",
            price: 89.75,
            rating: 4.8,
            sold: "800",
            mainImage: "/static/pictures/China Cotton 135 GSM.png",
            images: [
                "/static/pictures/China Cotton 135 GSM.png"
            ],
            description: "High-quality China Cotton fabric with 135 GSM, perfect for various textile applications.",
            specifications: [
                { label: "Material", value: "Cotton" },
                { label: "GSM", value: "135" },
                { label: "Width", value: "1.5 meters" }
            ],
            stock: 50,
            color: "White",
            reviews: [
                {
                    username: "Jane Doe",
                    rating: 5,
                    comment: "Excellent quality fabric! Highly recommended.",
                    media: ["images/review1.jpg"]
                },
                {
                    username: "John Smith",
                    rating: 4,
                    comment: "Good fabric, but delivery was delayed.",
                    media: []
                }
            ]
        },
        "China Cotton 165 GSM": {
            brand: "Cotton",
            price: 6299.99,
            rating: 4.2,
            sold: "545",
            mainImage: "images/China Cotton 165 GSM.png",
            images: [
                "images/China Cotton 165 GSM.png"
            ],
            description: "Durable and versatile China Cotton fabric with 165 GSM, ideal for garments and upholstery.",
            specifications: [
                { label: "Material", value: "Cotton" },
                { label: "GSM", value: "165" },
                { label: "Width", value: "1.5 meters" }
            ],
            stock: 30,
            color: "White",
            reviews: [
                {
                    username: "Alice Brown",
                    rating: 5,
                    comment: "Perfect for my sewing projects!",
                    media: []
                }
            ]
        },
        "China Cotton 185 GSM": {
            brand: "Cotton",
            price: 150.99,
            rating: 3.5,
            sold: "320",
            mainImage: "images/China Cotton 185 GSM.png",
            images: [
                "images/China Cotton 185 GSM.png"
            ],
            description: "Premium China Cotton fabric with 185 GSM, suitable for high-quality textile projects.",
            specifications: [
                { label: "Material", value: "Cotton" },
                { label: "GSM", value: "185" },
                { label: "Width", value: "1.5 meters" }
            ],
            stock: 20,
            color: "White",
            reviews: []
        },
        "China Cotton 200 GSM": {
            brand: "Cotton",
            price: 22.50,
            rating: 4.0,
            sold: "682",
            mainImage: "images/China Cotton 200 GSM.png",
            images: [
                "images/China Cotton 200 GSM.png"
            ],
            description: "Heavyweight China Cotton fabric with 200 GSM, perfect for durable textile needs.",
            specifications: [
                { label: "Material", value: "Cotton" },
                { label: "GSM", value: "200" },
                { label: "Width", value: "1.5 meters" }
            ],
            stock: 40,
            color: "White",
            reviews: [
                {
                    username: "Michael Lee",
                    rating: 4,
                    comment: "Good quality, but a bit pricey.",
                    media: []
                }
            ]
        },
        "CVC Cotton Fabric": {
            brand: "Cotton",
            price: 18550.25,
            rating: 4.7,
            sold: "158",
            mainImage: "images/CVC Cotton Fabric.jpg",
            images: [
                "images/CVC Cotton Fabric.jpg"
            ],
            description: "CVC Cotton fabric with a blend of cotton and polyester for enhanced durability and comfort.",
            specifications: [
                { label: "Material", value: "CVC Cotton" },
                { label: "Blend", value: "60% Cotton, 40% Polyester" },
                { label: "Width", value: "1.5 meters" }
            ],
            stock: 10,
            color: "White",
            reviews: []
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');

    if (productName && productDatabase[productName]) {
        const product = productDatabase[productName];
        loadProductDetails(productName, product);
    } else {
        console.error("Product not found");
    }

    function loadProductDetails(productName, product) {
        document.getElementById('productBreadcrumb').textContent = productName;

        document.getElementById('productTitle').textContent = productName;

        const mainImage = document.getElementById('mainProductImage');
        mainImage.src = product.mainImage;
        mainImage.alt = productName;

        const thumbnailGallery = document.getElementById('thumbnailGallery');
        thumbnailGallery.innerHTML = '';

        const mainThumbnail = document.createElement('div');
        mainThumbnail.className = 'thumbnail active';
        mainThumbnail.innerHTML = `<img src="${product.mainImage}" alt="Main Thumbnail" class="thumbnail-img active">`;
        thumbnailGallery.appendChild(mainThumbnail);

        product.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail';
            thumbnail.innerHTML = `<img src="${image}" alt="Thumbnail ${index + 1}" class="thumbnail-img">`;
            thumbnailGallery.appendChild(thumbnail);

            thumbnail.addEventListener('click', function () {
                mainImage.src = image;
                mainImage.alt = `${productName} - View ${index + 1}`;

                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.thumbnail-img').forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
                thumbnail.querySelector('.thumbnail-img').classList.add('active');
            });
        });

        const ratingContainer = document.getElementById('productRating');
        ratingContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            if (i <= Math.floor(product.rating)) {
                star.className = 'fas fa-star';
            } else if (i - 0.5 <= product.rating) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
            ratingContainer.appendChild(star);
        }

        document.getElementById('ratingValue').textContent = product.rating.toFixed(1);
        document.getElementById('reviewCount').textContent = `${product.reviews.length} reviews`;
        document.getElementById('soldCount').textContent = product.sold + ' sold';

        document.getElementById('productPrice').textContent = '₱ ' + product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        document.getElementById('stockInfo').textContent = product.stock + ' pieces available';

        document.getElementById('productDescription').innerHTML = product.description;

        const specsTableBody = document.getElementById('specsTableBody');
        specsTableBody.innerHTML = '';
        product.specifications.forEach(spec => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="spec-label">${spec.label}</td>
                <td class="spec-value">${spec.value}</td>
            `;
            specsTableBody.appendChild(row);
        });

        loadCustomerReviews(product.reviews);

        initializeQuantitySelector(product.stock);

        initializeButtons(productName, product);

        loadRelatedProducts(product.brand);

        initializeTabs();
    }

    function loadCustomerReviews(reviews) {
        const reviewsContainer = document.getElementById('reviewsContainer');
        reviewsContainer.innerHTML = '';

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
            return;
        }

        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';

            let mediaHTML = '';
            if (review.media && review.media.length > 0) {
                mediaHTML = review.media.map(media => `<img src="${media}" alt="Review Media" class="review-media">`).join('');
            }

            reviewCard.innerHTML = `
                <div class="review-header">
                    <span class="review-username">${review.username}</span>
                    <div class="review-rating">
                        ${Array.from({ length: 5 }, (_, i) => i < review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>').join('')}
                    </div>
                </div>
                <p class="review-comment">${review.comment}</p>
                <div class="review-media-container">${mediaHTML}</div>
            `;

            reviewsContainer.appendChild(reviewCard);
        });
    }

    function initializeQuantitySelector(maxStock) {
        const quantityInput = document.getElementById('quantityInput');
        const minusButton = document.querySelector('.quantity-btn.minus');
        const plusButton = document.querySelector('.quantity-btn.plus');

        quantityInput.value = 1;
        quantityInput.readOnly = true;

        minusButton.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value, 10);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        plusButton.addEventListener('click', function () {
            let currentValue = parseInt(quantityInput.value, 10);
            if (currentValue < maxStock) {
                quantityInput.value = currentValue + 1;
            }
        });
    }

    function initializeButtons(productName, product) {
        const addToCartBtn = document.getElementById('addToCartBtn');
        const buyNowBtn = document.getElementById('buyNowBtn');

        addToCartBtn.addEventListener('click', function () {
            window.location.href = `cart.html?product=${encodeURIComponent(productName)}`;
        });

        buyNowBtn.addEventListener('click', function () {
            window.location.href = `transaction.html?product=${encodeURIComponent(productName)}`;
        });
    }

    function initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                this.classList.add('active');

                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId + 'Tab').classList.add('active');
            });
        });
    }

    function loadRelatedProducts(currentBrand) {
        const relatedProductsGrid = document.getElementById('relatedProductsGrid');
        relatedProductsGrid.innerHTML = '';

        let relatedProducts = [];
        for (const productName in productDatabase) {
            const product = productDatabase[productName];
            if (product.brand === currentBrand) {
                relatedProducts.push({ name: productName, ...product });
                if (relatedProducts.length >= 4) break;
            }
        }

        if (relatedProducts.length < 4) {
            for (const productName in productDatabase) {
                const product = productDatabase[productName];
                if (product.brand !== currentBrand) {
                    relatedProducts.push({ name: productName, ...product });
                    if (relatedProducts.length >= 4) break;
                }
            }
        }

        relatedProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= Math.floor(product.rating)) {
                    starsHTML += '<i class="fas fa-star"></i>';
                } else if (i - 0.5 <= product.rating) {
                    starsHTML += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    starsHTML += '<i class="far fa-star"></i>';
                }
            }

            productCard.innerHTML = `
                <img src="${product.mainImage}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">₱ ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div class="product-rating">
                        <div class="stars">
                            ${starsHTML}
                        </div>
                        <span class="rating-value">${product.rating.toFixed(1)}</span>
                        <span class="review-count">${product.sold} sold</span>
                    </div>
                </div>
            `;

            productCard.addEventListener('click', function () {
                window.location.href = `/f-productdetails?product=${encodeURIComponent(product.name)}`;
            });

            relatedProductsGrid.appendChild(productCard);
        });
    }
});