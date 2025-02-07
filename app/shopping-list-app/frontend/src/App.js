import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: 1 });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/items");
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch items. Please try again.");
    }
  };

  const addItem = async () => {
    if (!newItem.name || newItem.quantity <= 0) {
      setError("Item name and quantity (must be greater than 0) are required.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/items", newItem);
      fetchItems();
      setNewItem({ name: "", quantity: 1 });
      setError(null);
    } catch (err) {
      setError("Failed to add item. Please try again.");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      fetchItems();
      setError(null);
    } catch (err) {
      setError("Failed to delete item. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Shopping List</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Item name"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={newItem.quantity}
        min="1"
        onChange={(e) => setNewItem({ ...newItem, quantity: Math.max(1, e.target.value) })}
      />
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - {item.quantity}
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;