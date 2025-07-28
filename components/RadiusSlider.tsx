"use client"

import { Slider } from "@/components/ui/slider"

interface RadiusSliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
}

export default function RadiusSlider({ value, onValueChange }: RadiusSliderProps) {
  // Create a more intelligent step system
  const getStep = (currentValue: number) => {
    if (currentValue <= 2000) return 250 // 250m steps up to 2km
    if (currentValue <= 5000) return 500 // 500m steps up to 5km
    if (currentValue <= 10000) return 1000 // 1km steps up to 10km
    return 2500 // 2.5km steps above 10km
  }

  const formatRadius = (radius: number) => {
    if (radius < 1000) {
      return `${radius}m`
    } else if (radius < 10000) {
      return `${(radius / 1000).toFixed(1)}km`
    } else {
      return `${Math.round(radius / 1000)}km`
    }
  }

  const getRadiusDescription = (radius: number) => {
    if (radius <= 500) return "Walking distance"
    if (radius <= 2000) return "Neighborhood"
    if (radius <= 5000) return "Local area"
    if (radius <= 10000) return "District"
    if (radius <= 20000) return "City-wide"
    return "Metropolitan area"
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">Search Radius: {formatRadius(value[0])}</label>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{getRadiusDescription(value[0])}</span>
      </div>

      <Slider
        value={value}
        onValueChange={onValueChange}
        max={25000}
        min={250}
        step={getStep(value[0])}
        className="w-full"
      />

      <div className="flex justify-between text-xs text-gray-400">
        <span>250m</span>
        <span>2.5km</span>
        <span>10km</span>
        <span>25km</span>
      </div>
    </div>
  )
}
