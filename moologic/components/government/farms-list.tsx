"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Eye, MapPin, Calendar, Users, MilkIcon as Cow } from "lucide-react"

// Sample farm data
const farmsData = [
  {
    id: "FARM-ABC123",
    name: "Anan Dairy Farm",
    owner: "Wondin Dereje",
    location: "Addis Ababa",
    type: "dairy",
    cattleCount: 234,
    lastInspection: "2024-02-15",
    complianceStatus: "compliant",
    healthStatus: "good",
  },
  {
    id: "FARM-DEF456",
    name: "Oromia Milk Producers",
    owner: "Tigist Haile",
    location: "Oromia",
    type: "dairy",
    cattleCount: 156,
    lastInspection: "2024-01-20",
    complianceStatus: "warning",
    healthStatus: "warning",
  },
  {
    id: "FARM-GHI789",
    name: "Amhara Dairy Cooperative",
    owner: "Dawit Mengistu",
    location: "Amhara",
    type: "dairy",
    cattleCount: 312,
    lastInspection: "2024-03-05",
    complianceStatus: "compliant",
    healthStatus: "good",
  },
  {
    id: "FARM-JKL012",
    name: "Tigray Cattle Ranch",
    owner: "Selam Tesfaye",
    location: "Tigray",
    type: "mixed",
    cattleCount: 178,
    lastInspection: "2024-02-28",
    complianceStatus: "non-compliant",
    healthStatus: "critical",
  },
  {
    id: "FARM-MNO345",
    name: "SNNPR Livestock Center",
    owner: "Abebe Kebede",
    location: "SNNPR",
    type: "beef",
    cattleCount: 95,
    lastInspection: "2024-01-10",
    complianceStatus: "compliant",
    healthStatus: "good",
  },
]

interface FarmsListProps {
  filters?: {
    region: string
    farmType: string
    searchQuery: string
  }
}

export function FarmsList({ filters }: FarmsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFarm, setSelectedFarm] = useState<(typeof farmsData)[0] | null>(null)

  // Filter farms based on filters
  const filteredFarms = farmsData.filter((farm) => {
    // Filter by region
    if (filters?.region !== "all" && farm.location.toLowerCase() !== filters?.region.replace("_", " ")) {
      return false
    }

    // Filter by farm type
    if (filters?.farmType !== "all" && farm.type !== filters?.farmType) {
      return false
    }

    // Filter by search query
    if (
      filters?.searchQuery &&
      !farm.name.toLowerCase().includes(filters?.searchQuery.toLowerCase()) &&
      !farm.id.toLowerCase().includes(filters?.searchQuery.toLowerCase()) &&
      !farm.owner.toLowerCase().includes(filters?.searchQuery.toLowerCase())
    ) {
      return false
    }

    if (
      searchTerm &&
      !farm.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !farm.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !farm.owner.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !farm.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    return true
  })

  const getComplianceBadge = (status) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-green-500">Compliant</Badge>
      case "warning":
        return <Badge className="bg-amber-500">Warning</Badge>
      case "non-compliant":
        return <Badge className="bg-red-500">Non-Compliant</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getHealthStatusBadge = (status) => {
    switch (status) {
      case "good":
        return <Badge className="bg-green-500">Good</Badge>
      case "warning":
        return <Badge className="bg-amber-500">Warning</Badge>
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const openFarmDetails = (farm) => {
    setSelectedFarm(farm)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Registered Farms</CardTitle>
        <CardDescription>View and manage all registered dairy farms in the system</CardDescription>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search farms..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">Filter</Button>
          <Button>Add Farm</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farm ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Owner</TableHead>
                  <TableHead className="hidden lg:table-cell">Cattle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No farms found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFarms.map((farm) => (
                    <TableRow key={farm.id}>
                      <TableCell className="font-medium">{farm.id}</TableCell>
                      <TableCell>{farm.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{farm.location}</TableCell>
                      <TableCell className="hidden lg:table-cell">{farm.owner}</TableCell>
                      <TableCell className="hidden lg:table-cell">{farm.cattleCount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            farm.complianceStatus === "compliant"
                              ? "success"
                              : farm.complianceStatus === "non-compliant"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {farm.complianceStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedFarm(farm)}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>{selectedFarm?.name}</DialogTitle>
                              <DialogDescription>Detailed information about this farm</DialogDescription>
                            </DialogHeader>
                            {selectedFarm && (
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Location</p>
                                      <p className="text-sm text-muted-foreground">{selectedFarm.location}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Last Inspection</p>
                                      <p className="text-sm text-muted-foreground">{selectedFarm.lastInspection}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Owner</p>
                                      <p className="text-sm text-muted-foreground">{selectedFarm.owner}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Cow className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Cattle Count</p>
                                      <p className="text-sm text-muted-foreground">{selectedFarm.cattleCount}</p>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Farm Type</p>
                                  <p className="text-sm text-muted-foreground">{selectedFarm.type}</p>
                                </div>
                                <div className="flex justify-between">
                                  <Button variant="outline">Schedule Inspection</Button>
                                  <Button>View Full Report</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

