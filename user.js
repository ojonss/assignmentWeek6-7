// fetch items from industrail.json
async function loadItems() {
    try {
        const response = await fetch('/items');
        const items = await response.json();
        const container = document.getElementById('items-container');
        container.innerHTML = '';

        // Create label for each industrail.json
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <label>
                    ${item.name} (Price: $${item.price}):
                    <input type="number" min="0" value="0" data-article-number="${item.articleNumber}">
                </label>
            `;
            container.appendChild(itemDiv);
        });
    } catch (error) {
        console.error('Error loading items:', error);
    }
}

async function placeOrder() {
    const quantities = Array.from(document.querySelectorAll('input[type="number"]'))
        .map(input => ({
            articleNumber: input.getAttribute('data-article-number'),
            quantity: parseInt(input.value, 10)
        }))
        .filter(item => item.quantity > 0);

    if (quantities.length === 0) {
        alert("Please select at least one item with quantity greater than 0.");
        return;
    }

    try {
        const response = await fetch('/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: quantities })
        });
        if (!response.ok) throw new Error(await response.text());

        const newOrder = await response.json();
        alert(`Order placed successfully with ID: ${newOrder.id}`);
        loadItems(); 
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order.');
    }
}

loadItems();