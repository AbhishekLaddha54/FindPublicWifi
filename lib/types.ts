export interface Venue {
  id: string
  name: string
  lat: number
  lon: number
  amenity?: string
  distance: number
  wifi?: {
    ssid: string
    rssi: number
    lastSeen: string
  }
  opening?: {
    isOpen: boolean
    hours: string
  }
}

export interface WifiNetwork {
  ssid: string
  rssi: number
  lat: number
  lon: number
  lastSeen: string
}
