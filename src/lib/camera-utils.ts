// Camera utilities for mobile product scanning

export interface CameraConstraints {
  width?: number
  height?: number
  facingMode?: 'user' | 'environment'
  aspectRatio?: number
}

// Request camera access
export async function requestCameraAccess(
  constraints: CameraConstraints = {}
): Promise<MediaStream | null> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('Camera API not supported')
    return null
  }

  try {
    const defaultConstraints: MediaStreamConstraints = {
      video: {
        facingMode: constraints.facingMode || 'environment', // Back camera by default
        width: { ideal: constraints.width || 1920 },
        height: { ideal: constraints.height || 1080 },
        aspectRatio: constraints.aspectRatio || 16 / 9,
      },
      audio: false,
    }

    const stream = await navigator.mediaDevices.getUserMedia(defaultConstraints)
    return stream
  } catch (error) {
    console.error('Camera access denied:', error)
    return null
  }
}

// Stop camera stream
export function stopCameraStream(stream: MediaStream): void {
  stream.getTracks().forEach((track) => track.stop())
}

// Capture photo from video stream
export function capturePhoto(
  videoElement: HTMLVideoElement,
  quality: number = 0.95
): string | null {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(videoElement, 0, 0)

    return canvas.toDataURL('image/jpeg', quality)
  } catch (error) {
    console.error('Photo capture failed:', error)
    return null
  }
}

// Capture photo with specific dimensions
export function capturePhotoWithSize(
  videoElement: HTMLVideoElement,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.95
): string | null {
  try {
    const canvas = document.createElement('canvas')
    
    let width = videoElement.videoWidth
    let height = videoElement.videoHeight

    // Calculate new dimensions
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      width = width * ratio
      height = height * ratio
    }

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(videoElement, 0, 0, width, height)

    return canvas.toDataURL('image/jpeg', quality)
  } catch (error) {
    console.error('Photo capture failed:', error)
    return null
  }
}

// Get available cameras
export async function getAvailableCameras(): Promise<MediaDeviceInfo[]> {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return []
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.filter((device) => device.kind === 'videoinput')
  } catch (error) {
    console.error('Failed to get cameras:', error)
    return []
  }
}

// Switch camera (front/back)
export async function switchCamera(
  currentStream: MediaStream,
  facingMode: 'user' | 'environment'
): Promise<MediaStream | null> {
  stopCameraStream(currentStream)
  return requestCameraAccess({ facingMode })
}

// Check if device has camera
export async function hasCamera(): Promise<boolean> {
  const cameras = await getAvailableCameras()
  return cameras.length > 0
}

// Check if device has multiple cameras
export async function hasMultipleCameras(): Promise<boolean> {
  const cameras = await getAvailableCameras()
  return cameras.length > 1
}

// Apply filters to image
export function applyImageFilter(
  imageData: string,
  filter: 'brightness' | 'contrast' | 'grayscale' | 'none' = 'none'
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(imageData)
        return
      }

      ctx.drawImage(img, 0, 0)

      // Apply filter
      switch (filter) {
        case 'brightness':
          ctx.filter = 'brightness(1.2)'
          break
        case 'contrast':
          ctx.filter = 'contrast(1.2)'
          break
        case 'grayscale':
          ctx.filter = 'grayscale(100%)'
          break
        default:
          ctx.filter = 'none'
      }

      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.95))
    }
    img.src = imageData
  })
}

// Crop image
export function cropImage(
  imageData: string,
  cropArea: { x: number; y: number; width: number; height: number }
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = cropArea.width
      canvas.height = cropArea.height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(imageData)
        return
      }

      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      )

      resolve(canvas.toDataURL('image/jpeg', 0.95))
    }
    img.src = imageData
  })
}

// Rotate image
export function rotateImage(imageData: string, degrees: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      
      // Swap dimensions for 90 or 270 degree rotation
      if (degrees === 90 || degrees === 270) {
        canvas.width = img.height
        canvas.height = img.width
      } else {
        canvas.width = img.width
        canvas.height = img.height
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(imageData)
        return
      }

      // Rotate
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((degrees * Math.PI) / 180)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      resolve(canvas.toDataURL('image/jpeg', 0.95))
    }
    img.src = imageData
  })
}

// Add overlay to camera view (for guidance)
export function drawCameraOverlay(
  canvas: HTMLCanvasElement,
  type: 'rectangle' | 'circle' = 'rectangle'
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Draw semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(0, 0, width, height)

  // Draw cutout
  ctx.globalCompositeOperation = 'destination-out'

  if (type === 'rectangle') {
    const rectWidth = width * 0.8
    const rectHeight = height * 0.6
    const x = (width - rectWidth) / 2
    const y = (height - rectHeight) / 2

    ctx.fillRect(x, y, rectWidth, rectHeight)
  } else {
    const radius = Math.min(width, height) * 0.4
    const x = width / 2
    const y = height / 2

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
  }

  ctx.globalCompositeOperation = 'source-over'

  // Draw border
  ctx.strokeStyle = '#667eea'
  ctx.lineWidth = 3

  if (type === 'rectangle') {
    const rectWidth = width * 0.8
    const rectHeight = height * 0.6
    const x = (width - rectWidth) / 2
    const y = (height - rectHeight) / 2

    ctx.strokeRect(x, y, rectWidth, rectHeight)
  } else {
    const radius = Math.min(width, height) * 0.4
    const x = width / 2
    const y = height / 2

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.stroke()
  }

  // Draw corner markers for rectangle
  if (type === 'rectangle') {
    const rectWidth = width * 0.8
    const rectHeight = height * 0.6
    const x = (width - rectWidth) / 2
    const y = (height - rectHeight) / 2
    const cornerSize = 20

    ctx.strokeStyle = '#667eea'
    ctx.lineWidth = 4

    // Top-left
    ctx.beginPath()
    ctx.moveTo(x, y + cornerSize)
    ctx.lineTo(x, y)
    ctx.lineTo(x + cornerSize, y)
    ctx.stroke()

    // Top-right
    ctx.beginPath()
    ctx.moveTo(x + rectWidth - cornerSize, y)
    ctx.lineTo(x + rectWidth, y)
    ctx.lineTo(x + rectWidth, y + cornerSize)
    ctx.stroke()

    // Bottom-left
    ctx.beginPath()
    ctx.moveTo(x, y + rectHeight - cornerSize)
    ctx.lineTo(x, y + rectHeight)
    ctx.lineTo(x + cornerSize, y + rectHeight)
    ctx.stroke()

    // Bottom-right
    ctx.beginPath()
    ctx.moveTo(x + rectWidth - cornerSize, y + rectHeight)
    ctx.lineTo(x + rectWidth, y + rectHeight)
    ctx.lineTo(x + rectWidth, y + rectHeight - cornerSize)
    ctx.stroke()
  }
}

// Detect if image is blurry
export function isImageBlurry(imageData: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(false)
        return
      }

      ctx.drawImage(img, 0, 0)
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageDataObj.data

      // Simple blur detection using edge detection
      let edgeCount = 0
      const threshold = 30

      for (let i = 0; i < data.length; i += 4) {
        if (i + 4 < data.length) {
          const diff = Math.abs(data[i] - data[i + 4])
          if (diff > threshold) edgeCount++
        }
      }

      const edgeRatio = edgeCount / (data.length / 4)
      resolve(edgeRatio < 0.1) // If less than 10% edges, consider blurry
    }
    img.src = imageData
  })
}
