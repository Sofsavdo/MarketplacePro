'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Camera, X, RotateCw, Check } from 'lucide-react'
import { ImageProcessor } from '@/lib/image-processor'

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  onCancel: () => void
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
      }
    } catch (error) {
      console.error('Camera error:', error)
      alert('Kamera ochishda xatolik. Iltimos, kamera ruxsatini bering.')
    }
  }, [facingMode])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }, [stream])

  const capturePhoto = useCallback(async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        let imageData = canvas.toDataURL('image/jpeg', 0.9)
        
        try {
          imageData = await ImageProcessor.processForAI(imageData)
        } catch (error) {
          console.error('Image processing error:', error)
        }
        
        setCapturedImage(imageData)
        stopCamera()
      }
    }
  }, [stopCamera])

  const retake = useCallback(() => {
    setCapturedImage(null)
    startCamera()
  }, [startCamera])

  const confirm = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage)
      stopCamera()
    }
  }, [capturedImage, onCapture, stopCamera])

  const switchCamera = useCallback(() => {
    stopCamera()
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }, [stopCamera])

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              stopCamera()
              onCancel()
            }}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-white font-semibold">Mahsulot rasmga olish</h2>
          <button
            onClick={switchCamera}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition"
          >
            <RotateCw className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Camera/Image View */}
      <div className="flex-1 flex items-center justify-center relative">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="max-w-full max-h-full object-contain"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Capture Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-80 h-80 border-4 border-white/50 rounded-2xl">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl"></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50 to-transparent">
        {capturedImage ? (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={retake}
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition font-semibold"
            >
              Qayta olish
            </button>
            <button
              onClick={confirm}
              className="px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Tasdiqlash
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <button
              onClick={capturePhoto}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition shadow-lg"
            >
              <div className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full"></div>
            </button>
          </div>
        )}

        <p className="text-center text-white/80 text-sm mt-4">
          {capturedImage 
            ? 'Rasm yaxshi ko\'rinsa tasdiqlang' 
            : 'Mahsulotni ramkaga joylashtiring va rasmga oling'}
        </p>
      </div>
    </div>
  )
}
