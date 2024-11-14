# Industrial Inventory Management System

This Node.js application enables users to manage and order products listed in `data/industrial.json`. Users can log in as either a **User** to place orders or as an **Admin** to manage product inventory. Both roles are accessible at [https://localhost:3000]

## When on the **User** option:

When logged in as a User, users can browse and order available items:

1. **View Available Items**: The page displays all products listed in `industrial.json`, showing each product's name, price, and description.
2. **Select Items to Order**: Users can specify quantities for each item they wish to purchase.
3. **Place Order**: Clicking **Place Order** submits the order.
   - Each order is assigned a ID and saved in `order.json` for tracking and reference.

## When on the **Admin** option:

The Admin view provides full control over the product inventory, enabling CRUD operations (Create, Read, Update, Delete) on products:

1. **View Inventory**: Displays all current products from `industrial.json`.
2. **Add New Products**: Allows Admin to create new items by specifying details like `name`, `articleNumber`, `price`, and `description`.
3. **Update Existing Products**: Enables Admin to modify details for any item by referencing its `articleNumber`.
4. **Delete Products**: Lets Admin remove an item from the inventory by its `articleNumber`.

Changes made in Admin mode are saved to `industrial.json` and are immediately reflected on both Customer and Admin pages.

---

## Getting Started

1. **Install Node.js**: Ensure you have Node.js installed on your machine.
2. **Install Dependencies**: Run `npm install node` and `npm install express` to install required packages.
3. **Start the Server**: Run `node server.js` to start the application.
4. **Access the Application**: Open a browser and navigate to [https://localhost:3000]

---

## Explaining server.js

A simple Express.js application to manage inventory items and customer orders. This API reads, writes, and updates data from JSON files and provides endpoints for handling items and orders.

### Item Endpoints
- **GET /items** - Returns a list of all items in the inventory.
- **GET /item/:articleNumber** - Fetches an item by `articleNumber`.
- **POST /item** - Creates a new item. Requires `name`, `articleNumber`, `price`, and `description` in the request body.
- **PUT /item/:articleNumber** - Updates an existing item by `articleNumber`. Accepts `name`, `price`, and `description` as optional fields.
- **DELETE /item/:articleNumber** - Deletes an item by `articleNumber`.

### Order Endpoints
- **POST /order** - Creates a new order with specified `items`. Each item must include an `articleNumber` and `quantity`.
- **GET /orders** - Returns all orders.
- **GET /order/:id** - Fetches a specific order by `id`.

### Data Management
- **loadData()** - Loads inventory data from `industrial.json`.
- **saveData()** - Saves updated inventory data to `industrial.json`.
- **loadOrders()** - Loads order data from `order.json`.
- **saveOrders()** - Saves updated order data to `order.json`.

---

## Explaining admin.js

A simple front-end interface for managing inventory items with an Express.js API. Provides options to fetch, display, add, update, and delete inventory items.

## Functions

### 1. Fetch and Display Items
- **`fetchItems()`** - Fetches all items from the `/items` endpoint and displays them in the `items-list` element.

### 2. Add a New Item
- **`submit` event listener on `addItemForm`** - Submits a new item to the API using the `/item` POST endpoint.

### 3. Update an Existing Item
- **`submit` event listener on `updateItemForm`** - Updates an existing item with the given `articleNumber` using the `/item/:articleNumber` PUT endpoint.

### 4. Delete an Item
- **`deleteItem()`** - Deletes an item by `articleNumber` using the `/item/:articleNumber` DELETE endpoint.

---

## Explaining user.js

This interface allows users to select items and place orders with an inventory management API. Users can specify quantities for items and submit orders, which are then saved to the server.

## Functions

### 1. Load Items
- **`loadItems()`** - Fetches inventory items from the `/items` endpoint and displays each item with an input field for specifying quantities.

### 2. Place Order
- **`placeOrder()`** - Collects user-inputted quantities and submits them as an order to the `/order` endpoint.
  - **Process**:
    1. Collects all non-zero quantities entered by the user.
    2. Sends a POST request with selected items and quantities to the server.
    3. Alerts the user with the new order ID if successful or an error message if the order fails.

