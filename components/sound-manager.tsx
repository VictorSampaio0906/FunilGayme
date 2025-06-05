"use client"

import { useRef, useCallback } from "react"

interface SoundManagerProps {
  enabled?: boolean
}

export const useSoundManager = ({ enabled = true }: SoundManagerProps = {}) => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const isBackgroundMusicPlayingRef = useRef(false)

  // Preload audio files
  const preloadSound = useCallback(
    (soundName: string, src: string, isBackgroundMusic = false) => {
      if (typeof window !== "undefined") {
        try {
          const audio = new Audio(src)
          audio.preload = "auto"
          audio.crossOrigin = "anonymous"

          if (isBackgroundMusic) {
            audio.loop = true
            audio.volume = enabled ? 0.15 : 0 // Slightly higher volume for background music
            backgroundMusicRef.current = audio

            // Add event listeners for debugging
            audio.addEventListener("loadstart", () => console.log("Background music: Load started"))
            audio.addEventListener("canplay", () => console.log("Background music: Can play"))
            audio.addEventListener("canplaythrough", () => console.log("Background music: Can play through"))
            audio.addEventListener("error", (e) => console.error("Background music error:", e))
            audio.addEventListener("play", () => {
              console.log("Background music: Started playing")
              isBackgroundMusicPlayingRef.current = true
            })
            audio.addEventListener("pause", () => {
              console.log("Background music: Paused")
              isBackgroundMusicPlayingRef.current = false
            })
          } else {
            audio.volume = enabled ? 0.4 : 0
            audioRefs.current[soundName] = audio
          }
        } catch (error) {
          console.warn(`Failed to preload sound: ${soundName}`, error)
        }
      }
    },
    [enabled],
  )

  // Play background music with user interaction handling
  const playBackgroundMusic = useCallback(async () => {
    if (!enabled || !backgroundMusicRef.current) {
      console.log("Background music: Not enabled or not loaded")
      return
    }

    try {
      console.log("Attempting to play background music...")

      // Reset to beginning if already playing
      if (isBackgroundMusicPlayingRef.current) {
        backgroundMusicRef.current.currentTime = 0
      }

      const playPromise = backgroundMusicRef.current.play()

      if (playPromise !== undefined) {
        await playPromise
        console.log("Background music: Successfully started")
      }
    } catch (error) {
      console.warn("Failed to play background music:", error)

      // If autoplay is blocked, we'll try again on next user interaction
      if (error.name === "NotAllowedError") {
        console.log("Autoplay blocked - will retry on next user interaction")
      }
    }
  }, [enabled])

  // Stop background music
  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current && isBackgroundMusicPlayingRef.current) {
      console.log("Stopping background music...")
      backgroundMusicRef.current.pause()
      backgroundMusicRef.current.currentTime = 0
      isBackgroundMusicPlayingRef.current = false
    }
  }, [])

  // Play a sound effect
  const playSound = useCallback(
    async (soundName: string) => {
      if (!enabled) return

      try {
        const audio = audioRefs.current[soundName]
        if (audio) {
          // Reset audio to beginning and play
          audio.currentTime = 0
          const playPromise = audio.play()

          if (playPromise !== undefined) {
            await playPromise
          }
        } else {
          console.warn(`Sound not found: ${soundName}`)
        }
      } catch (error) {
        console.warn(`Error playing sound: ${soundName}`, error)
      }
    },
    [enabled],
  )

  // Set volume for a specific sound
  const setVolume = useCallback((soundName: string, volume: number) => {
    const audio = audioRefs.current[soundName]
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume))
    }
  }, [])

  // Set volume for all sounds
  const setGlobalVolume = useCallback((volume: number) => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.volume = Math.max(0, Math.min(1, volume * 0.4)) // Sound effects
    })

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = Math.max(0, Math.min(1, volume * 0.15)) // Background music quieter
    }
  }, [])

  // Stop a sound
  const stopSound = useCallback((soundName: string) => {
    const audio = audioRefs.current[soundName]
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  // Stop all sounds
  const stopAllSounds = useCallback(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
    stopBackgroundMusic()
  }, [stopBackgroundMusic])

  // Check if background music is playing
  const isBackgroundMusicPlaying = useCallback(() => {
    return isBackgroundMusicPlayingRef.current
  }, [])

  return {
    preloadSound,
    playSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    setVolume,
    setGlobalVolume,
    stopSound,
    stopAllSounds,
    isBackgroundMusicPlaying,
  }
}

export default useSoundManager
