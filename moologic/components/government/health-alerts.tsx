"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, AlertTriangle, AlertCircle, Bug as Virus } from "lucide-react"
import { motion } from "framer-motion"

// Sample data for health alerts
const healthAlertsData = [
  {
    id: "ALERT-001",
    farmId: "FARM-DEF456",
    farmName: "Oromia Milk Producers",
    location: "Oromia",
    disease: "Mastitis",
    affectedAnimals: 5,
    reportDate: "2024-03-10",
    status: "active",
    severity: "medium",
    description: "Multiple cases of mastitis detected in lactating cows.",
  },
  {
    id: "ALERT-002",
    farmId: "FARM-JKL012",
    farmName: "Tigray Cattle Ranch",
    location: "Tigray",
    disease: "Foot and Mouth Disease",
    affectedAnimals: 12,
    reportDate: "2024-03-08",
    status: "active",
    severity: "high",
    description: "Suspected outbreak of Foot and Mouth Disease. Quarantine measures implemented.",
  },
  {
    id: "ALERT-003",
    farmId: "FARM-ABC123",
    farmName: "Anan Dairy Farm",
    location: "Addis Ababa",
    disease: "Respiratory Infection",
    affectedAnimals: 3,
    reportDate: "2024-03-05",
    status: "resolved",
    severity: "low",
    description: "Minor respiratory infections in calves. Treated with antibiotics.",
  },
  {
    id: "ALERT-004",
    farmId: "FARM-DEF456",
    farmName: "Oromia Milk Producers",
    location: "Oromia",
    disease: "Brucellosis",
    affectedAnimals: 2,
    reportDate: "2024-03-01",
    status: "under investigation",
    severity: "high",
    description: "Suspected cases of brucellosis. Testing in progress.",
  },
  {
    id: "ALERT-005",
    farmId: "FARM-GHI789",
    farmName: "Amhara Dairy Cooperative",
    location: "Amhara",
    disease: "Milk Fever",
    affectedAnimals: 1,
    reportDate: "2024-02-25",
    status: "resolved",
    severity: "medium",
    description: "One cow with milk fever after calving. Treated with calcium supplements.",
  },
]

export function HealthAlerts() {
  const [selectedAlert, setSelectedAlert] = useState(null)

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-red-500">Active</Badge>
      case "under investigation":
        return <Badge className="bg-amber-500">Under Investigation</Badge>
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>
      case "medium":
        return <Badge className="bg-amber-500">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const openAlertDetails = (alert) => {
    setSelectedAlert(alert)
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Health Alerts</CardTitle>
                <CardDescription>Disease outbreaks and health concerns</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Active: 2</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Under Investigation: 1</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Resolved: 2</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert ID</TableHead>
                  <TableHead>Farm</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Disease</TableHead>
                  <TableHead>Affected Animals</TableHead>
                  <TableHead>Report Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {healthAlertsData.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.id}</TableCell>
                    <TableCell>{alert.farmName}</TableCell>
                    <TableCell>{alert.location}</TableCell>
                    <TableCell>{alert.disease}</TableCell>
                    <TableCell>{alert.affectedAnimals}</TableCell>
                    <TableCell>{alert.reportDate}</TableCell>
                    <TableCell>{getStatusBadge(alert.status)}</TableCell>
                    <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openAlertDetails(alert)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alert Details Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Health Alert Details</DialogTitle>
            <DialogDescription>Detailed information about the selected health alert</DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Virus className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold text-lg">{selectedAlert.disease}</h3>
                    {getSeverityBadge(selectedAlert.severity)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Alert ID:</span>
                      <span className="font-medium">{selectedAlert.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Farm:</span>
                      <span>{selectedAlert.farmName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Farm ID:</span>
                      <span>{selectedAlert.farmId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span>{selectedAlert.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Affected Animals:</span>
                      <span>{selectedAlert.affectedAnimals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Report Date:</span>
                      <span>{selectedAlert.reportDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span>{getStatusBadge(selectedAlert.status)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-l pl-4">
                  <h3 className="font-semibold text-lg mb-4">Alert Information</h3>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedAlert.description}</p>
                  </div>

                  {selectedAlert.status === "active" && (
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-300">Active Alert</h4>
                          <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                            This health issue is currently active and requires immediate attention.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedAlert.status === "under investigation" && (
                    <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-2" />
                        <div>
                          <h4 className="font-medium text-amber-800 dark:text-amber-300">Under Investigation</h4>
                          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                            This health issue is currently being investigated by veterinary officials.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Recommended Actions</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      <li>Isolate affected animals</li>
                      <li>Implement biosecurity measures</li>
                      <li>Contact local veterinary services</li>
                      <li>Monitor other animals for symptoms</li>
                    </ul>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 mt-4">Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full">Dispatch Veterinary Team</Button>
                    <Button variant="outline" className="w-full">
                      Update Alert Status
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Farm Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

