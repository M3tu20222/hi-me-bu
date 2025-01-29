"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Field, FieldOwnership } from "@/types/field";
import type { User } from "@/types/user";
import type { Season } from "@/types/season";
import type { Well } from "@/types/well";
import type { Product, SimpleProduct } from "@/types/product";

export default function FieldForm({ field }: { field?: Field }) {
  const [name, setName] = useState(field?.name ?? "");
  const [size, setSize] = useState(field?.size ?? 0);
  const [location, setLocation] = useState(field?.location ?? "");
  const [status, setStatus] = useState<Field["status"]>(field?.status ?? "Boş");
  const [isIrrigated, setIsIrrigated] = useState(field?.isIrrigated ?? false);
  const [season, setSeason] = useState(field?.season?._id ?? "");
  const [isRented, setIsRented] = useState(field?.isRented ?? false);
  const [isShared, setIsShared] = useState(field?.isShared ?? false);
  const [blockParcel, setBlockParcel] = useState(field?.blockParcel ?? "");
  const [well, setWell] = useState(field?.well?._id ?? "");
  const [owners, setOwners] = useState<FieldOwnership[]>(field?.owners ?? []);
  const [users, setUsers] = useState<User[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [wells, setWells] = useState<Well[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [fieldProducts, setFieldProducts] = useState<SimpleProduct[]>(
    field?.products ?? []
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersResponse,
          seasonsResponse,
          wellsResponse,
          productsResponse,
        ] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/seasons"),
          fetch("/api/wells"),
          fetch("/api/products"),
        ]);
        if (
          !usersResponse.ok ||
          !seasonsResponse.ok ||
          !wellsResponse.ok ||
          !productsResponse.ok
        ) {
          throw new Error("Veri yüklenirken bir hata oluştu");
        }
        const usersData = await usersResponse.json();
        const seasonsData = await seasonsResponse.json();
        const wellsData = await wellsResponse.json();
        const productsData = await productsResponse.json();

        setUsers(usersData);
        setSeasons(seasonsData);
        setWells(wellsData);
        setProducts(productsData);

        if (field) {
          const fieldResponse = await fetch(`/api/fields/${field._id}`);
          if (fieldResponse.ok) {
            const fieldData = await fieldResponse.json();
            setFieldProducts(fieldData.products || []);
            setOwners(fieldData.owners || []);
          }
        }
      } catch (err) {
        console.error("Veri yüklenirken hata:", err);
      }
    };

    fetchData();
  }, [field]);

  const validateOwners = () => {
    return owners.every(
      (owner) => owner.userId && owner.ownershipPercentage > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateOwners()) {
      setError(
        "Lütfen tüm tarla sahiplerini ve sahiplik yüzdelerini doğru şekilde giriniz."
      );
      setIsLoading(false);
      return;
    }

    const fieldData = {
      name,
      size,
      location,
      status,
      isIrrigated,
      season,
      isRented,
      isShared,
      blockParcel,
      well,
      owners,
      products: fieldProducts.map((p) => p._id),
    };

    try {
      const fieldResponse = await fetch(
        field ? `/api/fields/${field._id}` : "/api/fields",
        {
          method: field ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fieldData),
        }
      );

      if (!fieldResponse.ok) {
        const data = await fieldResponse.json();
        throw new Error(data.error || "Tarla kaydedilirken bir hata oluştu");
      }

      router.push("/admin/fields");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = (productId: string) => {
    const productToAdd = products.find((p) => p._id === productId);
    if (productToAdd && !fieldProducts.some((p) => p._id === productId)) {
      setFieldProducts([
        ...fieldProducts,
        { _id: productToAdd._id, name: productToAdd.name },
      ]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setFieldProducts(fieldProducts.filter((p) => p._id !== productId));
  };

  const handleOwnerChange = (
    index: number,
    field: "userId" | "ownershipPercentage",
    value: string
  ) => {
    const newOwners = [...owners];
    if (field === "userId") {
      newOwners[index].userId = value;
    } else {
      newOwners[index].ownershipPercentage = Number(value) || 0; // Eğer geçersiz bir değer girilirse 0 olarak ayarla
    }
    setOwners(newOwners);
  };

  const addOwner = () => {
    setOwners([...owners, { userId: "", ownershipPercentage: 0 }]);
  };

  const removeOwner = (index: number) => {
    const newOwners = [...owners];
    newOwners.splice(index, 1);
    setOwners(newOwners);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 shadow-lg rounded-lg p-6 cyberpunk-border"
    >
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-neon-blue mb-2">
            Tarla Adı
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
          <label htmlFor="size" className="block text-neon-blue mb-2">
            Boyut (Dönüm)
          </label>
          <input
            type="number"
            id="size"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
            step="0.001"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-neon-blue mb-2">
            Konum
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="status" className="block text-neon-blue mb-2">
            Durum
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Field["status"])}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          >
            <option value="Ekili">Ekili</option>
            <option value="Boş">Boş</option>
            <option value="Hazırlanıyor">Hazırlanıyor</option>
            <option value="Sürüldü">Sürüldü</option>
          </select>
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
          >
            <option value="">Seçiniz</option>
            {seasons.map((season) => (
              <option key={season._id} value={season._id}>
                {season.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="well" className="block text-neon-blue mb-2">
            Bağlı Kuyu
          </label>
          <select
            id="well"
            value={well}
            onChange={(e) => setWell(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
          >
            <option value="">Seçiniz</option>
            {wells.map((well) => (
              <option key={well._id} value={well._id}>
                {well.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="blockParcel" className="block text-neon-blue mb-2">
            Ada-Parsel
          </label>
          <input
            type="text"
            id="blockParcel"
            value={blockParcel}
            onChange={(e) => setBlockParcel(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            placeholder="132-45"
          />
        </div>
      </div>
      <div className="mb-4 flex items-center space-x-4">
        <label className="flex items-center text-neon-blue">
          <input
            type="checkbox"
            checked={isIrrigated}
            onChange={(e) => setIsIrrigated(e.target.checked)}
            className="mr-2"
          />
          Sulanan Tarla
        </label>
        <label className="flex items-center text-neon-blue">
          <input
            type="checkbox"
            checked={isRented}
            onChange={(e) => setIsRented(e.target.checked)}
            className="mr-2"
          />
          Kiralık
        </label>
        <label className="flex items-center text-neon-blue">
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e) => setIsShared(e.target.checked)}
            className="mr-2"
          />
          Ortak Tarla
        </label>
      </div>

      <div className="mb-4">
        <h3 className="text-neon-blue mb-2">Tarla Sahipleri</h3>
        {owners.map((owner, index) => (
          <div key={index} className="flex items-center mb-2">
            <select
              value={owner.userId}
              onChange={(e) =>
                handleOwnerChange(index, "userId", e.target.value)
              }
              className="w-1/2 p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink mr-2"
            >
              <option value="">Sahip Seçin</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={owner.ownershipPercentage}
              onChange={(e) =>
                handleOwnerChange(index, "ownershipPercentage", e.target.value)
              }
              className="w-1/4 p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink mr-2"
              placeholder="Yüzde"
              min="0"
              max="100"
              step="0.01"
              required
            />
            <button
              type="button"
              onClick={() => removeOwner(index)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Kaldır
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addOwner}
          className="bg-neon-blue text-white p-2 rounded mt-2"
        >
          Sahip Ekle
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-neon-blue mb-2">Ürün Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="product" className="block text-neon-blue mb-2">
              Ürün Ekle
            </label>
            <select
              id="product"
              onChange={(e) => handleAddProduct(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            >
              <option value="">Seçiniz</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} - {product.category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h4 className="text-neon-blue mb-2">Seçili Ürünler</h4>
            <ul>
              {fieldProducts.map((product) => (
                <li
                  key={product._id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{product.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product._id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Kaldır
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="cyberpunk-button w-full mt-4"
        disabled={isLoading}
      >
        {isLoading ? "İşleniyor..." : field ? "Güncelle" : "Tarla Ekle"}
      </button>
    </form>
  );
}
