// Array of slides for the carousel
const slides = [{
        headline: "Discover the Latest Trends",
        subheadline: "Find your style with Trendify",
        buttonText: "Explore Now",
        image: "https://i.postimg.cc/76qnHH95/3d-rendering-of-shopping-cart-an.png",
    },
    {
        headline: "Exclusive Summer Collection",
        subheadline: "Shop the hottest looks of the season",
        buttonText: "Shop Summer",
        image: "https://i.postimg.cc/bYC9Pjtv/marketplace-solution-banner.png",
    },
    {
        headline: "Limited Time Offers",
        subheadline: "Grab your favorites before they're gone",
        buttonText: "Shop Deals",
        image: "https://i.postimg.cc/kGzSbqQF/360-F-336156751-XY1xf-Hvk9yl44d-RS.png",
    },
    {
        headline: "Limited Time Offers",
        subheadline: "Grab your favorites before they're gone",
        buttonText: "Shop Deals",
        image: "https://i.postimg.cc/3rcm6Cs4/360-F-614272019-QLfish-Q3-Psk-I4-N8p.jpg",
    }
];

let currentSlide = 0;

// Select elements for the slider
const slider = document.getElementById('slider');
const headline = document.getElementById('headline');
const subheadline = document.getElementById('subheadline');
const ctaButton = document.getElementById('ctaButton');

// Function to change the slide
function changeSlide() {
    const slide = slides[currentSlide];
    slider.style.backgroundImage = `url(${slide.image})`;
    headline.textContent = slide.headline;
    subheadline.textContent = slide.subheadline;
    ctaButton.textContent = slide.buttonText;
    currentSlide = (currentSlide + 1) % slides.length; // Move to next slide, loop to start
}

// Initialize slider and set interval for automatic slide changes
changeSlide();
setInterval(changeSlide, 5000); // Change slide every 5 seconds

// Function to fetch reviews asynchronously
async function fetchReviews() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const reviews = await response.json();
        return reviews;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

let reviews = [];
let index = Math.floor(Math.random() * reviews.length);

// Function to update the review card
function updateReview() {
    const reviewCard = document.getElementById('reviewCard');
    const review = reviews[index];
    reviewCard.innerHTML = `
        <div class="flex-shrink-0 w-full border-blue-600 h-80">
            <div class="bg-white p-6 border-red-600 rounded-lg shadow-lg h-full flex flex-col items-center justify-between">
                <img class="h-16 w-16 object-cover rounded-full" src="${review.profilePicture}" alt="${review.name}">
                <h3 class="text-lg font-bold mt-4">${review.name}</h3>
                <p class="text-sm text-gray-600 mt-2">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
                <p class="mt-4">${review.review}</p>
                <p class="text-sm text-gray-500 mt-2">${new Date(review.date).toLocaleDateString()}</p>
            </div>
        </div>
    `;
}

// Function to show the previous review
function showPrevReview() {
    index = (index - 1 + reviews.length) % reviews.length; // Loop back if at start
    updateReview();
}

// Function to show the next review
function showNextReview() {
    index = (index + 1) % reviews.length; // Loop back if at end
    updateReview();
}

// Initialize reviews and set up event listeners
async function initialize() {
    reviews = await fetchReviews();
    index = Math.floor(Math.random() * reviews.length); // Randomly select initial review
    updateReview();
    document.getElementById('prevReview').addEventListener('click', showPrevReview);
    document.getElementById('nextReview').addEventListener('click', showNextReview);
}

// Call initialize on page load
initialize();

// Product showcase section

// Function to fetch products asynchronously
async function fetchProducts() {
    try {
        const response = await fetch('./products.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Function to display products on the page
function displayProducts(products, limit = 8) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = ''; // Clear existing content
    products.slice(0, limit).forEach(product => {
        const productCard = `
            <div class="relative bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all ease-linear duration-300 group">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                <div class="p-4 flex flex-col justify-between h-44">
                    <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                    <p class="text-gray-600 mt-2">${product.description}</p>
                    <div class="flex items-center justify-between mt-4">
                        <span class="text-xl font-bold text-[#0e2e49]">$${product.price}</span>
                    </div>
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <div class="text-center text-white p-4">
                        <span class="block text-xl font-bold mb-2">Special Offer</span>
                        <p class="mb-4">${product.discount || 'No Discount'}</p>
                        <button class="bg-[#041728] transition-all ease-linear duration-300 text-white px-4 py-2 rounded-md hover:bg-[#0e2e49]">Quick Add to Cart</button>
                    </div>
                </div>
            </div>`;
        productGrid.innerHTML += productCard; // Append product card to grid
    });
}

// Initialize product data and display initial products
let allProducts = [];
let displayedProducts = 8;

fetchProducts().then(products => {
    allProducts = products;
    displayProducts(allProducts, displayedProducts);
});

// Add event listeners for "Show More" and "Show Less" buttons
document.getElementById('showMoreBtn').addEventListener('click', () => {
    displayedProducts = allProducts.length; // Show all products
    displayProducts(allProducts, displayedProducts);
    document.getElementById('showMoreBtn').classList.add('hidden');
    document.getElementById('showLessBtn').classList.remove('hidden');
});

document.getElementById('showLessBtn').addEventListener('click', () => {
    displayedProducts = 8; // Reset to initial display limit
    displayProducts(allProducts, displayedProducts);
    document.getElementById('showMoreBtn').classList.remove('hidden');
    document.getElementById('showLessBtn').classList.add('hidden');
});

// Add event listeners for filter changes
document.getElementById('categoryFilter').addEventListener('change', applyFilters);
document.getElementById('priceFilter').addEventListener('change', applyFilters);
document.getElementById('ratingFilter').addEventListener('change', applyFilters);

// Function to apply filters to the product list
function applyFilters() {
    let filteredProducts = [...allProducts];
    const category = document.getElementById('categoryFilter').value;
    const price = document.getElementById('priceFilter').value;
    const rating = document.getElementById('ratingFilter').value;

    // Filter by selected category
    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Sort products by price
    if (price) {
        filteredProducts = filteredProducts.sort((a, b) => {
            return price === 'low' ? a.price - b.price : b.price - a.price;
        });
    }

    // Filter by rating
    if (rating) {
        filteredProducts = filteredProducts.filter(product => product.rating >= rating);
    }

    // Update "Show More" button visibility based on the number of filtered products
    if (filteredProducts.length > displayedProducts) {
        document.getElementById('showMoreBtn').classList.remove('hidden');
    } else {
        document.getElementById('showMoreBtn').classList.add('hidden');
    }

    // Display the filtered products
    displayProducts(filteredProducts, displayedProducts);
}
