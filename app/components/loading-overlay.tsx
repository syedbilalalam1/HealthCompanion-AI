"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  message: string
}

export default function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-purple-600" />
        </motion.div>
        <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
      </motion.div>
    </motion.div>
  )
} 