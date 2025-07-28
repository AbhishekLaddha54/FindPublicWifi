import { Loader2, Wifi } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <Wifi className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
        <p className="text-gray-600">Loading WiFi Finder...</p>
      </div>
    </div>
  )
}
