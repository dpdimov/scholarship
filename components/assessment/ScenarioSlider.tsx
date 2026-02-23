'use client'

import { useState, useEffect, useRef } from 'react'

interface ScenarioSliderProps {
  questionId: string
  stem: string
  leftOption: string
  rightOption: string
  onSubmit: (value: number) => void
  disabled?: boolean
}

export default function ScenarioSlider({
  questionId,
  stem,
  leftOption,
  rightOption,
  onSubmit,
  disabled = false
}: ScenarioSliderProps) {
  const [value, setValue] = useState<number>(5)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [columns, setColumns] = useState<boolean[]>(new Array(10).fill(false))
  const sliderRef = useRef<HTMLInputElement>(null)

  const updateColumns = (sliderValue: number) => {
    const newColumns = new Array(10).fill(false)

    if (sliderValue === 5) {
      setIsActive(false)
      setColumns(newColumns)
      return
    }

    setIsActive(true)

    if (sliderValue < 5) {
      for (let i = sliderValue; i < 5; i++) {
        newColumns[i] = true
      }
    } else {
      for (let i = 5; i < sliderValue; i++) {
        newColumns[i] = true
      }
    }

    setColumns(newColumns)
  }

  const handleSliderChange = (newValue: number) => {
    setValue(newValue)
    updateColumns(newValue)
  }

  const handleColumnClick = (columnIndex: number) => {
    if (disabled) return

    let newValue: number
    if (columnIndex < 5) {
      newValue = columnIndex
    } else {
      newValue = columnIndex + 1
    }

    setValue(newValue)
    updateColumns(newValue)

    if (sliderRef.current) {
      sliderRef.current.value = newValue.toString()
    }
  }

  const handleSubmit = () => {
    if (isActive && !disabled) {
      onSubmit(value)
    }
  }

  useEffect(() => {
    setValue(5)
    setIsActive(false)
    setColumns(new Array(10).fill(false))
  }, [questionId])

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Scenario stem */}
      <h3 className="text-lg font-medium text-gray-800 mb-5 text-center leading-relaxed">
        {stem}
      </h3>

      {/* Two approach options */}
      <div className="scenario-options">
        <div className="scenario-option left">
          {leftOption}
        </div>
        <div className="scenario-option right">
          {rightOption}
        </div>
      </div>

      {/* Visual columns */}
      <div className="colums-wrapper">
        {columns.map((isColumnActive, index) => (
          <div
            key={index}
            className={`column ${isColumnActive ? 'active' : ''}`}
            data-id={index}
            onClick={() => handleColumnClick(index)}
          />
        ))}
      </div>

      {/* Range slider */}
      <div className="range-wrapper">
        <input
          ref={sliderRef}
          type="range"
          min="0"
          max="10"
          step="1"
          value={value}
          onChange={(e) => handleSliderChange(parseInt(e.target.value))}
          className={`range ${isActive ? 'active' : ''}`}
          disabled={disabled}
        />
      </div>

      {/* Submit button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!isActive || disabled}
          className={`range-submit ${isActive && !disabled ? 'active' : ''}`}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  )
}
