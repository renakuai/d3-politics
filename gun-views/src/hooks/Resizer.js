import { useState, useEffect } from 'react'

function useResizer(ref) {
  const [width, setWidth] = useState();
  useEffect(() => {
    const element = ref.current;
    const resizeObserver = new ResizeObserver(items => {
      for (let item of items) {
        const itemWidth = Math.floor(item.contentRect.width);
        setWidth(itemWidth);
      }
    })
    resizeObserver.observe(element)
    return () => resizeObserver.unobserve(element)
  }, [])
  return width
}

export default useResizer;