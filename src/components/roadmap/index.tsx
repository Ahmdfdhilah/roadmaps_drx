import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { cn, getQuarterColor } from "../../lib/utils"
import { createAnnularSectorPath } from "../../lib/utils"
import { roadmapYears } from "../../lib/mock"

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
    const segmentAngle = Math.PI / 4 // 45 degrees per segment


    return (
        <div className="w-full mx-auto p-6">
            {/* Year Dropdown */}
            <div className="flex items-center justify-center">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-28 px-3 py-2 text-sm font-medium border rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-primary focus:outline-none">
                        <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl shadow-md border bg-white">
                        {roadmapYears.map((year) => (
                            <SelectItem
                                key={year.year}
                                value={year.year}
                                className="cursor-pointer px-3 py-2 text-sm hover:bg-primary/10 rounded-md transition-colors"
                            >
                                {year.year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Quarter Selector (Semicircle) */}
            <div className="flex justify-center mb-6">
                <svg
                    className="w-full min-w-4xl"
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                >
                    {quarters.map((quarter, index) => {
                        const startAngle = index * segmentAngle
                        const endAngle = startAngle + segmentAngle
                        const isActive = quarter === activeQuarter

                        const path = createAnnularSectorPath(cx, cy, outerR, innerR, startAngle, endAngle)

                        return (
                            <g key={quarter}>
                                <path
                                    d={path}
                                    className={`${getQuarterColor(isActive)} stroke-background stroke-2 cursor-pointer transition-all duration-200 hover:scale-101 focus:outline-none focus:ring-2 focus:ring-primary`}
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
                                    x={cx + ((outerR + innerR) / 2) * Math.cos(startAngle + segmentAngle / 2)}
                                    y={cy + ((outerR + innerR) / 2) * Math.sin(startAngle + segmentAngle / 2)}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-sm font-semibold fill-primary-foreground pointer-events-none"
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
                                        "h-full transition-all duration-300 cursor-pointer",
                                        activeQuarter === item.quarter
                                            ? "ring-2 ring-primary shadow-lg scale-105"
                                            : "hover:shadow-md hover:scale-102",
                                    )}
                                    onClick={() => setActiveQuarter(item.quarter)}
                                >
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    "px-2 py-1 rounded text-xs font-bold",
                                                    activeQuarter === item.quarter
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-secondary text-secondary-foreground",
                                                )}
                                            >
                                                {item.quarter}
                                            </span>
                                            {item.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-sm leading-relaxed">{item.description}</CardDescription>
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
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span className="px-3 py-1 rounded bg-primary text-primary-foreground text-sm font-bold">
                                            {activeQuarterData.quarter}
                                        </span>
                                        {activeQuarterData.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
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