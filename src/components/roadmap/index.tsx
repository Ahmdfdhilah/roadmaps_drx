import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { roadmapYears } from "../../lib/mock"
import { cn, createAnnularSectorPath, getQuarterColor } from "../../lib/utils"

export default function InteractiveRoadmap() {
    const [selectedYear, setSelectedYear] = useState("2024")
    const [activeQuarter, setActiveQuarter] = useState("Q1")

    const currentYearData = roadmapYears.find((year) => year.year === selectedYear)?.roadmapData || []
    const activeQuarterData = currentYearData.find((item) => item.quarter === activeQuarter)
    const quarters = ["Q1", "Q2", "Q3", "Q4"]

    // SVG configuration 
    const svgWidth = 1080
    const svgHeight = 200
    const cx = svgWidth / 2
    const cy = 50
    const outerR = 140
    const innerR = 70

    const totalAngle = Math.PI // 180 degrees semicircle
    const segmentAngle = totalAngle / 4 // 45 degrees per segment
    const startOffset = Math.PI // Start from left (180 degrees)

    return (
        <div className="w-full mx-auto">
            {/* Year Dropdown */}
            <div className="flex items-center justify-center absolute left-1/2 top-1/4 -translate-x-1/2 z-999">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger >
                        <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                        {roadmapYears.map((year) => (
                            <SelectItem
                                key={year.year}
                                value={year.year}
                            >
                                {year.year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Quarter Selector (Semicircle) */}
            <div className="flex justify-center mb-2 relative">
                <svg
                    className="w-full min-w-3xl"
                    viewBox={`0 0 ${svgWidth} ${svgHeight + 100}`}
                >
                    {quarters.map((quarter, index) => {
                        // Calculate angles for left-to-right arrangement
                        const startAngle = startOffset - (index * segmentAngle)
                        const endAngle = startAngle - segmentAngle
                        const isActive = quarter === activeQuarter
                        const midAngle = startAngle - (segmentAngle / 2)

                        const path = createAnnularSectorPath(cx, cy, outerR, innerR, endAngle, startAngle)

                        // Calculate connector line positions
                        const outerX = cx + outerR * Math.cos(midAngle)
                        const outerY = cy + outerR * Math.sin(midAngle)

                        // Extended line points for better visual connection
                        const extendDistance = 30
                        const extendedX = cx + (outerR + extendDistance) * Math.cos(midAngle)
                        const extendedY = cy + (outerR + extendDistance) * Math.sin(midAngle)

                        // Determine line endpoint based on quarter position (left to right)
                        let lineEndX, lineEndY
                        const positions = [
                            { x: svgWidth * 0.20, y: svgHeight + 70 }, // Q1 - far left
                            { x: svgWidth * 0.38, y: svgHeight + 85 }, // Q2 - left-center
                            { x: svgWidth * 0.62, y: svgHeight + 85 }, // Q3 - right-center
                            { x: svgWidth * 0.80, y: svgHeight + 70 }  // Q4 - far right
                        ]

                        lineEndX = positions[index].x
                        lineEndY = positions[index].y

                        return (
                            <g key={quarter}>
                                {/* Connector Line */}
                                <line
                                    x1={outerX}
                                    y1={outerY}
                                    x2={extendedX}
                                    y2={extendedY}
                                    className={`transition-all duration-300 ${isActive
                                        ? "stroke-primary stroke-2 opacity-100"
                                        : "stroke-gray-500 stroke-1 opacity-50"
                                        }`}
                                />

                                {/* Extended connector to content area */}
                                <line
                                    x1={extendedX}
                                    y1={extendedY}
                                    x2={lineEndX}
                                    y2={lineEndY}
                                    className={`transition-all duration-300 ${isActive
                                        ? "stroke-primary stroke-2 opacity-80"
                                        : "stroke-gray-500 stroke-1 opacity-30"
                                        }`}
                                    strokeDasharray="5,5"
                                />

                                {/* Connection dot at the end */}
                                <circle
                                    cx={lineEndX}
                                    cy={lineEndY}
                                    r="4"
                                    className={`transition-all duration-300 ${isActive
                                        ? "fill-primary opacity-100"
                                        : "fill-gray-500 opacity-50"
                                        }`}
                                />

                                {/* Quarter Path */}
                                <path
                                    d={path}
                                    className={`${getQuarterColor(isActive)} stroke-white stroke-2 cursor-pointer transition-all duration-300 hover:scale-101 focus:outline-none focus:ring-2 focus:ring-primary drop-shadow-sm`}
                                    onClick={() => setActiveQuarter(quarter)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`${quarter} quarter trigger, year ${selectedYear}`}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            setActiveQuarter(quarter)
                                        }
                                    }}
                                />

                                {/* Quarter Label */}
                                <text
                                    x={cx + ((outerR + innerR) / 2) * Math.cos(midAngle)}
                                    y={cy + ((outerR + innerR) / 2) * Math.sin(midAngle)}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-sm font-bold fill-white pointer-events-none select-none"
                                >
                                    {quarter}
                                </text>

                                {/* Quarter indicator line below */}
                                <text
                                    x={lineEndX}
                                    y={lineEndY + 25}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className={`text-xs font-semibold transition-all duration-300 pointer-events-none select-none ${isActive
                                        ? "fill-primary opacity-100"
                                        : "fill-gray-500 opacity-70"
                                        }`}
                                >
                                    {quarter}
                                </text>
                            </g>
                        )
                    })}
                </svg>
            </div>

            {/* Desktop: Grid view showing all quarters */}
            <div className="hidden md:block">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <AnimatePresence mode="wait">
                        {currentYearData.map((item, index) => (
                            <motion.div
                                key={`${selectedYear}-${item.id}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                    ease: "easeOut",
                                }}
                            >
                                <Card
                                    className={cn(
                                        "h-full transition-all duration-300 cursor-pointer hover:shadow-lg",
                                        activeQuarter === item.quarter
                                            ? "ring-2 ring-primary shadow-lg  bg-primary/20"
                                            : "hover:shadow-md  bg-white",
                                    )}
                                    onClick={() => setActiveQuarter(item.quarter)}
                                >
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <span
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-bold transition-colors",
                                                    activeQuarter === item.quarter
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-200 text-gray-700",
                                                )}
                                            >
                                                {item.quarter}
                                            </span>
                                            <span className="text-gray-800">{item.title}</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-sm leading-relaxed text-gray-600">
                                            {item.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Mobile: Single card view */}
            <div className="md:hidden">
                <AnimatePresence mode="wait">
                    {activeQuarterData && (
                        <motion.div
                            key={`${selectedYear}-${activeQuarterData.id}-mobile`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <Card className="shadow-lg bg-primary/20 border border-primary">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full bg-primary text-white text-sm font-bold">
                                            {activeQuarterData.quarter}
                                        </span>
                                        <span className="text-gray-800">{activeQuarterData.title}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed text-gray-700">
                                        {activeQuarterData.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}