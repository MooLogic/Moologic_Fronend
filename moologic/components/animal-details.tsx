"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AnimalDetails({ animal }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Animal Details</h1>

      <Tabs defaultValue="info">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Basic Info</TabsTrigger>
          <TabsTrigger value="health">Health Records</TabsTrigger>
          <TabsTrigger value="milk">Milk Production</TabsTrigger>
          <TabsTrigger value="breeding">Breeding History</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="space-y-6">
            {/* Image and Basic Info */}
            <div className="rounded-lg overflow-hidden">
              <img
                src={animal.image || "/placeholder.svg?height=400&width=600"}
                alt={`Animal ${animal.earTag}`}
                className="w-full h-[200px] object-cover"
              />
              <div className="text-xs text-center mt-1 text-gray-500">© PONI CAMERA</div>
            </div>

            {/* Basic Information */}
            <Card>
              <CardContent className="pt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Ear tag Number:</div>
                  <div className="font-medium">{animal.earTag}</div>
                </div>
                <div>
                  <div className="text-gray-500">Birth date:</div>
                  <div className="font-medium">{animal.birthDate}</div>
                </div>
                <div>
                  <div className="text-gray-500">Breed:</div>
                  <div className="font-medium">{animal.breed}</div>
                </div>
                <div>
                  <div className="text-gray-500">Blood level:</div>
                  <div className="font-medium">{animal.bloodLevel}</div>
                </div>
                <div>
                  <div className="text-gray-500">Sire ID:</div>
                  <div className="font-medium">{animal.sireId}</div>
                </div>
                <div>
                  <div className="text-gray-500">Dam ID:</div>
                  <div className="font-medium">{animal.damId}</div>
                </div>
                <div>
                  <div className="text-gray-500">Status:</div>
                  <div className="font-medium">{animal.status}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="health">
          {/* Status Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-base">Status</CardTitle>
              <div className="text-indigo-600 font-medium text-sm">Calving</div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="text-sm">
                <div>Calf</div>
                <div>Date before being heifer: 12/12/2024</div>
              </div>
              <Button variant="outline" className="w-full">
                Detail
              </Button>
            </CardContent>
          </Card>

          {/* Treatments Section */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base">Treatments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <Button variant="outline" className="w-full justify-start bg-indigo-600 text-white hover:bg-indigo-700">
                Examination History
              </Button>
              <Button variant="outline" className="w-full justify-start bg-indigo-600 text-white hover:bg-indigo-700">
                Vaccination History
              </Button>
            </CardContent>
          </Card>

          {/* Activities Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-base">Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="text-sm text-gray-500">No recent activity</div>
              <Button variant="outline" className="w-full">
                Detail
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milk">
          {/* Milk Yield Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-base">Milk yield/ Lactation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="text-sm">
                <div>Weekly Average: none</div>
                <div>Lactation Stage: None</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700">
                  Milk yeild
                </Button>
                <Button variant="outline" className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700">
                  Lactation Curve
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breeding">
          {/* Calving Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-base">Calving</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="text-sm">
                <div>Calving Count: 0</div>
                <div>Last calving date: None</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700">
                  Add calving
                </Button>
                <Button variant="outline" className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700">
                  Pregnancy check
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Insemination Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-base">Insemination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="text-sm">
                <div>Insemination Count: 0</div>
                <div>Insemination Status: None</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Detail page
                </Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

