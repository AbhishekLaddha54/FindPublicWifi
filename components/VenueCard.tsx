"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Wifi, Clock, Navigation, WifiOff } from "lucide-react"
import type { Venue } from "@/lib/types"

interface VenueCardProps {
  venue: Venue
}

export default function VenueCard({ venue }: VenueCardProps) {
  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lon}`
    window.open(url, "_blank")
  }

  const getWifiStrength = (rssi?: number) => {
    if (!rssi) return 0
    if (rssi > -50) return 4
    if (rssi > -60) return 3
    if (rssi > -70) return 2
    return 1
  }

  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`
    } else if (distance < 10000) {
      return `${(distance / 1000).toFixed(1)}km`
    } else {
      return `${Math.round(distance / 1000)}km`
    }
  }

  const getWalkTime = (distance: number) => {
    const walkingSpeed = 5000 // 5 km/h in m/h
    const timeInMinutes = Math.round((distance / walkingSpeed) * 60)
    return Math.max(1, timeInMinutes)
  }

  const getCategoryIcon = (amenity: string) => {
    switch (amenity) {
      case "library":
        return "📚"
      case "coworking_space":
        return "💼"
      default:
        return "☕"
    }
  }

  const getCategoryName = (amenity: string) => {
    switch (amenity) {
      case "library":
        return "Library"
      case "coworking_space":
        return "Coworking"
      default:
        return "Cafe"
    }
  }

  const wifiStrength = getWifiStrength(venue.wifi?.rssi)
  const isOpen = venue.opening?.isOpen ?? true // Assume open if no data

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getCategoryIcon(venue.amenity || "cafe")}</span>
            <h3 className="font-semibold text-gray-900 truncate">{venue.name || "Unnamed Venue"}</h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Badge variant="secondary" className="text-xs">
              {getCategoryName(venue.amenity || "cafe")}
            </Badge>
            {isOpen ? (
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                <Clock className="h-3 w-3 mr-1" />
                Open
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Closed
              </Badge>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            {venue.wifi ? (
              <>
                <Wifi className="h-4 w-4 text-blue-600" />
                <div className="flex">
                  {[1, 2, 3, 4].map((bar) => (
                    <div key={bar} className={`w-1 h-3 mx-px ${bar <= wifiStrength ? "bg-blue-600" : "bg-gray-300"}`} />
                  ))}
                </div>
              </>
            ) : (
              <WifiOff className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <p className="text-xs text-gray-500">{venue.wifi?.ssid || "Free WiFi"}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{formatDistance(venue.distance)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Navigation className="h-4 w-4" />
            <span>{getWalkTime(venue.distance)} min walk</span>
          </div>
        </div>

        <Button size="sm" onClick={getDirections} className="bg-blue-600 hover:bg-blue-700">
          <Navigation className="h-4 w-4 mr-1" />
          Directions
        </Button>
      </div>

      {venue.wifi?.lastSeen && (
        <p className="text-xs text-gray-500 mt-2">
          Wi-Fi last seen: {new Date(venue.wifi.lastSeen).toLocaleDateString()}
        </p>
      )}
    </Card>
  )
}
