"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import ProductForm from "./ProductForm";

interface Product {
  _id: string;
  name: string;
  category: string;
  unit: string;
  isActive: boolean;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Ürünler yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Ürün silinirken bir hata oluştu");
        }
        setProducts(products.filter((product) => product._id !== productId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(
      products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    setEditingProduct(null);
  };

  const handleProductCreated = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  if (isLoading) return <div className="text-neon-pink">Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-gray-900 shadow-lg rounded-lg overflow-hidden cyberpunk-border">
      <div className="p-4 border-b border-neon-purple">
        <h2 className="text-xl font-semibold cyberpunk-text mb-4">
          Ürün Listesi
        </h2>
        <ProductForm onProductCreated={handleProductCreated} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left text-neon-blue">Ad</th>
              <th className="p-3 text-left text-neon-blue">Kategori</th>
              <th className="p-3 text-left text-neon-blue">Birim</th>
              <th className="p-3 text-left text-neon-blue">Durum</th>
              <th className="p-3 text-left text-neon-blue">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-gray-800">
                <td className="p-3 text-neon-pink">{product.name}</td>
                <td className="p-3 text-white">{product.category}</td>
                <td className="p-3 text-white">{product.unit}</td>
                <td className="p-3 text-neon-blue">
                  {product.isActive ? "Aktif" : "Pasif"}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-neon-blue hover:text-neon-pink mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-neon-pink hover:text-neon-blue"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingProduct && (
        <div className="p-4 border-t border-neon-purple">
          <h3 className="text-lg font-semibold cyberpunk-text mb-4">
            Ürün Düzenle
          </h3>
          <ProductForm
            product={editingProduct}
            onProductUpdated={handleProductUpdated}
          />
        </div>
      )}
    </div>
  );
}
