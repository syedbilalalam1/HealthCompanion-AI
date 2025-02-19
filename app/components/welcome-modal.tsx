import { motion } from "framer-motion"
import { Activity, Camera, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WelcomeModal({ onClose }) {
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
        className="bg-white rounded-xl p-6 max-w-sm w-full"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Posture Fix!</h2>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Track Your Posture</h3>
              <p className="text-sm text-gray-600">Log your posture metrics and get personalized recommendations</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Camera className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Posture Analysis</h3>
              <p className="text-sm text-gray-600">Get AI-powered feedback on your posture (Coming Soon)</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Track Progress</h3>
              <p className="text-sm text-gray-600">Monitor your posture improvement over time</p>
            </div>
          </div>
        </div>

        <Button onClick={onClose} className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white">
          Get Started
        </Button>
      </motion.div>
    </motion.div>
  )
}

