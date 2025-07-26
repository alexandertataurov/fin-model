import React, { useState, useCallback } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Progress } from './ui/progress'
import { Alert, AlertDescription } from './ui/alert'
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react'

interface FileUploadState {
  file: File | null
  progress: number
  status: 'idle' | 'uploading' | 'success' | 'error'
  error?: string
}

export function FileUpload() {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    progress: 0,
    status: 'idle'
  })
  const [isDragOver, setIsDragOver] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const validateFile = (file: File): string | null => {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/json'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid file (Excel, CSV, or JSON)'
    }
    
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB'
    }
    
    return null
  }

  const processFile = (file: File) => {
    const error = validateFile(file)
    if (error) {
      setUploadState({
        file: null,
        progress: 0,
        status: 'error',
        error
      })
      return
    }

    setUploadState({
      file,
      progress: 0,
      status: 'uploading'
    })

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadState(prev => {
        if (prev.progress >= 100) {
          clearInterval(interval)
          return {
            ...prev,
            progress: 100,
            status: 'success'
          }
        }
        return {
          ...prev,
          progress: prev.progress + 10
        }
      })
    }, 200)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      processFile(files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const reset = () => {
    setUploadState({
      file: null,
      progress: 0,
      status: 'idle'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Financial Data</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supports Excel, CSV, and JSON files up to 10MB
            </p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv,.json"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" size="sm" asChild>
                <span>Browse Files</span>
              </Button>
            </label>
          </div>

          {uploadState.file && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <File className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadState.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadState.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {uploadState.status === 'idle' && (
                  <Button variant="ghost" size="sm" onClick={reset}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {uploadState.status === 'uploading' && (
                <div className="space-y-2">
                  <Progress value={uploadState.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    Uploading... {uploadState.progress}%
                  </p>
                </div>
              )}

              {uploadState.status === 'success' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    File uploaded successfully! Data has been processed and is ready to use.
                  </AlertDescription>
                </Alert>
              )}

              {uploadState.status === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {uploadState.error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {uploadState.status === 'success' && (
            <div className="flex gap-2">
              <Button onClick={reset} variant="outline" className="flex-1">
                Upload Another
              </Button>
              <Button onClick={() => setIsOpen(false)} className="flex-1">
                Continue
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}