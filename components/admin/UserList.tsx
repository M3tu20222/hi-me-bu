"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { User } from "@/types/user";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Kullanıcılar yüklenirken bir hata oluştu");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) return <div className="text-neon-pink">Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-gray-900 shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold text-neon-blue">
          Kullanıcı Listesi
        </h2>
        <Link href="/admin/users/add" className="btn-neon-pink">
          Yeni Kullanıcı Ekle
        </Link>
      </div>
      <table className="w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3 text-left text-neon-blue">Ad Soyad</th>
            <th className="p-3 text-left text-neon-blue">E-posta</th>
            <th className="p-3 text-left text-neon-blue">Rol</th>
            <th className="p-3 text-left text-neon-blue">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-gray-800">
              <td className="p-3 text-neon-pink">{user.name}</td>
              <td className="p-3 text-white">{user.email}</td>
              <td className="p-3 text-neon-blue">{user.role}</td>
              <td className="p-3">
                <Link
                  href={`/admin/users/edit/${user._id}`}
                  className="btn-neon-blue mr-2"
                >
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="btn-neon-pink"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  async function handleDelete(userId: string) {
    if (window.confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Kullanıcı silinirken bir hata oluştu");
        }
        setUsers(users.filter((user) => user._id !== userId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Bir hata oluştu");
      }
    }
  }
}
