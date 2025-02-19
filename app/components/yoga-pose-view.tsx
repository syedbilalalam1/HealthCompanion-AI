import { motion } from "framer-motion"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function YogaPoseView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 h-full flex flex-col items-center justify-center text-center"
    >
      <div className="bg-purple-100 rounded-full p-6 mb-6">
        <Camera className="w-12 h-12 text-purple-600" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Posture Analysis</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Our AI-powered posture analysis feature is coming soon! You'll be able to upload photos or videos of your
        posture and receive instant feedback to improve your form and alignment.
      </p>
      <Button className="bg-purple-600 hover:bg-purple-700 text-white">Get Notified When It's Ready</Button>
    </motion.div>
  )
}

