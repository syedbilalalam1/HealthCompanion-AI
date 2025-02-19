import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const { frame } = await request.json()

    if (!frame) {
      return NextResponse.json(
        { error: 'No frame data provided' },
        { status: 400 }
      )
    }

    // Remove the data URL prefix to get the base64 data
    const base64Data = frame.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Create a temporary file path
    const tempDir = path.join(process.cwd(), 'tmp')
    
    // Create tmp directory if it doesn't exist
    if (!existsSync(tempDir)) {
      console.log('Creating tmp directory:', tempDir)
      await mkdir(tempDir, { recursive: true })
    }

    const tempFilePath = path.join(tempDir, `${uuidv4()}.jpg`)
    console.log('Saving frame to:', tempFilePath)

    // Write the frame to a temporary file
    await writeFile(tempFilePath, buffer)

    // Get the absolute path to the Python script
    const scriptPath = path.join(process.cwd(), 'classification model', 'analyze_pose.py')
    console.log('Running Python script:', scriptPath)

    // Run the Python script for pose detection
    const pythonProcess = spawn('python', [scriptPath, tempFilePath])

    let result = ''
    let error = ''

    // Collect data from the Python script
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString()
      console.log('Python stdout:', data.toString())
    })

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString()
      console.error('Python stderr:', data.toString())
    })

    // Wait for the Python script to finish
    const exitCode = await new Promise((resolve) => {
      pythonProcess.on('close', resolve)
    })

    // Clean up the temporary file
    try {
      await writeFile(tempFilePath, '')
    } catch (cleanupError) {
      console.error('Error cleaning up temp file:', cleanupError)
    }

    if (exitCode !== 0) {
      console.error('Python script failed with exit code:', exitCode)
      console.error('Error output:', error)
      return NextResponse.json(
        { error: `Python script failed: ${error}` },
        { status: 500 }
      )
    }

    try {
      const poseData = JSON.parse(result)
      return NextResponse.json(poseData)
    } catch (parseError) {
      console.error('Error parsing Python output:', parseError)
      console.error('Raw output:', result)
      return NextResponse.json(
        { error: 'Failed to parse pose analysis results' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error analyzing pose:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze pose' },
      { status: 500 }
    )
  }
} 