"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Camera, ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import LoadingOverlay from "./loading-overlay"
import { detectAndClassifyPose, drawPose } from "@/lib/pose-service"
import type { PoseDetectionResult } from "@/lib/pose-service"

interface YogaPostureAnalysisProps {
  setActiveView: (view: string) => void
}

export default function YogaPostureAnalysis({ setActiveView }: YogaPostureAnalysisProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)
  const [currentPose, setCurrentPose] = useState<PoseDetectionResult | null>(null)
  const animationFrameRef = useRef<number>()
  const [isVideoReady, setIsVideoReady] = useState(false)

  // Start camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640,
          height: 480,
          facingMode: "user"
        } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
        setShowInstructions(false)
        setIsVideoReady(true)
        startPoseDetection()
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast.error("Could not access camera. Please check permissions.")
    }
  }

  // Stop camera stream
  const stopCamera = () => {
    console.log('Stopping camera/video')
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => {
        track.stop()
        console.log(`Stopped track: ${track.kind}`)
      })
      videoRef.current.srcObject = null
    }
    if (videoRef.current?.src) {
      URL.revokeObjectURL(videoRef.current.src)
      videoRef.current.src = ""
      console.log('Revoked video URL')
    }
    setCameraActive(false)
    setCurrentPose(null)
    setIsVideoReady(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      console.log('Cancelled animation frame')
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
      console.log('Reset file input')
    }
  }

  // Handle file upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      toast.error("No file selected")
      return
    }

    // Log file details for debugging
    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    })

    if (!file.type.startsWith('video/')) {
      toast.error(`Invalid file type: ${file.type}. Please upload a video file.`)
      return
    }

    try {
      // First show the video element
      setShowInstructions(false)
      
      // Wait for state update to complete
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Clean up previous video if any
      stopCamera()
      setIsAnalyzing(true)
      toast.info("Processing video...")

      // Check if video element exists
      if (!videoRef.current) {
        console.error('Video element not found in DOM')
        toast.error("Video element not found. Please try again.")
        setShowInstructions(true)
        setIsAnalyzing(false)
        return
      }

      const videoUrl = URL.createObjectURL(file)
      console.log('Created video URL:', videoUrl)

      // Reset video element completely
      videoRef.current.pause()
      videoRef.current.removeAttribute('src')
      videoRef.current.load()
      
      // Configure video element
      videoRef.current.src = videoUrl
      videoRef.current.controls = false
      videoRef.current.loop = true
      videoRef.current.muted = true
      videoRef.current.playsInline = true
      videoRef.current.crossOrigin = "anonymous"

      // Create a promise to handle video loading
      const videoLoadPromise = new Promise((resolve, reject) => {
        if (!videoRef.current) return reject('Video element not found')

        const handleLoadedMetadata = () => {
          console.log('Video metadata loaded:', {
            duration: videoRef.current?.duration,
            videoWidth: videoRef.current?.videoWidth,
            videoHeight: videoRef.current?.videoHeight
          })
          resolve(null)
        }

        const handleError = (e: Event) => {
          console.error('Video loading error:', e)
          reject(new Error('Failed to load video'))
        }

        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true })
        videoRef.current.addEventListener('error', handleError, { once: true })
      })

      // Wait for video to load
      await videoLoadPromise
      setIsVideoReady(true)
      setIsAnalyzing(false)

      // Start playback
      try {
        await videoRef.current.play()
        console.log('Video playback started')
        setCameraActive(true)
        startPoseDetection()
        toast.success("Video analysis started")
      } catch (error) {
        console.error("Error playing video:", error)
        toast.error(`Failed to play video: ${error instanceof Error ? error.message : 'Unknown error'}`)
        stopCamera()
      }
    } catch (error) {
      console.error("Error handling video upload:", error)
      toast.error(`Failed to process video: ${error instanceof Error ? error.message : 'Unknown error'}`)
      stopCamera()
      setShowInstructions(true)
      setIsAnalyzing(false)
    }
  }

  // Start pose detection loop
  const startPoseDetection = async () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas element not found', {
        videoElement: !!videoRef.current,
        canvasElement: !!canvasRef.current
      })
      return
    }

    console.log('Starting pose detection')

    // Wait for video to be ready
    if (!videoRef.current.readyState || videoRef.current.readyState < 2) {
      console.log('Waiting for video to be ready...')
      await new Promise<void>((resolve) => {
        const checkReady = () => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            resolve()
          } else {
            requestAnimationFrame(checkReady)
          }
        }
        checkReady()
      })
    }

    // Ensure canvas dimensions match video
    if (videoRef.current.videoWidth && videoRef.current.videoHeight) {
      canvasRef.current.width = videoRef.current.videoWidth
      canvasRef.current.height = videoRef.current.videoHeight
      console.log('Canvas dimensions set:', {
        width: canvasRef.current.width,
        height: canvasRef.current.height,
        videoWidth: videoRef.current.videoWidth,
        videoHeight: videoRef.current.videoHeight
      })
    }

    // Start the detection loop
    console.log('Starting detection loop')
    detectPose()
  }

  const detectPose = async () => {
    const video = videoRef.current
    if (!video?.paused && !video?.ended && isVideoReady && canvasRef.current) {
      try {
        // We can safely use video here since we've checked it exists above
        const videoState = {
          time: video.currentTime,
          readyState: video.readyState,
          paused: video.paused,
          ended: video.ended
        }
        console.log('Processing frame:', videoState)

        const result = await detectAndClassifyPose(video, canvasRef.current)
        
        if (result) {
          setCurrentPose(result)
        }
      } catch (error) {
        console.error('Error in pose detection:', error)
        toast.error(`Pose detection error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } else {
      console.log('Skipping frame:', {
        paused: video?.paused,
        ended: video?.ended,
        isVideoReady,
        hasCanvas: !!canvasRef.current
      })
    }

    // Continue detection loop only if camera/video is active
    if (cameraActive) {
      animationFrameRef.current = requestAnimationFrame(detectPose)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => setActiveView("home")}
        >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

        <Card className="w-full bg-white shadow-md">
          <CardContent className="p-6">
            <div className="bg-purple-100 rounded-full p-4 mb-6 w-16 h-16 mx-auto flex items-center justify-center">
              <Camera className="w-8 h-8 text-purple-600" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-purple-800 text-center">AI Yoga Pose Analysis</h2>
            
            <div className="text-center space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-yellow-800 font-medium">🚧 Feature Coming Soon! 🚧</p>
                <p className="text-sm text-yellow-600 mt-2">
                  We're working on implementing an advanced pose detection system.
                  Check back soon for real-time pose analysis and feedback!
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 text-purple-700">Planned Features</h3>
                <ul className="space-y-3 text-sm text-gray-600 text-left">
                  <li className="flex items-start">
                    <Camera className="w-5 h-5 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                    <span>Real-time pose analysis using your camera</span>
                  </li>
                  <li className="flex items-start">
                    <Upload className="w-5 h-5 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                    <span>Video upload for detailed pose feedback</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Instant feedback on form and alignment</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                We appreciate your patience as we perfect this feature to provide the best possible yoga pose analysis experience.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


