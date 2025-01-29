"use client";

import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  category: string;
  unit: string;
  isActive: boolean;
}

interface ProductFormProps {
  product?: Product;
  onProductCreated?: (product: Product) => void;
  onProductUpdated?: (product: Product) => void;
}

export default function ProductForm({
  product,
  onProductCreated,
  onProductUpdated,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [unit, setUnit] = useState(product?.unit ?? "");
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const productData = { name, category, unit, isActive };
    const url = product ? `/api/products/${product._id}` : "/api/products";
    const method = product ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      const savedProduct = await response.json();
      if (product && onProductUpdated) {
        onProductUpdated(savedProduct);
      } else if (onProductCreated) {
        onProductCreated(savedProduct);
      }

      setName("");
      setCategory("");
      setUnit("");
      setIsActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label htmlFor="name" className="block text-neon-blue mb-1">
          Ürün Adı
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          required
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-neon-blue mb-1">
          Kategori
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          required
        />
      </div>
      <div>
        <label htmlFor="unit" className="block text-neon-blue mb-1">
          Birim
        </label>
        <input
          type="text"
          id="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          required
        />
      </div>
      <div>
        <label className="flex items-center text-neon-blue">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-2"
          />
          Aktif
        </label>
      </div>
      <button
        type="submit"
        className="cyberpunk-button w-full"
        disabled={isLoading}
      >
        {isLoading ? "İşleniyor..." : product ? "Güncelle" : "Ekle"}
      </button>
    </form>
  );
}
