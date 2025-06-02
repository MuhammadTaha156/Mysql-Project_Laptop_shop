// app.js

const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
    fetchUsers();

    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('search-box').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');

    if (menuBtn && sidebar && closeSidebarBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });

        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });

        document.addEventListener('click', (event) => {
            if (sidebar.classList.contains('open') &&
                !sidebar.contains(event.target) &&
                !menuBtn.contains(event.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    document.querySelectorAll('.sidebar-section-title').forEach(title => {
        title.addEventListener('click', () => {
            const subLinksContainer = title.nextElementSibling;
            if (subLinksContainer && subLinksContainer.classList.contains('sidebar-sub-links-container')) {
                title.classList.toggle('open');
                subLinksContainer.classList.toggle('open');
            }
        });
    });

    document.querySelector('.sidebar-content').addEventListener('click', (e) => {
        if (e.target.classList.contains('sidebar-link') || e.target.classList.contains('sidebar-sub-link')) {
            e.preventDefault();

            document.querySelectorAll('.sidebar-link, .sidebar-sub-link').forEach(link => {
                link.classList.remove('active');
            });
            e.target.classList.add('active');

            const filterTypeElement = e.target.closest('.sidebar-sub-links-container')?.previousElementSibling;
            const filterType = filterTypeElement ? filterTypeElement.dataset.filterType : e.target.dataset.filterType;
            const value = e.target.dataset.value;

            if (value === 'all' && filterType === 'all') {
                fetchProducts();
            } else if (filterType === 'category') {
                fetchProducts('', value, '');
            } else if (filterType === 'supplier') {
                fetchProducts('', '', value);
            }
            sidebar.classList.remove('open');
        }
    });

    document.querySelector('.product-container').addEventListener('click', (event) => {
        if (event.target.classList.contains('view-details')) {
            const productId = event.target.dataset.productId;
            viewProductDetails(productId);
        }
    });
});

async function fetchProducts(query = '', category = '', supplier = '') {
    const container = document.querySelector('.product-container');
    const usersSection = document.querySelector('.users-section'); // Users section ko target karein
    
    container.innerHTML = '<div class="loading">Loading laptops...</div>';

    let url = `${API_BASE_URL}/products`;
    const params = new URLSearchParams();

    // Check if a search query or any filter is applied
    if (query || category || supplier) {
        // Hide users section if search or filters are active
        if (usersSection) {
            usersSection.style.display = 'none';
        }
    } else {
        // Show users section if no search or filters are active
        if (usersSection) {
            usersSection.style.display = 'block'; // Ya 'flex' agar CSS display flex hai
        }
    }

    if (query) {
        params.append('q', query);
        url = `${API_BASE_URL}/search`;
    } else {
        if (category) {
            params.append('category', category);
        }
        if (supplier) {
            params.append('supplier', supplier);
        }
    }

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayProducts(data);
    } catch (error) {
        console.error('Error fetching products:', error);
        container.innerHTML = `<div class="error">Error: ${error.message || 'Failed to load products. Please try again.'}</div>`;
    }
}

function performSearch() {
    const query = document.getElementById('search-box').value.trim();
    // No need for alert here, fetchProducts will handle empty query
    fetchProducts(query);
}

async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const categories = await response.json();
        const container = document.querySelector('#sidebar-categories .sidebar-sub-links-container');
        container.innerHTML = '<a href="#" class="sidebar-sub-link" data-value="all" data-filter-type="category">All Categories</a>';
        categories.forEach(cat => {
            container.innerHTML += `<a href="#" class="sidebar-sub-link" data-value="${cat}" data-filter-type="category">${cat}</a>`;
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function fetchSuppliers() {
    try {
        const response = await fetch(`${API_BASE_URL}/suppliers`);
        const suppliers = await response.json();
        const container = document.querySelector('#sidebar-suppliers .sidebar-sub-links-container');
        container.innerHTML = '<a href="#" class="sidebar-sub-link" data-value="all" data-filter-type="supplier">All Suppliers</a>';
        suppliers.forEach(sup => {
            container.innerHTML += `<a href="#" class="sidebar-sub-link" data-value="${sup}" data-filter-type="supplier">${sup}</a>`;
        });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
    }
}

async function fetchUsers() {
    const userContainer = document.getElementById('user-list-container');
    if (!userContainer) {
        console.error("User container element not found!");
        return;
    }
    userContainer.innerHTML = '<div class="loading">Loading user data...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        userContainer.innerHTML = `<div class="error">Error loading users: ${error.message || 'Failed to load user data.'}</div>`;
    }
}

function displayUsers(users) {
    const userContainer = document.getElementById('user-list-container');
    if (!userContainer) return;

    userContainer.innerHTML = '';

    if (!users || users.length === 0) {
        userContainer.innerHTML = '<p class="no-results">No users found.</p>';
        return;
    }

    const userListHtml = `
        <div class="user-table-wrapper">
            <h2>Our Registered Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    userContainer.innerHTML = userListHtml;
}

function displayProducts(data) {
    const container = document.querySelector('.product-container');
    container.innerHTML = '';

    const products = data.results || data;

    if (!products || products.length === 0) {
        container.innerHTML = '<div class="no-results">No laptops found.</div>';
        return;
    }

    products.forEach(product => {
        container.innerHTML += createProductCard(product);
    });
}

function createProductCard(product) {
    const defaultImage = 'https://via.placeholder.com/200x150?text=No+Image';
    const displayPrice = parseFloat(product.price);

    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.imageUrl || defaultImage}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-content">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description || 'No description available.'}</p>
                <p class="product-price">$${!isNaN(displayPrice) ? displayPrice.toFixed(2) : 'N/A'}</p>
                <p class="product-supplier">Supplier: ${product.supplier || 'N/A'}</p>
                <p class="product-categories">Categories: ${product.categories || 'N/A'}</p>
                <button class="view-details" data-product-id="${product.id}">View Details</button>
            </div>
        </div>
    `;
}

async function viewProductDetails(productId) {
    closeModal();

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const product = await response.json();

        if (!product || product.error) {
            alert(product.error || 'Product details not found.');
            return;
        }

        const defaultImage = 'https://via.placeholder.com/400x300?text=No+Image';
        const displayPriceModal = parseFloat(product.price);

        const modalHtml = `
            <div class="modal" id="productModal" role="dialog" aria-modal="true" aria-labelledby="productModalTitle">
                <div class="modal-content" role="document">
                    <span class="close" aria-label="Close modal">&times;</span>
                    <h2 id="productModalTitle">${product.name}</h2>
                    <img src="${product.imageUrl || defaultImage}" alt="${product.name}" class="modal-product-image">
                    <p><strong>Supplier:</strong> ${product.supplier || 'N/A'}</p>
                    <p><strong>Categories:</strong> ${product.categories || 'N/A'}</p>
                    <p><strong>Price:</strong> <span class="product-price">$${!isNaN(displayPriceModal) ? displayPriceModal.toFixed(2) : 'N/A'}</span></p>
                    <p><strong>Description:</strong> ${product.description || 'No detailed description available.'}</p>
                    <p><strong>Components:</strong> ${product.components || 'N/A'}</p>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const currentModal = document.getElementById('productModal');
        if (currentModal) {
            currentModal.querySelector('.close').addEventListener('click', closeModal);
            currentModal.addEventListener('click', (event) => {
                if (event.target === currentModal) {
                    closeModal();
                }
            });
        }

    } catch (error) {
        console.error('Error fetching product details:', error);
        alert(`Failed to load product details: ${error.message}`);
    }
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.remove();
    }
}