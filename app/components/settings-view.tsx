"use client"

import { motion } from "framer-motion"
import { HelpCircle, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 max-w-2xl mx-auto space-y-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Settings</h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-purple-100">
              <HelpCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Help & Support</div>
              <div className="text-sm text-gray-600">Get assistance</div>
            </div>
          </div>
          <div className="text-sm text-purple-600 cursor-pointer hover:text-purple-700">
            Contact
          </div>
        </div>

        <Card className="mt-8 border-0 shadow-sm bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-full bg-purple-100">
                <Info className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">About This Project</h3>
            </div>
            <Separator className="mb-4 bg-gray-200" />
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-medium text-base text-gray-900">Developed by:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ibad Khan</li>
                <li>Musfirah Kamran</li>
                <li>Sameer Rashid</li>
                <li>Haris Ameen</li>
              </ul>
              <p className="mt-4 pt-2 border-t border-gray-200">
                A project for Sir Syed University of Engineering & Technology (SSUET)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

