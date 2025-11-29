'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  minQuantity: number;
  maxQuantity: number;
  disabled?: boolean;
}

export default function AddToCartButton({
  productId,
  productName,
  minQuantity,
  maxQuantity,
  disabled,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(minQuantity);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToFavorites, setIsAddingToFavorites] = useState(false);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= minQuantity && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Bitte melden Sie sich an, um Produkte zum Warenkorb hinzuzufügen');
          return;
        }
        throw new Error(data.error || 'Fehler beim Hinzufügen');
      }

      toast.success(`${productName} wurde zum Warenkorb hinzugefügt`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Fehler beim Hinzufügen');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToFavorites = async () => {
    setIsAddingToFavorites(true);
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Bitte melden Sie sich an, um Favoriten zu speichern');
          return;
        }
        throw new Error(data.error || 'Fehler beim Hinzufügen');
      }

      toast.success('Zu Favoriten hinzugefügt');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Fehler beim Hinzufügen');
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-[#666]">Menge:</span>
        <div className="flex items-center border border-[#E0E0E0] rounded">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= minQuantity || disabled}
            className="p-3 hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || minQuantity;
              setQuantity(Math.min(Math.max(val, minQuantity), maxQuantity));
            }}
            className="w-16 text-center border-x border-[#E0E0E0] py-2"
            min={minQuantity}
            max={maxQuantity}
          />
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= maxQuantity || disabled}
            className="p-3 hover:bg-[#F5F5F5] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>
        {minQuantity > 1 && (
          <span className="text-xs text-[#666]">
            (Mindestbestellmenge: {minQuantity})
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleAddToCart}
          isLoading={isAddingToCart}
          disabled={disabled}
          leftIcon={<ShoppingCart size={18} />}
        >
          In den Warenkorb
        </Button>
        <Button
          variant="outline"
          onClick={handleAddToFavorites}
          isLoading={isAddingToFavorites}
        >
          <Heart size={18} />
        </Button>
      </div>
    </div>
  );
}
