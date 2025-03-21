"use client"

import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function AnimalTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs font-medium">Ear Tag No</TableHead>
          <TableHead className="text-xs font-medium">Expected Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((animal, index) => (
          <motion.tr
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border-b"
            whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
          >
            <TableCell className="py-3 text-sm">{animal.earTagNo}</TableCell>
            <TableCell className="py-3 text-sm">{animal.expectedDate}</TableCell>
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  )
}

