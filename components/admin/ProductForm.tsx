"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/types/product"
import type { Season } from "@/types/season"

interface ProductFormProps {
  product?: Product
  seasons: Season[]
}

export default function ProductForm({ product, seasons }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "")
  const [category, setCategory] = useState(product?.category ?? "")
  const [brand, setBrand] = useState(product?.brand ?? "")
  const [unit, setUnit] = useState(product?.unit ?? "")
  const [season, setSeason] = useState<string>(
    product?.season && typeof product.season === "object" && "_id" in product.season
      ? product.season._id.toString()
      : product?.season?.toString() || "",
  )
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const productData = {
      name,
      category,
      brand,
      unit,
      season: season || undefined,
      isActive: true,
    }

    try {
      const response = await fetch(product ? `/api/products/${product._id}` : "/api/products", {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Bir hata oluştu")
      }

      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 shadow-lg rounded-lg p-6 cyberpunk-border">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-neon-blue mb-2">
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

        <div className="mb-4">
          <label htmlFor="category" className="block text-neon-blue mb-2">
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

        <div className="mb-4">
          <label htmlFor="brand" className="block text-neon-blue mb-2">
            Marka
          </label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="unit" className="block text-neon-blue mb-2">
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

        <div className="mb-4">
          <label htmlFor="season" className="block text-neon-blue mb-2">
            Sezon
          </label>
          <select
            id="season"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          >
            <option value="">Sezon Seçin</option>
            {seasons.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="cyberpunk-button w-full mt-4" disabled={isLoading}>
        {isLoading ? "İşleniyor..." : product ? "Güncelle" : "Ürün Ekle"}
      </button>
    </form>
  )
}

