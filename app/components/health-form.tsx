"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, FormEvent } from "react"
import { X, HelpCircle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { getHealthRecommendations } from "@/lib/ai-service"
import { HealthData, HealthReport } from "@/types/health"
import LoadingOverlay from "./loading-overlay"

interface HealthFormProps {
  onClose: () => void
  onSubmit: (data: HealthData & { recommendations: HealthReport }) => void
  initialData?: HealthData | null
}

export default function HealthForm({ onClose, onSubmit, initialData }: HealthFormProps) {
  const [height, setHeight] = useState(initialData?.height.toString() || "")
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm")
  const [heightFeet, setHeightFeet] = useState("")
  const [heightInches, setHeightInches] = useState("")
  const [weight, setWeight] = useState(initialData?.weight.toString() || "")
  const [age, setAge] = useState(initialData?.age.toString() || "")
  const [gender, setGender] = useState(initialData?.gender || "")
  const [activityLevel, setActivityLevel] = useState(initialData?.activityLevel || "")
  const [goal, setGoal] = useState(initialData?.goal || "")
  const [sleepHours, setSleepHours] = useState(initialData?.sleepHours || 7)
  const [stressLevel, setStressLevel] = useState(initialData?.stressLevel || 5)
  const [isLoading, setIsLoading] = useState(false)

  const calculateBMI = (weight: number, height: number): number => {
    const heightInMeters = height / 100
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
  }

  const convertToMetric = (feet: string, inches: string): number => {
    const totalInches = (Number(feet) * 12) + Number(inches)
    return Number((totalInches * 2.54).toFixed(1))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const heightInCm = heightUnit === "cm" 
        ? Number.parseFloat(height)
        : convertToMetric(heightFeet, heightInches)

      const bmi = calculateBMI(Number.parseFloat(weight), heightInCm)
      const healthData: HealthData = {
        height: heightInCm,
        weight: Number.parseFloat(weight),
        bmi,
        age: Number.parseInt(age),
        gender,
        activityLevel,
        goal,
        sleepHours,
        stressLevel,
      }

      const recommendations = await getHealthRecommendations(healthData)
      onSubmit({ ...healthData, recommendations })
      toast.success("Health analysis complete!")
      onClose()
    } catch (error) {
      console.error("Error processing health data:", error)
      toast.error("Failed to analyze health data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
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
          className="bg-white rounded-xl p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto"
        >
          <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-purple-800">Track Your Health</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="height" className="text-purple-700">
                Height
              </Label>
              <div className="flex gap-2 mt-1">
                <Select 
                  defaultValue={heightUnit} 
                  onValueChange={(value: "cm" | "ft") => setHeightUnit(value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="ft">ft</SelectItem>
                  </SelectContent>
                </Select>
                
                {heightUnit === "cm" ? (
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                    placeholder="Height in cm"
                    className="flex-1"
                  />
                ) : (
                  <div className="flex gap-2 flex-1">
                    <Input
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      required
                      placeholder="Feet"
                      min="0"
                      max="8"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      required
                      placeholder="Inches"
                      min="0"
                      max="11"
                      className="flex-1"
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="weight" className="text-purple-700">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="age" className="text-purple-700">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="gender" className="text-purple-700">
                Gender
              </Label>
              <Select onValueChange={setGender} required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="activityLevel" className="text-purple-700">
                Activity Level
              </Label>
              <Select onValueChange={setActivityLevel} required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="light">Lightly Active</SelectItem>
                  <SelectItem value="moderate">Moderately Active</SelectItem>
                  <SelectItem value="very">Very Active</SelectItem>
                  <SelectItem value="extra">Extra Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="goal" className="text-purple-700">
                Goal
              </Label>
              <Select onValueChange={setGoal} required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sleepHours" className="text-purple-700 flex items-center">
                Sleep Hours
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 ml-2 text-purple-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average hours of sleep per night</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Slider
                id="sleepHours"
                min={4}
                max={12}
                step={0.5}
                value={[sleepHours]}
                onValueChange={(value) => setSleepHours(value[0])}
                className="mt-2"
              />
              <div className="text-center mt-1 text-sm text-purple-600">{sleepHours} hours</div>
            </div>
            <div>
              <Label htmlFor="stressLevel" className="text-purple-700 flex items-center">
                Stress Level
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 ml-2 text-purple-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rate your stress level from 1 (low) to 10 (high)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Slider
                id="stressLevel"
                min={1}
                max={10}
                step={1}
                value={[stressLevel]}
                onValueChange={(value) => setStressLevel(value[0])}
                className="mt-2"
              />
              <div className="text-center mt-1 text-sm text-purple-600">{stressLevel}</div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Analyze Health Data"}
            </Button>
          </form>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay message="Analyzing your health data..." />
        )}
      </AnimatePresence>
    </>
  )
}

