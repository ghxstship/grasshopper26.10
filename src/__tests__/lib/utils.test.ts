import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('px-4', 'py-2', 'bg-blue-500')
    expect(result).toBe('px-4 py-2 bg-blue-500')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toBe('base-class active-class')
  })

  it('removes false/undefined/null values', () => {
    const result = cn('class1', false, 'class2', undefined, 'class3', null)
    expect(result).toBe('class1 class2 class3')
  })

  it('merges Tailwind classes correctly', () => {
    // Later class should override earlier class
    const result = cn('px-4', 'px-8')
    expect(result).toBe('px-8')
  })

  it('handles array of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('handles object notation', () => {
    const result = cn({
      'class1': true,
      'class2': false,
      'class3': true,
    })
    expect(result).toBe('class1 class3')
  })

  it('handles empty input', () => {
    const result = cn()
    expect(result).toBe('')
  })

  it('handles complex combinations', () => {
    const isActive = true
    const isDisabled = false
    const result = cn(
      'base-class',
      isActive && 'active',
      isDisabled && 'disabled',
      { 'hover': true, 'focus': false },
      ['extra1', 'extra2']
    )
    expect(result).toBe('base-class active hover extra1 extra2')
  })
})
