"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Activity, Clipboard, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import HealthForm from "./health-form"
import HealthReport from "./health-report"
import { HealthData, HealthReport as HealthReportType } from "@/types/health"

interface HealthTrackingViewProps {
  onHealthSubmit: (data: HealthData & { recommendations: HealthReportType }) => void
  existingData: HealthData | null
}

export default function HealthTrackingView({ onHealthSubmit, existingData }: HealthTrackingViewProps) {
  const [showHealthForm, setShowHealthForm] = useState(false)
  const [showHealthReport, setShowHealthReport] = useState(false)
  const [healthReport, setHealthReport] = useState<HealthReportType | null>(null)

  const handleHealthSubmit = async (data: HealthData & { recommendations: HealthReportType }) => {
    try {
      setHealthReport(data.recommendations)
      setShowHealthReport(true)
      onHealthSubmit(data)
    } catch (error) {
      console.error("Error processing health data:", error)
      toast.error("Failed to generate health recommendations. Please try again.")
    }
  }

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "underweight"
    if (bmi < 25) return "normal weight"
    if (bmi < 30) return "overweight"
    return "obese"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 space-y-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-purple-800">Health Tracking</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-6 w-6" />
              Track Your Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Log your health data and get personalized recommendations.</p>
            <Button
              onClick={() => setShowHealthForm(true)}
              variant="secondary"
              className="w-full bg-white text-purple-700 hover:bg-gray-100"
            >
              {existingData ? "Update Health Check" : "Start Health Check"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Clipboard className="mr-2 h-6 w-6 text-purple-500" />
              Latest Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">View your most recent health analysis and recommendations.</p>
            <Button
              onClick={() => setShowHealthReport(true)}
              variant="outline"
              className="w-full"
              disabled={!healthReport && !existingData?.recommendations}
            >
              View Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-6 w-6 text-purple-500" />
              Health Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">Discover trends and patterns in your health data over time.</p>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {showHealthForm && (
        <HealthForm 
          onClose={() => setShowHealthForm(false)} 
          onSubmit={handleHealthSubmit}
          initialData={existingData}
        />
      )}

      {showHealthReport && (healthReport || existingData?.recommendations) && (
        <HealthReport 
          report={healthReport || existingData?.recommendations!} 
          onClose={() => setShowHealthReport(false)} 
        />
      )}
    </motion.div>
  )
}

