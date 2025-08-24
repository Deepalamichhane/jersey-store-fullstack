import React from 'react';
import { Link } from 'react-router-dom';
import Muuchstac from '../assets/public/Muuchstac.jpg';
import GreenAirbeat from '../assets/public/GreenAirbeat.jpg';
import Vintage from '../assets/public/Vintage.jpg';
import FANTECH from '../assets/public/FANTECH.jpg';
import Kingyes from '../assets/public/Kingyes.jpg';
import Setof3 from '../assets/public/Setof3.jpg';

function Flash() {
  const flashSaleData = [
    {
      imageSrc: Muuchstac,
      title: 'Muuchstac Ocean Face Wash for Men | Fight Ac...',
      price: 'Rs.399',
      originalPrice: 'Rs.750',
      discount: '-47%'
    },
    {
      imageSrc: GreenAirbeat,
      title: 'Green Airbeat-520 Dual Mic ENC Earbuds |...',
      price: 'Rs.999',
      originalPrice: 'Rs.2,599',
      discount: '-62%'
    },
    {
      imageSrc: Vintage,
      title: 'Vintage T-9 Hair Trimmer For Men Plastic Body',
      price: 'Rs.247',
      originalPrice: 'Rs.599',
      discount: '-64%'
    },
    {
      imageSrc: FANTECH,
      title: 'FANTECH (HG56-BLACK) - TONE II WIRED Gaming...',
      price: 'Rs.1,099',
      originalPrice: 'Rs.2,199',
      discount: '-50%'
    },
    {
      imageSrc: Kingyes,
      title: 'Kingyes Painless Hair Remover Spray Foam 15...',
      price: 'Rs.299',
      originalPrice: 'Rs.649',
      discount: '-47%'
    },
    {
      imageSrc: Setof3,
      title: 'Set of 3 Multipurpose Cleaning Brush with Har...',
      price: 'Rs.79',
      originalPrice: 'Rs.150',
      discount: '-47%'
    }
  ];

  return (
    <div className="container mt-5">
      <h2 className="mb-3">Flash Sale</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0 text-orange">On Sale Now</h3>
        <Link to="#" className="text-decoration-none text-uppercase fw-bold text-orange border-orange px-3 py-1">
          SHOP ALL PRODUCTS
        </Link>
      </div>
      <hr className="mb-4" />
      <div className="row g-2">
        {flashSaleData.map((item, index) => (
          <div className="col-lg-2 col-md-4 col-6 mb-4" key={index}>
            <div className="card h-100 border-0 shadow-sm">
              <img
                src={item.imageSrc}
                className="card-img-top"
                alt={item.title}
              />
              <div className="card-body p-2">
                <p className="card-title text-muted fw-normal m-0" style={{ fontSize: '0.8rem', minHeight: '3rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </p>
                <h6 className="card-subtitle mt-2 fw-bold text-orange">
                  {item.price}
                </h6>
                <div className="d-flex align-items-center mt-1">
                  <span className="text-muted text-decoration-line-through me-2" style={{ fontSize: '0.7rem' }}>
                    {item.originalPrice}
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {item.discount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Flash;