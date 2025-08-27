import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const createAnnularSectorPath = (
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number,
): string => {
  const x1 = cx + outerR * Math.cos(startAngle)
  const y1 = cy + outerR * Math.sin(startAngle)
  const x2 = cx + outerR * Math.cos(endAngle)
  const y2 = cy + outerR * Math.sin(endAngle)
  const x3 = cx + innerR * Math.cos(endAngle)
  const y3 = cy + innerR * Math.sin(endAngle)
  const x4 = cx + innerR * Math.cos(startAngle)
  const y4 = cy + innerR * Math.sin(startAngle)

  const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0
  const sweepFlag = 1

  return [
    `M ${x1} ${y1}`,
    `A ${outerR} ${outerR} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
    "Z",
  ].join(" ")
}

export const getQuarterColor = (isActive: boolean) => {
  if (isActive) {
    return "fill-primary"
  }
  return "hover:fill-primary"
}