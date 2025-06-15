import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  description?: string
  fullScreen?: boolean
}

const LoadingState = ({ 
  message = 'Loading...', 
  description = 'Please wait while we fetch the data',
  fullScreen = false 
}: LoadingStateProps) => {
  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center p-4"
    : "min-h-[400px] flex items-center justify-center p-4"

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-ajira-accent animate-spin mx-auto mb-4" />
        <h2 className="text-lg font-medium text-gray-900">{message}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  )
}

export default LoadingState 