"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

// Candy types
const CANDY_TYPES = ["🍬", "🍭", "🍫", "🍩", "🍪", "🍰"]

// Board size
const BOARD_SIZE = 6

interface GameBoardProps {
  onMatch: (matchSize: number, x: number, y: number) => void
  onSuccessfulSwap?: () => void
  onInvalidMove?: () => void
}

export default function GameBoard({ onMatch, onSuccessfulSwap, onInvalidMove }: GameBoardProps) {
  const [board, setBoard] = useState<string[][]>([])
  const [selectedCandy, setSelectedCandy] = useState<{ row: number; col: number } | null>(null)
  const [isSwapping, setIsSwapping] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Refs to track drag state
  const dragStartRef = useRef<{ row: number; col: number } | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  // Initialize the board
  useEffect(() => {
    initializeBoard()
  }, [])

  // Initialize board with random candies
  const initializeBoard = () => {
    const newBoard = Array(BOARD_SIZE)
      .fill(0)
      .map(() =>
        Array(BOARD_SIZE)
          .fill(0)
          .map(() => getRandomCandy()),
      )
    setBoard(newBoard)

    // Check for initial matches and replace them
    setTimeout(() => {
      checkAndRemoveMatches(newBoard)
    }, 500)
  }

  // Get a random candy
  const getRandomCandy = () => {
    return CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)]
  }

  // Handle candy click (for mobile tap)
  const handleCandyClick = (row: number, col: number) => {
    if (isSwapping || isChecking || isDragging) return

    if (selectedCandy === null) {
      // First selection
      setSelectedCandy({ row, col })
    } else {
      // Second selection - check if it's adjacent
      const isAdjacent =
        (Math.abs(selectedCandy.row - row) === 1 && selectedCandy.col === col) ||
        (Math.abs(selectedCandy.col - col) === 1 && selectedCandy.row === row)

      if (isAdjacent) {
        // Swap candies
        swapCandies(selectedCandy.row, selectedCandy.col, row, col)
      } else {
        // Invalid move - play sound and reset selection
        onInvalidMove?.()
        setSelectedCandy({ row, col })
      }

      // Reset selection if it was the same candy
      if (selectedCandy.row === row && selectedCandy.col === col) {
        setSelectedCandy(null)
      }
    }
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, row: number, col: number) => {
    if (isSwapping || isChecking) return

    // Simplify drag image handling - accept a small ghost image for better functionality
    e.dataTransfer.setData("text/plain", "")
    e.dataTransfer.effectAllowed = "move"

    setIsDragging(true)
    dragStartRef.current = { row, col }
    setSelectedCandy({ row, col })
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault()

    if (!dragStartRef.current || isSwapping || isChecking) return

    // Check if it's adjacent
    const isAdjacent =
      (Math.abs(dragStartRef.current.row - row) === 1 && dragStartRef.current.col === col) ||
      (Math.abs(dragStartRef.current.col - col) === 1 && dragStartRef.current.row === row)

    if (isAdjacent) {
      // Swap candies
      swapCandies(dragStartRef.current.row, dragStartRef.current.col, row, col)
    } else {
      // Invalid move
      onInvalidMove?.()
    }

    // Reset drag and selection
    dragStartRef.current = null
    setSelectedCandy(null)
    setIsDragging(false)
  }

  // Handle drag end
  const handleDragEnd = () => {
    dragStartRef.current = null
    setSelectedCandy(null)
    setIsDragging(false)
  }

  // Handle touch start for mobile drag
  const handleTouchStart = (e: React.TouchEvent, row: number, col: number) => {
    if (isSwapping || isChecking) return

    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    setSelectedCandy({ row, col })
  }

  // Handle touch move for mobile drag
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isSwapping || isChecking) return

    // Get current touch position
    const touch = e.touches[0]

    // Calculate distance moved
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y

    // Only process if moved enough to consider it a swipe (10px threshold)
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) return

    // Get the selected candy position
    if (!selectedCandy) return

    const { row, col } = selectedCandy

    // Determine direction of swipe
    let newRow = row
    let newCol = col

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      newCol = deltaX > 0 ? col + 1 : col - 1
    } else {
      // Vertical swipe
      newRow = deltaY > 0 ? row + 1 : row - 1
    }

    // Check if new position is valid
    if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
      // Swap candies
      swapCandies(row, col, newRow, newCol)

      // Reset touch tracking
      touchStartRef.current = null
      setSelectedCandy(null)

      // Prevent default to avoid scrolling
      e.preventDefault()
    } else {
      // Invalid move
      onInvalidMove?.()
      touchStartRef.current = null
      setSelectedCandy(null)
    }
  }

  // Handle touch end for mobile drag
  const handleTouchEnd = () => {
    touchStartRef.current = null
    setSelectedCandy(null)
  }

  // Swap two candies
  const swapCandies = async (row1: number, col1: number, row2: number, col2: number) => {
    setIsSwapping(true)

    // Create a new board with swapped candies
    const newBoard = JSON.parse(JSON.stringify(board)) // Deep copy to avoid reference issues
    const temp = newBoard[row1][col1]
    newBoard[row1][col1] = newBoard[row2][col2]
    newBoard[row2][col2] = temp

    setBoard(newBoard)

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Check for matches
    const hasMatches = await checkAndRemoveMatches(newBoard)

    if (hasMatches) {
      // Successful swap - play sound
      onSuccessfulSwap?.()
    } else {
      // Swap back if no matches
      const revertBoard = JSON.parse(JSON.stringify(newBoard)) // Deep copy
      revertBoard[row1][col1] = newBoard[row2][col2]
      revertBoard[row2][col2] = newBoard[row1][col1]
      setBoard(revertBoard)

      // Invalid move - play sound
      onInvalidMove?.()

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    setIsSwapping(false)
  }

  // Check for matches and remove them
  const checkAndRemoveMatches = async (currentBoard: string[][]) => {
    setIsChecking(true)
    let hasMatches = false
    const matchBoard = Array(BOARD_SIZE)
      .fill(0)
      .map(() => Array(BOARD_SIZE).fill(false))

    // Check horizontal matches
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE - 2; col++) {
        const candy = currentBoard[row][col]
        if (candy !== "" && candy === currentBoard[row][col + 1] && candy === currentBoard[row][col + 2]) {
          matchBoard[row][col] = true
          matchBoard[row][col + 1] = true
          matchBoard[row][col + 2] = true
          hasMatches = true

          // Check for longer matches
          let matchLength = 3
          for (let i = 3; col + i < BOARD_SIZE && currentBoard[row][col + i] === candy; i++) {
            matchBoard[row][col + i] = true
            matchLength++
          }

          // Trigger match callback with position of middle candy
          onMatch(matchLength, col + Math.floor(matchLength / 2), row)
        }
      }
    }

    // Check vertical matches
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE - 2; row++) {
        const candy = currentBoard[row][col]
        if (candy !== "" && candy === currentBoard[row + 1][col] && candy === currentBoard[row + 2][col]) {
          matchBoard[row][col] = true
          matchBoard[row + 1][col] = true
          matchBoard[row + 2][col] = true
          hasMatches = true

          // Check for longer matches
          let matchLength = 3
          for (let i = 3; row + i < BOARD_SIZE && currentBoard[row + i][col] === candy; i++) {
            matchBoard[row + i][col] = true
            matchLength++
          }

          // Trigger match callback with position of middle candy
          onMatch(matchLength, col, row + Math.floor(matchLength / 2))
        }
      }
    }

    if (hasMatches) {
      // Remove matched candies (set to empty temporarily)
      const newBoard = JSON.parse(JSON.stringify(currentBoard)) // Deep copy
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (matchBoard[row][col]) {
            newBoard[row][col] = ""
          }
        }
      }

      setBoard(newBoard)

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Drop candies down
      const boardAfterDrop = dropCandies(newBoard)
      setBoard(boardAfterDrop)

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Check for new matches
      await checkAndRemoveMatches(boardAfterDrop)
    }

    setIsChecking(false)
    return hasMatches
  }

  // Drop candies down to fill empty spaces
  const dropCandies = (currentBoard: string[][]) => {
    const newBoard = JSON.parse(JSON.stringify(currentBoard)) // Deep copy

    // For each column
    for (let col = 0; col < BOARD_SIZE; col++) {
      let emptySpaces = 0

      // Start from the bottom and move up
      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (newBoard[row][col] === "") {
          emptySpaces++
        } else if (emptySpaces > 0) {
          // Move candy down by the number of empty spaces
          newBoard[row + emptySpaces][col] = newBoard[row][col]
          newBoard[row][col] = ""
        }
      }

      // Fill the top with new candies
      for (let row = 0; row < emptySpaces; row++) {
        newBoard[row][col] = getRandomCandy()
      }
    }

    return newBoard
  }

  // Auto-play feature to make the game more engaging
  useEffect(() => {
    const autoPlayInterval = setInterval(() => {
      if (!isSwapping && !isChecking && !isDragging && Math.random() < 0.3) {
        // Randomly find a valid move
        for (let attempts = 0; attempts < 10; attempts++) {
          const row = Math.floor(Math.random() * BOARD_SIZE)
          const col = Math.floor(Math.random() * BOARD_SIZE)

          // Try to swap with a random adjacent candy
          const directions = [
            { dr: -1, dc: 0 }, // up
            { dr: 1, dc: 0 }, // down
            { dr: 0, dc: -1 }, // left
            { dr: 0, dc: 1 }, // right
          ]

          const direction = directions[Math.floor(Math.random() * directions.length)]
          const newRow = row + direction.dr
          const newCol = col + direction.dc

          if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
            handleCandyClick(row, col)
            setTimeout(() => {
              handleCandyClick(newRow, newCol)
            }, 300)
            break
          }
        }
      }
    }, 2000)

    return () => clearInterval(autoPlayInterval)
  }, [board, isSwapping, isChecking, isDragging])

  return (
    <div className="grid grid-cols-6 gap-1 sm:gap-1.5 bg-gradient-to-br from-purple-200 to-pink-100 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-inner max-w-xs sm:max-w-sm mx-auto">
      {board.map((row, rowIndex) =>
        row.map((candy, colIndex) => (
          <motion.div
            key={`${rowIndex}-${colIndex}`}
            className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center text-xl sm:text-2xl lg:text-3xl rounded-md sm:rounded-lg cursor-grab active:cursor-grabbing ${
              selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex
                ? "bg-yellow-200 ring-1 sm:ring-2 ring-yellow-400 shadow-lg"
                : "bg-white hover:bg-gray-50"
            } shadow-md transition-all duration-200`}
            onClick={() => handleCandyClick(rowIndex, colIndex)}
            draggable={true}
            data-row={rowIndex}
            data-col={colIndex}
            onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            initial={{ scale: 0 }}
            animate={{
              scale: candy ? 1 : 0,
              backgroundColor:
                selectedCandy?.row === rowIndex && selectedCandy?.col === colIndex ? "#fef08a" : "#ffffff",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {candy}
          </motion.div>
        )),
      )}
    </div>
  )
}
