import { X, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type CartItem = {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
};

type CartSidebarProps = {
  items: CartItem[];
  onClose: () => void;
  onUpdateCart: () => void;
};

export default function CartSidebar({ items, onClose, onUpdateCart }: CartSidebarProps) {
  async function removeItem(itemId: string) {
    await supabase.from('cart_items').delete().eq('id', itemId);
    onUpdateCart();
  }

  const total = items.reduce((sum, item) => sum + item.products.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-slate-50 rounded-lg"
                >
                  <img
                    src={item.products.image_url}
                    alt={item.products.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{item.products.name}</h3>
                    <p className="text-emerald-600 font-bold mt-1">
                      ${item.products.price}
                    </p>
                    <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold text-slate-900">Total:</span>
              <span className="font-bold text-emerald-600 text-2xl">
                ${total.toFixed(2)}
              </span>
            </div>
            <button className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold text-lg">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
