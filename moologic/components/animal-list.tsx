"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const animals = Array(9).fill({
  earTag: "#876364",
  age: "2 years old",
  status: "Pregnant",
})

export function AnimalList({ onSelectAnimal }) {
  return (
    <div className="bg-white rounded-lg border">
      {/* Filters */}
      <div className="p-4 border-b grid grid-cols-3 gap-4">
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Ear tag no" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ear Tags</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Ear tag no" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Ear tag no" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Ear tag no</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {animals.map((animal, index) => (
            <TableRow key={index} className="cursor-pointer hover:bg-gray-50" onClick={() => onSelectAnimal(animal)}>
              <TableCell className="font-medium">{animal.earTag}</TableCell>
              <TableCell>{animal.age}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700">
                  {animal.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

