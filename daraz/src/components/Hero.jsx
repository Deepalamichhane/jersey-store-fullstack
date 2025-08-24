import React from 'react';
import h1hero from '../assets/public/h1.png';
import h2hero from '../assets/public/h2.png';
import h3hero from '../assets/public/h3.png';
import h4hero from '../assets/public/h4.png';
import sale from '../assets/public/sale.gif';
import app from '../assets/public/app.png';

function Hero() {
  const heroImages = [
    { src: h1hero, alt: 'Hero Image 1' },
    { src: h2hero, alt: 'Hero Image 2' },
    { src: h3hero, alt: 'Hero Image 3' },
    { src: h4hero, alt: 'Hero Image 4' }
  ];

  return (
    <>
      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
        {/* Dynamic Carousel Indicators */}
        <div className="carousel-indicators">
          {heroImages.map((image, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-current={index === 0 ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        {/* Dynamic Carousel Items */}
        <div className="carousel-inner">
          {heroImages.map((image, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <img className="d-block w-100" src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>

        {/* Carousel Controls - use <a> tags for Bootstrap JavaScript */}
        <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
         
        </a>
        <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
         
        </a>
      </div>

      <div className="col-lg-4">
          <img src={app} alt="Download App" className="img-fluid rounded" />
      </div>

      {/* Sales is live section */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-12 text-center">
            <img src={sale} alt="Sale is live" className="img-fluid" style={{ width: '100%', height: 'auto' }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;