export interface RoadmapData {
  id: string
  quarter: string
  title: string
  description: string
}

export interface RoadmapYear {
  year: string
  roadmapData: RoadmapData[]
}
