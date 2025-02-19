import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PostureGuideView({ setActiveView }) {
  const postureGuides = [
    {
      title: "Sitting Posture",
      description: "Keep your back straight, shoulders relaxed, and feet flat on the floor.",
      tips: [
        "Adjust your chair height so your feet are flat on the floor",
        "Keep your knees at or below hip level",
        "Maintain a small gap between the back of your knees and the chair",
        "Support your lower back with a cushion if needed",
      ],
    },
    {
      title: "Standing Posture",
      description: "Stand tall with your weight evenly distributed on both feet.",
      tips: [
        "Keep your shoulders back and relaxed",
        "Tuck your stomach in",
        "Keep your head level and in line with your body",
        "Let your arms hang naturally at your sides",
      ],
    },
    {
      title: "Sleeping Posture",
      description: "Maintain a neutral spine position while sleeping.",
      tips: [
        "Use a pillow that keeps your neck aligned with your spine",
        "If you sleep on your side, place a pillow between your knees",
        "If you sleep on your back, place a small pillow under your knees",
        "Avoid sleeping on your stomach",
      ],
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 space-y-6"
    >
      <Button variant="ghost" className="mb-4" onClick={() => setActiveView("home")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>

      <h2 className="text-2xl font-bold mb-6">Posture Guide</h2>

      {postureGuides.map((guide, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
            <p className="text-gray-600 mb-4">{guide.description}</p>
            <ul className="space-y-2">
              {guide.tips.map((tip, tipIndex) => (
                <li key={tipIndex} className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  )
}

