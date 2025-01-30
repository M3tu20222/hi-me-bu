"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
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

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function UserList() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleDelete = async (userId: string) => {
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
  };

  if (isLoading) return <div className="text-neon-pink">Yükleniyor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="border-b border-gray-800">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-white">
            Kullanıcı Listesi
          </CardTitle>
          {session?.user.role === "Admin" && (
            <Link href="/admin/users/add" className="cyberpunk-button">
              Yeni Kullanıcı Ekle
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-neon-blue">Ad Soyad</TableHead>
              <TableHead className="text-neon-blue">E-posta</TableHead>
              <TableHead className="text-neon-blue">Rol</TableHead>
              <TableHead className="text-neon-blue">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} className="border-gray-800">
                <TableCell className="text-white">{user.name}</TableCell>
                <TableCell className="text-white">{user.email}</TableCell>
                <TableCell className="text-white">{user.role}</TableCell>
                <TableCell className="space-x-2">
                  <Link
                    href={`/admin/users/edit/${user._id}`}
                    className="text-neon-blue hover:text-neon-pink inline-block"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-neon-pink hover:text-neon-blue inline-block"
                  >
                    <Trash2 size={18} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
