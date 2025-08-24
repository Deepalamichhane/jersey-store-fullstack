import React from "react";

import mounts from '../assets/public/mount.jpg';
import Muuchstac from '../assets/public/Muuchstac.jpg';
import GreenAirbeat from '../assets/public/GreenAirbeat.jpg';
import Vintage from '../assets/public/Vintage.jpg';
import FANTECH from '../assets/public/FANTECH.jpg';
import Kingyes from '../assets/public/Kingyes.jpg';
import Setof3 from '../assets/public/Setof3.jpg';

function Categories() {
  const categories = [
    { src: mounts, label: 'Mount ' },
    { src: Muuchstac, label: 'Muuchstac Products' },
    { src: GreenAirbeat, label: 'Green Airbeat Products' },
    { src: Vintage, label: 'Vintage Products' },
    { src: FANTECH, label: 'FANTECH Products' },
    { src: Kingyes, label: 'Kingyes Products' },
    { src: Setof3, label: 'Set of 3 Products' },
    { src: mounts, label: 'Mounts' },
    { src: vinegar, label: 'Vinegar & Cooking Wine' },
    { src: phoneCases, label: 'Phone Cases' },
    { src: poolCleaning, label: 'Pools & Spa Cleaning' },
    
  ];

  return (
    <div className="container mt-5">
      <h2>Categories</h2>
      <div className="row g-1 mt-3 rounded overflow-hidden" style={{ backgroundColor: "#f8f9fa" }}>
        {categories.map((category, index) => (
          <div className="col-2 p-1" key={index} style={{ border: '1px solid #e0e0e0' }}>
            <div className="d-flex flex-column align-items-center text-center p-2">
              <img
                src={category.src}
                alt={category.label}
                className="img-fluid"
                style={{ width: '100px', height: '100px', objectFit: 'contain' }}
              />
              <p className="mt-2 mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                {category.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;