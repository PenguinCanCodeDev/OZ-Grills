import { useState, useEffect } from 'react'

export default function DeveloperFooter() {
  const [index, setIndex] = useState(0)
  const phrases = ["ID", "Founder of PCC", "Founder of Penguins Can Code"]

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const whatsappUrl = `https://wa.me/2347064157415?text=${encodeURIComponent("Hi, ID, I saw your work on OZ Grills, and I'd like to chat!")}`

  return (
    <div className="developer-footer">
      <p>
        Developed by{' '}
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="animated-text"
          key={index}
        >
          {phrases[index]}
        </a>
      </p>
    </div>
  )
}
