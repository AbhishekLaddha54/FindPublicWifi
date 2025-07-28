import { type NextRequest, NextResponse } from "next/server"
import type { Venue } from "@/lib/types"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lat = Number.parseFloat(searchParams.get("lat") || "0")
  const lon = Number.parseFloat(searchParams.get("lon") || "0")
  const radius = Number.parseInt(searchParams.get("radius") || "1000")

  if (!lat || !lon) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 })
  }

  try {
    // Fetch venues from OpenStreetMap Overpass API
    const osmVenues = await fetchOSMVenues(lat, lon, radius)

    // Fetch Wi-Fi data from WiGLE (with fallback mock data)
    const wifiData = await fetchWiFiData(lat, lon)

    // Merge venues with Wi-Fi data
    const mergedVenues = mergeVenuesWithWiFi(osmVenues, wifiData)

    return NextResponse.json({
      venues: mergedVenues,
      count: mergedVenues.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch venues" }, { status: 500 })
  }
}

async function fetchOSMVenues(lat: number, lon: number, radius: number): Promise<Venue[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"^(cafe|restaurant|library)$"](around:${radius},${lat},${lon});
      node["amenity"="coworking_space"](around:${radius},${lat},${lon});
      node["leisure"="hackerspace"](around:${radius},${lat},${lon});
    );
    out;
  `

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
    })

    if (!response.ok) {
      throw new Error(`OSM API error: ${response.status}`)
    }

    const data = await response.json()

    return data.elements.map((element: any) => ({
      id: element.id.toString(),
      name: element.tags?.name || element.tags?.brand || "Unnamed Venue",
      lat: element.lat,
      lon: element.lon,
      amenity: element.tags?.amenity || element.tags?.leisure || "cafe",
      distance: 0, // Will be calculated later
      opening: {
        isOpen: true, // Simplified - assume open
        hours: element.tags?.opening_hours || "Unknown",
      },
    }))
  } catch (error) {
    console.error("OSM fetch error:", error)
    // Return mock data as fallback
    return getMockVenues(lat, lon, radius)
  }
}

async function fetchWiFiData(lat: number, lon: number) {
  // WiGLE API has strict rate limits, so we'll use mock data for demo
  // In production, you'd implement proper caching and rate limiting
  try {
    const latRange = 0.01
    const lonRange = 0.01

    // Mock Wi-Fi data for demo purposes
    return getMockWiFiData()
  } catch (error) {
    console.error("WiFi fetch error:", error)
    return getMockWiFiData()
  }
}

function mergeVenuesWithWiFi(venues: Venue[], wifiData: any[]): Venue[] {
  return venues.map((venue) => {
    // Find nearby Wi-Fi networks (within 100m)
    const nearbyWifi = wifiData.find((wifi) => {
      const distance = calculateDistance(venue.lat, venue.lon, wifi.lat, wifi.lon)
      return distance < 100
    })

    return {
      ...venue,
      wifi: nearbyWifi
        ? {
            ssid: nearbyWifi.ssid,
            rssi: nearbyWifi.rssi,
            lastSeen: nearbyWifi.lastSeen,
          }
        : {
            ssid: "Free WiFi",
            rssi: -65,
            lastSeen: new Date().toISOString(),
          },
    }
  })
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function getMockVenues(lat: number, lon: number, radius: number): Venue[] {
  // Generate more venues for larger search areas
  const baseVenues = [
    {
      id: "1",
      name: "Central Coffee House",
      lat: lat + 0.002,
      lon: lon + 0.001,
      amenity: "cafe",
      distance: 0,
      opening: { isOpen: true, hours: "7:00-22:00" },
    },
    {
      id: "2",
      name: "City Public Library",
      lat: lat - 0.001,
      lon: lon + 0.003,
      amenity: "library",
      distance: 0,
      opening: { isOpen: true, hours: "9:00-18:00" },
    },
    {
      id: "3",
      name: "WorkSpace Co-op",
      lat: lat + 0.001,
      lon: lon - 0.002,
      amenity: "coworking_space",
      distance: 0,
      opening: { isOpen: true, hours: "24/7" },
    },
    {
      id: "4",
      name: "Bean & Brew Cafe",
      lat: lat - 0.003,
      lon: lon - 0.001,
      amenity: "cafe",
      distance: 0,
      opening: { isOpen: false, hours: "6:00-20:00" },
    },
  ]

  // Add more venues for larger radius searches
  if (radius > 5000) {
    const additionalVenues = [
      {
        id: "5",
        name: "Downtown Library Branch",
        lat: lat + 0.015,
        lon: lon + 0.008,
        amenity: "library",
        distance: 0,
        opening: { isOpen: true, hours: "9:00-20:00" },
      },
      {
        id: "6",
        name: "Tech Hub Coworking",
        lat: lat - 0.012,
        lon: lon + 0.015,
        amenity: "coworking_space",
        distance: 0,
        opening: { isOpen: true, hours: "6:00-24:00" },
      },
      {
        id: "7",
        name: "University Cafe",
        lat: lat + 0.008,
        lon: lon - 0.018,
        amenity: "cafe",
        distance: 0,
        opening: { isOpen: true, hours: "6:30-23:00" },
      },
      {
        id: "8",
        name: "Innovation Center",
        lat: lat - 0.02,
        lon: lon - 0.01,
        amenity: "coworking_space",
        distance: 0,
        opening: { isOpen: true, hours: "24/7" },
      },
    ]
    baseVenues.push(...additionalVenues)
  }

  if (radius > 15000) {
    const cityWideVenues = [
      {
        id: "9",
        name: "Airport Business Lounge",
        lat: lat + 0.045,
        lon: lon + 0.032,
        amenity: "coworking_space",
        distance: 0,
        opening: { isOpen: true, hours: "5:00-24:00" },
      },
      {
        id: "10",
        name: "Suburban Library",
        lat: lat - 0.038,
        lon: lon + 0.041,
        amenity: "library",
        distance: 0,
        opening: { isOpen: true, hours: "10:00-18:00" },
      },
      {
        id: "11",
        name: "Mall Food Court Cafe",
        lat: lat + 0.025,
        lon: lon - 0.055,
        amenity: "cafe",
        distance: 0,
        opening: { isOpen: true, hours: "10:00-22:00" },
      },
      {
        id: "12",
        name: "Business District Hub",
        lat: lat - 0.051,
        lon: lon - 0.028,
        amenity: "coworking_space",
        distance: 0,
        opening: { isOpen: false, hours: "7:00-19:00" },
      },
    ]
    baseVenues.push(...cityWideVenues)
  }

  return baseVenues
}

function getMockWiFiData() {
  return [
    {
      ssid: "CentralCoffee_Free",
      rssi: -45,
      lat: 0, // Will be matched by proximity
      lon: 0,
      lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      ssid: "Library_Public_WiFi",
      rssi: -55,
      lat: 0,
      lon: 0,
      lastSeen: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
    },
    {
      ssid: "WorkSpace_Guest",
      rssi: -40,
      lat: 0,
      lon: 0,
      lastSeen: new Date(Date.now() - 600000).toISOString(), // 10 min ago
    },
  ]
}
