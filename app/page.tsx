"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Wifi, Loader2, Filter } from "lucide-react"
import VenueCard from "@/components/VenueCard"
import type { Venue } from "@/lib/types"
import { calculateDistance } from "@/lib/utils"
import RadiusSlider from "@/components/RadiusSlider"
import { fetchVenuesClientSide } from "@/lib/fetchVenues"

export default function HomePage() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [radius, setRadius] = useState([2000]) // Start with 2km instead of 1km
  const [filters, setFilters] = useState({
    cafe: true,
    library: true,
    coworking: true,
  })
  const [error, setError] = useState<string | null>(null)

  const getLocation = () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lon: longitude })
        fetchVenues(latitude, longitude)
      },
      (error) => {
        setError("Unable to get your location. Please try again.")
        setLoading(false)
        console.error("Geolocation error:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const fetchVenues = async (lat: number, lon: number) => {
    try {
      setLoading(true)

      // Use client-side fetching instead of API route
      const venuesData = await fetchVenuesClientSide(lat, lon, radius[0])

      // Calculate distances and sort
      const venuesWithDistance = venuesData
        .map((venue: Venue) => ({
          ...venue,
          distance: calculateDistance(lat, lon, venue.lat, venue.lon),
        }))
        .sort((a: Venue, b: Venue) => a.distance - b.distance)

      setVenues(venuesWithDistance)
    } catch (error) {
      setError("Failed to load venues. Please try again.")
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVenues = venues.filter((venue) => {
    const category = venue.amenity || "cafe"
    return filters[category as keyof typeof filters]
  })

  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filter]: !prev[filter] }))
  }

  useEffect(() => {
    if (location) {
      fetchVenues(location.lat, location.lon)
    }
  }, [radius])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wifi className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">WiFi Finder</h1>
          </div>
          <p className="text-gray-600 text-sm">Find open venues with free Wi-Fi near you</p>
        </div>

        {/* Location Button */}
        {!location && (
          <Card className="p-6 mb-6 text-center">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Find Wi-Fi Near You</h2>
            <p className="text-gray-600 text-sm mb-4">
              We'll show you cafes, libraries, and coworking spaces with free Wi-Fi
            </p>
            <Button onClick={getLocation} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting location...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Use My Location
                </>
              )}
            </Button>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-6 border-red-200 bg-red-50">
            <p className="text-red-600 text-sm">{error}</p>
          </Card>
        )}

        {/* Filters and Controls */}
        {location && (
          <Card className="p-4 mb-6">
            <div className="space-y-4">
              {/* Radius Slider */}
              <RadiusSlider value={radius} onValueChange={setRadius} />

              {/* Category Filters */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <Filter className="inline h-4 w-4 mr-1" />
                  Categories
                </label>
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant={filters.cafe ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFilter("cafe")}
                  >
                    Cafes
                  </Badge>
                  <Badge
                    variant={filters.library ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFilter("library")}
                  >
                    Libraries
                  </Badge>
                  <Badge
                    variant={filters.coworking ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFilter("coworking")}
                  >
                    Coworking
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && location && (
          <Card className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-gray-600">Finding venues with free Wi-Fi...</p>
          </Card>
        )}

        {/* Venues List */}
        {!loading && filteredVenues.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{filteredVenues.length} venues found</h2>
              <Button variant="outline" size="sm" onClick={() => location && fetchVenues(location.lat, location.lon)}>
                Refresh
              </Button>
            </div>
            {filteredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && location && filteredVenues.length === 0 && venues.length > 0 && (
          <Card className="p-6 text-center">
            <p className="text-gray-600">No venues match your current filters.</p>
          </Card>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>Data from WiGLE CC-BY-SA | © OpenStreetMap contributors | Nominatim</p>
        </footer>
      </div>
    </div>
  )
}
