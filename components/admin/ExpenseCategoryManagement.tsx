"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";
import type { IExpenseCategory } from "@/models/ExpenseCategory";

interface PopulatedExpenseCategory
  extends Omit<IExpenseCategory, "parentCategory"> {
  parentCategory?: { _id: string; name: string } | null;
}

export default function ExpenseCategoryManagement() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<PopulatedExpenseCategory[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryParent, setNewCategoryParent] = useState<string>("none");
  const [editingCategory, setEditingCategory] =
    useState<PopulatedExpenseCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/expense-categories");
      if (!response.ok) {
        throw new Error("Gider kategorileri yüklenirken bir hata oluştu");
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/expense-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName,
          parentCategory:
            newCategoryParent === "none" ? null : newCategoryParent,
        }),
      });
      if (!response.ok) {
        throw new Error("Gider kategorisi eklenirken bir hata oluştu");
      }
      setNewCategoryName("");
      setNewCategoryParent("none");
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  };

  const handleEditCategory = (category: PopulatedExpenseCategory) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const response = await fetch(
        `/api/expense-categories/${editingCategory._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editingCategory.name,
            parentCategory: editingCategory.parentCategory?._id || null,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Gider kategorisi güncellenirken bir hata oluştu");
      }
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (
      window.confirm(
        "Bu gider kategorisini silmek istediğinizden emin misiniz?"
      )
    ) {
      try {
        const response = await fetch(`/api/expense-categories/${categoryId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Gider kategorisi silinirken bir hata oluştu"
          );
        }
        fetchCategories();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
        console.error("Gider kategorisi silme hatası:", err);
      }
    }
  };

  if (isLoading)
    return (
      <div className="text-center p-4 text-neon-blue animate-pulse">
        Yükleniyor...
      </div>
    );
  if (error)
    return <div className="text-center text-neon-pink p-4">{error}</div>;

  return (
    <Card className="w-full bg-gray-900 border border-neon-blue shadow-lg shadow-neon-blue/50">
      <CardHeader className="border-b border-neon-blue">
        <CardTitle className="text-2xl font-bold text-neon-pink">
          Gider Kategorileri Yönetimi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddCategory} className="mb-6 space-y-4">
          <div>
            <Input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Yeni kategori adı"
              className="bg-gray-800 border-neon-blue text-white placeholder-gray-400"
            />
          </div>
          <div>
            <Select
              value={newCategoryParent}
              onValueChange={(value) => setNewCategoryParent(value)}
            >
              <SelectTrigger className="bg-gray-800 border-neon-blue text-white">
                <SelectValue placeholder="Üst kategori seçin (opsiyonel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Üst Kategori Yok</SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category._id.toString()}
                    value={category._id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="bg-neon-blue hover:bg-neon-pink text-black font-bold"
          >
            Kategori Ekle
          </Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow className="border-b border-neon-blue">
              <TableHead className="text-neon-pink">Kategori Adı</TableHead>
              <TableHead className="text-neon-pink">Üst Kategori</TableHead>
              <TableHead className="text-neon-pink">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category._id.toString()}
                className="border-b border-gray-800"
              >
                <TableCell className="text-neon-blue">
                  {editingCategory && editingCategory._id === category._id ? (
                    <Input
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      className="bg-gray-800 border-neon-blue text-white"
                    />
                  ) : (
                    category.name
                  )}
                </TableCell>
                <TableCell className="text-neon-green">
                  {category.parentCategory ? category.parentCategory.name : "-"}
                </TableCell>
                <TableCell>
                  {editingCategory && editingCategory._id === category._id ? (
                    <Button
                      onClick={handleUpdateCategory}
                      className="mr-2 bg-neon-blue hover:bg-neon-pink text-black"
                    >
                      Kaydet
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleEditCategory(category)}
                        className="mr-2 bg-neon-blue hover:bg-neon-pink text-black"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() =>
                          handleDeleteCategory(category._id.toString())
                        }
                        className="bg-neon-pink hover:bg-neon-blue text-black"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
