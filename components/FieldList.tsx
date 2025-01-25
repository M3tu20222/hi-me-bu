"use client"

import { useState, useEffect } from "react"
import type { Field } from "@/types"

export default function FieldList() {
  const [fields, setFields] = useState<Field[]>([])

  useEffect(() => {
    async function fetchFields() {
      const response = await fetch("/api/fields")
      const data = await response.json()
      setFields(data)
    }
    fetchFields()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tarlalar</h2>
      <ul>
        {fields.map((field) => (
          <li key={field._id} className="mb-2">
            <span className="font-semibold">{field.name}</span> - {field.size} dekar
          </li>
        ))}
      </ul>
    </div>
  )
}

