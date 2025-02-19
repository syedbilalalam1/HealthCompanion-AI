"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HealthReport as HealthReportType } from "@/types/health"

interface HealthReportProps {
  report: HealthReportType
  onClose: () => void
}

export default function HealthReport({ report, onClose }: HealthReportProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-purple-800">Your Health Report</h2>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{report.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Meal Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-3">
                {report.mealPlan.map((meal, index) => (
                  <li key={index} className="text-gray-700">{meal}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exercise Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-3">
                {report.exercises.map((exercise, index) => (
                  <li key={index} className="text-gray-700">{exercise}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lifestyle Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-3">
                {report.lifestyle.map((tip, index) => (
                  <li key={index} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Button onClick={onClose} className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white">
          Close Report
        </Button>
      </motion.div>
    </motion.div>
  )
}

