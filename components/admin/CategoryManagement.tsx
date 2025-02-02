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
import { Edit, Trash2, Plus } from "lucide-react";
import type { Category } from "@/types/category";
import React from "react";

export default function CategoryManagement() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Kategoriler yüklenirken bir hata oluştu");
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
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName, isSubcategory: false }),
      });
      if (!response.ok) {
        throw new Error("Kategori eklenirken bir hata oluştu");
      }
      setNewCategoryName("");
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParentCategory) {
      setError("Lütfen bir ana kategori seçin");
      return;
    }
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSubcategoryName,
          parent: selectedParentCategory,
          isSubcategory: true,
        }),
      });
      if (!response.ok) {
        throw new Error("Alt kategori eklenirken bir hata oluştu");
      }
      setNewSubcategoryName("");
      setSelectedParentCategory("");
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  };

  const handleEditCategory = async (category: Category) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const response = await fetch(`/api/categories/${editingCategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });
      if (!response.ok) {
        throw new Error("Kategori güncellenirken bir hata oluştu");
      }
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Kategori silinirken bir hata oluştu");
        }
        fetchCategories();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    }
  };

  const mainCategories = categories.filter((cat) => !cat.isSubcategory);

  if (isLoading)
    return <div className="text-neon-pink animate-pulse">Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card className="bg-[#0a0c10] border-[#1b1f2a] overflow-hidden shadow-[0_0_15px_rgba(0,255,255,0.1)]">
      <CardHeader className="border-b border-[#1b1f2a]">
        <CardTitle className="text-xl font-semibold text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Kategori Yönetimi
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          {/* Yeni Kategori Ekleme Formu */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Yeni Kategori Ekle
            </h3>
            <form
              onSubmit={handleAddCategory}
              className="flex flex-col sm:flex-row gap-2"
            >
              <Input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Kategori adı"
                className="flex-grow bg-gray-800/50 border-cyan-500/50 focus:border-cyan-400 text-cyan-100 placeholder:text-cyan-300/30"
              />
              <Button
                type="submit"
                className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
              >
                <Plus className="w-4 h-4 mr-2" /> Ekle
              </Button>
            </form>
          </div>

          {/* Yeni Alt Kategori Ekleme Formu */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              Yeni Alt Kategori Ekle
            </h3>
            <form
              onSubmit={handleAddSubcategory}
              className="flex flex-col gap-2"
            >
              <select
                value={selectedParentCategory}
                onChange={(e) => setSelectedParentCategory(e.target.value)}
                className="w-full p-2 bg-gray-800/50 rounded border border-purple-500/50 focus:border-purple-400 text-purple-100"
                required
              >
                <option value="">Ana Kategori Seçin</option>
                {mainCategories.map((cat) => (
                  <option key={cat._id.toString()} value={cat._id.toString()}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Input
                type="text"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="Alt kategori adı"
                className="bg-gray-800/50 border-purple-500/50 focus:border-purple-400 text-purple-100 placeholder:text-purple-300/30"
              />
              <Button
                type="submit"
                className="w-full sm:w-auto bg-purple-500 hover:bg-purple-400 text-black transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,0,255,0.5)]"
              >
                <Plus className="w-4 h-4 mr-2" /> Alt Kategori Ekle
              </Button>
            </form>
          </div>

          {/* Kategori Listesi */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-500">
              Kategori Listesi
            </h3>
            <div className="rounded-md border border-[#1b1f2a] shadow-[0_0_15px_rgba(255,0,255,0.1)]">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-[#1b1f2a]">
                    <TableHead className="w-[300px] text-cyan-400">
                      Kategori Adı
                    </TableHead>
                    <TableHead className="w-[200px] text-purple-400">
                      Tür
                    </TableHead>
                    <TableHead className="w-[200px] text-pink-400">
                      Ana Kategori
                    </TableHead>
                    <TableHead className="w-[150px] text-red-400 text-right">
                      İşlemler
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mainCategories.map((category) => (
                    <React.Fragment key={category._id.toString()}>
                      <TableRow className="hover:bg-gray-900/50 border-b border-[#1b1f2a] transition-colors">
                        <TableCell className="font-medium text-cyan-100">
                          {editingCategory &&
                          editingCategory._id.toString() ===
                            category._id.toString() ? (
                            <Input
                              type="text"
                              value={editingCategory.name}
                              onChange={(e) =>
                                setEditingCategory((prev) =>
                                  prev
                                    ? { ...prev, name: e.target.value }
                                    : null
                                )
                              }
                              className="bg-gray-800/50 border-cyan-500/50 focus:border-cyan-400 text-cyan-100"
                            />
                          ) : (
                            category.name
                          )}
                        </TableCell>
                        <TableCell className="text-purple-100">
                          Ana Kategori
                        </TableCell>
                        <TableCell className="text-pink-100">-</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {editingCategory &&
                            editingCategory._id.toString() ===
                              category._id.toString() ? (
                              <Button
                                onClick={handleUpdateCategory}
                                size="sm"
                                className="bg-cyan-500 hover:bg-cyan-400 text-black transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                              >
                                Kaydet
                              </Button>
                            ) : (
                              <>
                                <Button
                                  onClick={() => handleEditCategory(category)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-cyan-500 hover:text-cyan-400 hover:bg-cyan-900/20 transition-all duration-300"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() =>
                                    handleDeleteCategory(
                                      category._id.toString()
                                    )
                                  }
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      {categories
                        .filter(
                          (subCat) =>
                            subCat.parent?._id?.toString() ===
                            category._id.toString()
                        )
                        .map((subCategory) => (
                          <TableRow
                            key={subCategory._id.toString()}
                            className="hover:bg-gray-900/50 border-b border-[#1b1f2a] transition-colors"
                          >
                            <TableCell className="font-medium text-cyan-100 pl-8">
                              {editingCategory &&
                              editingCategory._id.toString() ===
                                subCategory._id.toString() ? (
                                <Input
                                  type="text"
                                  value={editingCategory.name}
                                  onChange={(e) =>
                                    setEditingCategory((prev) =>
                                      prev
                                        ? { ...prev, name: e.target.value }
                                        : null
                                    )
                                  }
                                  className="bg-gray-800/50 border-cyan-500/50 focus:border-cyan-400 text-cyan-100"
                                />
                              ) : (
                                subCategory.name
                              )}
                            </TableCell>
                            <TableCell className="text-purple-100">
                              Alt Kategori
                            </TableCell>
                            <TableCell className="text-pink-100">
                              {category.name}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                {editingCategory &&
                                editingCategory._id.toString() ===
                                  subCategory._id.toString() ? (
                                  <Button
                                    onClick={handleUpdateCategory}
                                    size="sm"
                                    className="bg-cyan-500 hover:bg-cyan-400 text-black transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                                  >
                                    Kaydet
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      onClick={() =>
                                        handleEditCategory(subCategory)
                                      }
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-cyan-500 hover:text-cyan-400 hover:bg-cyan-900/20 transition-all duration-300"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleDeleteCategory(
                                          subCategory._id.toString()
                                        )
                                      }
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-900/20 transition-all duration-300"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
