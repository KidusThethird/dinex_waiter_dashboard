'use client'
import { apiUrl } from '@/apiConfig';
import React, { useState, useEffect } from 'react';
import { getAccessToken } from "../../lib/tokenManager";
import { toast } from "sonner"

// Define types for items
interface Item {
  id: number;
  name: string;
  description: string;
  type: string; // Category type, e.g., Main Course, Smoothie, Juice
  itemType: 'food' | 'drink'; // Actual type (food or drink)
  price: number;
  duration: number;
  status: string;
  deleted: boolean;
  createdAt: string;
}

interface CartItem {
  item: Item;
  quantity: number;
}

const NewOrderPage: React.FC = () => {
  const accessToken = getAccessToken();

  if (accessToken == null || accessToken === "" || accessToken === '0') {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [filter, setFilter] = useState<'food' | 'drink' | ''>(''); // Filter for food or drink type
  const [tableNumber, setTableNumber] = useState<string>(''); // New state for table number

  useEffect(() => {
    // Fetch items (both foods and drinks) from the API
    const fetchItems = async () => {
      const res = await fetch(`${apiUrl}/items`);
      const data = await res.json();
      setItems(data);
    };

    fetchItems();
  }, []);

  const handleAddToCart = (item: Item) => {
    const cartItem: CartItem = {
      item,
      quantity: 1,
    };
    setCart((prevCart) => [...prevCart, cartItem]);
  };

  const handleChangeQuantity = (index: number, change: number) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const updatedItem = { ...updatedCart[index] };
      updatedItem.quantity += change;
      updatedCart[index] = updatedItem;
      return updatedCart;
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const total = cart.reduce(
      (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
      0
    );
    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const handleSubmitOrder = () => {
    if (!tableNumber.trim()) {
      toast.error("Please provide a table number.");
      return;
    }

    const orderData = {
      TableNumber: tableNumber, // Include table number
      OrderItems: cart.map((cartItem) => ({
        ItemId: cartItem.item.id,
        quantity: cartItem.quantity,
      })),
    };

    // Submit the order
    fetch(`${apiUrl}/orderitem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Order Made!");
        setCart([]); // Optionally reset the cart after successful order
        setTableNumber(''); // Clear table number
      })
      .catch((error) => {
        console.error('Error submitting order:', error);
        toast.error('There was an error placing your order. Please try again.');
      });
  };

  const filteredItems = (items: Item[]) => {
    return items.filter((item) => {
      const matchesType = filter ? item.itemType === filter : true;
      return matchesType;
    });
  };

  return (
    <div className="p-6 mt-14">
      <h1 className="text-3xl font-bold mb-6">Create New Order</h1>

      {/* Input for Table Number */}
      <div className="mb-6">
  <label htmlFor="table-number" className="block text-lg font-medium mb-2">
    Table Number
  </label>
  <input
    id="table-number"
    type="number" // Ensures only numbers are allowed
    value={tableNumber}
    onChange={(e) => setTableNumber(e.target.value)}
    placeholder="Table #" // Shortened placeholder
    className="w-1/6 p-2 border border-gray-300 rounded"
  />
</div>

      {/* Dropdown for Food and Drink */}
      <div className="flex gap-6 mt-6">
        {/* Food Item Dropdown */}
        {filter === 'food' || filter === '' ? (
          <div className="w-1/2">
            <h2 className="text-2xl mb-4">Select Food</h2>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => {
                const itemId = parseInt(e.target.value);
                const item = items.find((food) => food.id === itemId && food.itemType === 'food');
                if (item) handleAddToCart(item);
              }}
            >
              <option value="">-- Select Food --</option>
              {filteredItems(items).map((item) =>
                item.itemType === 'food' ? (
                  <option key={item.id} value={item.id}>
                    {item.name} - ${item.price}
                  </option>
                ) : null
              )}
            </select>
          </div>
        ) : null}

        {/* Drink Item Dropdown */}
        {filter === 'drink' || filter === '' ? (
          <div className="w-1/2">
            <h2 className="text-2xl mb-4">Select Drink</h2>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e) => {
                const itemId = parseInt(e.target.value);
                const item = items.find((drink) => drink.id === itemId && drink.itemType === 'drink');
                if (item) handleAddToCart(item);
              }}
            >
              <option value="">-- Select Drink --</option>
              {filteredItems(items).map((item) =>
                item.itemType === 'drink' ? (
                  <option key={item.id} value={item.id}>
                    {item.name} - ${item.price}
                  </option>
                ) : null
              )}
            </select>
          </div>
        ) : null}
      </div>

      {/* Cart */}
      <h2 className="text-2xl mt-6 mb-4">Selected Orders</h2>
      <div className="border border-gray-300 p-4 rounded-lg mb-6">
        {cart.map((cartItem, index) => (
          <div key={index} className="flex justify-between mb-4">
            <div className="flex gap-4">
              <span>{cartItem.item.name}</span>
              <span>(${cartItem.item.price})</span>
            </div>
            <div className="flex gap-2 items-center">
              <button
                className="bg-red-500 text-white p-1 rounded"
                onClick={() => handleChangeQuantity(index, -1)}
                disabled={cartItem.quantity <= 1}
              >
                -
              </button>
              <span>{cartItem.quantity}</span>
              <button
                className="bg-green-500 text-white p-1 rounded"
                onClick={() => handleChangeQuantity(index, 1)}
              >
                +
              </button>
              <span className="ml-4">Total: ${cartItem.item.price * cartItem.quantity}</span>
              <button
                className="bg-gray-300 text-white p-1 rounded"
                onClick={() => handleRemoveFromCart(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total and Submit Button */}
      <div className="text-right">
        <h3 className="text-xl font-semibold mb-4">Total: ${totalPrice}</h3>
        <button
          className="bg-primaryColor text-white p-2 rounded-lg"
          onClick={handleSubmitOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default NewOrderPage;
