// hooks/useGamepad.ts
import { useEffect, useRef } from 'react'

type Direction = 'left' | 'right' | 'up' | 'down'

export function useGamepadNavigation(
  onNavigate: (dir: Direction) => void,
  onSelect: () => void,
  onBack: () => void
) {
  const prev = useRef<boolean[]>([])

  useEffect(() => {
    let raf: number
    function poll() {
      const gp = navigator.getGamepads?.()[0]
      if (gp) {
        const btn = gp.buttons.map(b => b.pressed)
        if (btn[12] && !prev.current[12]) onNavigate('up')
        if (btn[13] && !prev.current[13]) onNavigate('down')
        if (btn[14] && !prev.current[14]) onNavigate('left')
        if (btn[15] && !prev.current[15]) onNavigate('right')
        if (btn[0]  && !prev.current[0])  onSelect()
        if (btn[1]  && !prev.current[1])  onBack()
        prev.current = btn
      }
      raf = requestAnimationFrame(poll)
    }
    raf = requestAnimationFrame(poll)
    return () => cancelAnimationFrame(raf)
  }, [onNavigate, onSelect, onBack])
}
