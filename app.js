// Fetch all items on page load
document.addEventListener('DOMContentLoaded', fetchItems);

// Add new item
document.getElementById('addItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const articleNumber = document.getElementById('articleNumber').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;

    const newItem = { name, articleNumber, price, description };

    try {
        const response = await fetch('http://localhost:3000/item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });
        
        const result = await response.json();
        console.log('Created:', result);
        fetchItems();  // Refresh the item list
    } catch (error) {
        console.error('Error adding item:', error);
    }
});

// Update existing item
document.getElementById('updateItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const articleNumber = document.getElementById('updateArticleNumber').value;
    const name = document.getElementById('updateName').value;
    const price = document.getElementById('updatePrice').value;
    const description = document.getElementById('updateDescription').value;

    const updatedItem = { name, price, description };

    try {
        const response = await fetch(`http://localhost:3000/item/${articleNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedItem)
        });

        const result = await response.json();
        console.log('Updated:', result);
        fetchItems();  // Refresh the item list
    } catch (error) {
        console.error('Error updating item:', error);
    }
});

// Fetch all items and display them
async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/items');
        const items = await response.json();
        const itemsList = document.getElementById('items-list');
        itemsList.innerHTML = '';  // Clear previous list

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <strong>Product Name:</strong> ${item.name}<br>
                <strong>Article Number:</strong> ${item.articleNumber}<br>
                <strong>Price:</strong> ${item.price}<br>
                <strong>Description:</strong> ${item.description}<br><br>
            `;
            itemsList.appendChild(itemDiv);
        });
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Delete an item by article number
async function deleteItem() {
    const articleNumber = document.getElementById('deleteArticleNumber').value;

    try {
        const response = await fetch(`http://localhost:3000/item/${articleNumber}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log('Deleted item');
            fetchItems();  // Refresh the item list
        } else {
            console.error('Error deleting item');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}
