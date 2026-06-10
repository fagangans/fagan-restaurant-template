import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ease = {
  luxury: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  cinematic: [0.77, 0, 0.175, 1] as [number, number, number, number],
  smooth: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
}

export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: ease.luxury, delay },
  }),
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, ease: ease.luxury, delay },
  }),
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: ease.luxury, delay },
  }),
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}
