"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Expense } from "@/types/expense";
import type { Category } from "@/types/category";

interface ExpenseFormProps {
  expense?: Expense;
}

export default function ExpenseForm({ expense }: ExpenseFormProps) {
  const [amount, setAmount] = useState(expense?.amount ?? 0);
  const [date, setDate] = useState(
    expense?.date
      ? new Date(expense.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState<string>(
    expense?.category?.toString() ?? ""
  );
  const [subcategory, setSubcategory] = useState<string>(
    expense?.subcategory?.toString() ?? ""
  );
  const [description, setDescription] = useState(expense?.description ?? "");
  const [status, setStatus] = useState<Expense["status"]>(
    expense?.status ?? "Beklemede"
  );
  const [expenseType, setExpenseType] = useState<Expense["expenseType"]>(
    expense?.expenseType ?? "Peşin"
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Kategoriler yüklenirken bir hata oluştu");
        }
        const data = await response.json();
        setCategories(data.filter((cat: Category) => !cat.isSubcategory));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      const fetchSubcategories = async () => {
        try {
          const response = await fetch(`/api/categories?parent=${category}`);
          if (!response.ok) {
            throw new Error("Alt kategoriler yüklenirken bir hata oluştu");
          }
          const data = await response.json();
          setSubcategories(data);
        } catch (err) {
          console.error("Error fetching subcategories:", err);
        }
      };

      fetchSubcategories();
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const expenseData = {
      amount,
      date,
      category,
      subcategory,
      description,
      status,
      expenseType,
    };

    try {
      const response = await fetch(
        expense ? `/api/expenses/${expense._id}` : "/api/expenses",
        {
          method: expense ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expenseData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      router.push("/expenses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 shadow-lg rounded-lg p-6 cyberpunk-border"
    >
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="amount" className="block text-neon-blue mb-2">
            Miktar
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-neon-blue mb-2">
            Tarih
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-neon-blue mb-2">
            Kategori
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          >
            <option value="">Kategori Seçin</option>
            {categories.map((cat) => (
              <option key={cat._id.toString()} value={cat._id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="subcategory" className="block text-neon-blue mb-2">
            Alt Kategori
          </label>
          <select
            id="subcategory"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          >
            <option value="">Alt Kategori Seçin</option>
            {subcategories.map((subcat) => (
              <option key={subcat._id.toString()} value={subcat._id.toString()}>
                {subcat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-neon-blue mb-2">
            Açıklama
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            onChange={(e) => setStatus(e.target.value as Expense["status"])}
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          >
            <option value="Ödendi">Ödendi</option>
            <option value="Beklemede">Beklemede</option>
            <option value="İptal Edildi">İptal Edildi</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="expenseType" className="block text-neon-blue mb-2">
            Ödeme Tipi
          </label>
          <select
            id="expenseType"
            value={expenseType}
            onChange={(e) =>
              setExpenseType(e.target.value as Expense["expenseType"])
            }
            className="w-full p-2 bg-gray-800 rounded border border-neon-blue focus:border-neon-pink"
            required
          >
            <option value="Peşin">Peşin</option>
            <option value="Kredi">Kredi</option>
            <option value="Kredi Kartı">Kredi Kartı</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="cyberpunk-button w-full mt-4"
        disabled={isLoading}
      >
        {isLoading ? "İşleniyor..." : expense ? "Güncelle" : "Gider Ekle"}
      </button>
    </form>
  );
}
