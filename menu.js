document.addEventListener('DOMContentLoaded', () => {
    updateMenuList();
});

function updateMenuList() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const menuList = document.getElementById('menu-list');

    if (menuList) {
        menuList.innerHTML = ''; // Limpar lista de produtos na página principal

        products.forEach((product) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <a href="${product.link}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="menu-item-info">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <p class="price">R$ ${product.price.toFixed(2)}</p>
                    </div>
                </a>
            `;
            menuList.appendChild(menuItem);
        });
    }
}




