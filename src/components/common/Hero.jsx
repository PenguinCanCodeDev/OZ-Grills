import React from 'react'

const Hero = ({ heroImage, titleAccent = "The Flame", titleMain = "Mastering", subtitle }) => {
  return (
    <section className="heroSection">
      <img
        src={heroImage}
        alt="Wood-fired grill"
        className="heroImage"
      />
      <div className="heroOverlay">
        <h1 className="heroTitle">
          {titleMain}
          <span className="heroTitleAccent">{titleAccent}</span>
        </h1>
        <p className="heroCopy">
          {subtitle || "Experience the raw, visceral heat of premium wood-fired grilling. Curated for the bold."}
        </p>
      </div>
    </section>
  )
}

export default Hero
