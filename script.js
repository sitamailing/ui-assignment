const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const PRODUCT_LIST_API = "https://fakestoreapi.com/products";
const PAGE_LIMIT = 10;
const LOAD_MORE_LIMIT = 10;
const CATEGOROES_LIST = ["jewelery", "electronics", "men's clothing", "women's clothing"];

const mobileMenu = () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

hamburger.addEventListener("click", mobileMenu);

// when we click on hamburger icon its close 

const navLink = document.querySelectorAll(".nav-link");

const closeMenu = () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}

navLink.forEach(n => n.addEventListener("click", closeMenu));

// Breadcrumb data
const breadcrumbData = ['Clothing', `Women's`, 'Outerwear'];
const breadcrumbContainer = document.getElementById('breadcrumb');

breadcrumbData.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    breadcrumbContainer.appendChild(listItem);
});

const productContainer = document.getElementById('product-container');
let page = 1;

// Function to fetch product data from API
const fetchProducts = async () => {
    try {
        const response = await fetch(`${PRODUCT_LIST_API}`);
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

const init = async () => {
    const products = await fetchProducts();

    // Filtering by categories
    document.querySelectorAll('#categories-list input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            const selectedOptions = Array.from(document.querySelectorAll('#categories-list input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.value);
            const filteredProducts = selectedOptions
                ? products.filter(product => selectedOptions.includes(product.category))
                : products;
            productContainer.innerHTML = '';
            renderTotalResults(`${filteredProducts.length}`);
            renderProducts(filteredProducts);
        });
    });

    // Sorting 
    const sortSelect = document.querySelector('#sort');
    sortSelect.addEventListener('change', () => {
        const sortOrder = sortSelect.value === 'asc' ? 1 : -1;
        const filteredProducts = [...products].sort((a, b) => sortOrder * (a.price - b.price));
        productContainer.innerHTML = '';
        renderTotalResults(`${filteredProducts.length}`);
        renderProducts(filteredProducts);
    });

    // Search
    const searchInput = document.querySelector('#search');
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.trim().toLowerCase();
        const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchValue));
        productContainer.innerHTML = '';
        renderTotalResults(`${filteredProducts.length}`);
        renderProducts(filteredProducts);
    });
}

init();

// mobile sorting
let sortOrder = 1;
const sortingProducts = async () => {
    const products = await fetchProducts();
    const filteredProducts = [...products].sort((a, b) => sortOrder * (a.price - b.price));
    productContainer.innerHTML = '';
    renderTotalResults(`${filteredProducts.length}`);
    renderProducts(filteredProducts);
    sortOrder = -1;
}

// Function to hide the spinner
const hideSpinner = () => {
    var spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

const showSpinner = () => {
    var spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
}

const loadProducts = async () => {
    showSpinner();
    try {
        const response = await fetch(`https://fakestoreapi.com/products?limit=${PAGE_LIMIT}&page=${page}`);
        const products = await response.json();
        console.log("products", products);
        hideSpinner();
        renderTotalResults(`${products.length * page}`);
        renderProducts(products);
        page++;
    } catch (error) {
        console.error('Error fetching products:', error);
        hideSpinner();
        return [];
    }

};

const renderTotalResults = (products) => {
    const totalResults = document.getElementById('total-results');
    totalResults.textContent = `${products}`;
}

const renderProducts = (products) => {
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
                <img class='product-image' src="${product.image}" alt="${product.title}" />
                <h2 class='product-title'>${product.title}</h2>
                <p>$${product.price}</p>
            `;
        productContainer.appendChild(productDiv);
    });
    // Hide load more button if products are less than 10
    if (products.length < LOAD_MORE_LIMIT) {
        document.getElementById('load-more-content').style.display = 'none';
    }
}

// const observer = new IntersectionObserver((entries) => {
//     if (entries[0].isIntersecting) {
//         console.log('Intersecting');
//         loadProducts();
//     }
// }, {
//     root: null,
//     rootMargin: '0px',
//     threshold: 1.0
// });

// observer.observe(document.querySelector('#product-container'));

// Initial load
loadProducts();

// Function to createCategoriesList
const createCategoriesList = (list) => {
    const container = document.getElementById('categories-list');
    list.forEach(item => {
        const categoryDiv = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.addC
        checkbox.type = 'checkbox';
        checkbox.id = item;
        checkbox.name = item;
        checkbox.value = item;

        const label = document.createElement('label');
        label.htmlFor = item;
        label.appendChild(document.createTextNode(item));

        categoryDiv.appendChild(checkbox);
        categoryDiv.appendChild(label);
        categoryDiv.appendChild(document.createElement('br'));
        container.appendChild(categoryDiv);
    });
}

// Call the function with your categories list
createCategoriesList(CATEGOROES_LIST);