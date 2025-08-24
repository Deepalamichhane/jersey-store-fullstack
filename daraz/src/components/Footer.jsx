import React from 'react';
import pflag from '../assets/public/p.png';
import bflag from '../assets/public/b.png';
import sflag from '../assets/public/s.png';
import mflag from '../assets/public/m.png';
import nflag from '../assets/public/n.png';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';

function Footer() {
  const socialIcons = [
    { icon: <FaFacebookF />, link: 'https://www.facebook.com/daraznepal' },
    { icon: <FaInstagram />, link: 'https://www.instagram.com/daraznepal/' },
    { icon: <FaYoutube />, link: 'https://www.youtube.com/c/DarazNepal' },
    { icon: <FaTwitter />, link: 'https://twitter.com/daraznepal' }
  ];

  const countries = [
    { name: 'Pakistan', flag: pflag },
    { name: 'Bangladesh', flag: bflag },
    { name: 'Sri Lanka', flag: sflag },
    { name: 'Myanmar', flag: mflag },
    { name: 'Nepal', flag: nflag }
  ];

  return (
    <footer className="py-5 bg-gray-200 text-gray-700">
      <div className="container">
        {/* Main Content Columns */}
        <div className="row g-4">

          {/* First Column: Experience & Convenient Shopping */}
          <div className="col-lg-3 col-md-6 col-12">
            <h5 className="font-bold mb-3">Experience Hassle-free Online Shopping in Nepal with Daraz</h5>
            <p className="text-sm">E-commerce has evolved over the past few years and since it’s easier and more convenient, it is evident that customers are actually switching to the trend of online shopping. Daraz, the Nepali shopping store, brings a whole new concept by showcasing a number of famous brands under one roof. Not only does it fulfill clothing necessities of both men and women but you can also shop for all kinds of appliances like air conditioners, heaters, refrigerators, LED TVs and a lot more. Simply select your favorite brand like Samsung, Apple, HP, Huawei, Dell, Canon, Nikon, etc and get yourself the best electronic items.</p>
            <h5 className="font-bold mt-3 mb-3">Convenient Online Shopping in Nepal</h5>
            <p className="text-sm">Daraz is the ultimate Nepali eCommerce website that offers a solution for all needs of the customers. It has a wide and assorted range of products including clothing, electronics, mobile phones, home and living, health and beauty and much more. Daraz strives to provide customers the best shopping experience in Nepal. The online store is updated daily and</p>
          </div>

          {/* Second Column: General Information & Trending */}
          <div className="col-lg-3 col-md-6 col-12">
            <h5 className="font-bold mb-3">General Information</h5>
            <p className="text-sm">new products are added every day to cater to all your needs. Visit Daraz.com.np to experience shopping in Nepal as never before. Don't forget to Download Daraz App and get exclusive discounts.</p>
            <p className="text-sm mb-2">Daraz is a global online marketplace with ecommerce stores in<span className="text-info"> Pakistan, Bangladesh, Nepal, Sri Lanka and Myanmar.</span></p>
            <p>General Information:</p>
            <p>Daraz Kaymu Private Limited Kathmandu Metropolitan City, Ward No. 11,Thapathali,Kathmandu, Nepal VAT No. 602403687</p>
            <p className="text-sm mb-2">DOC registration number : 3-35-382-19/2081/82</p>
            <p>Grievance handling Information:</p>
            <p>Grievance Management 015970597 (please ask to be redirected to our Grievance Management team)</p>
            <p>Email:<span className="text-info">customer.experience.np@care.daraz.com</span></p>
            <p className="font-bold mt-4 mb-2">TRENDING</p>
            <p className="text-sm">Daraz 11.11 Sale,12.12 Sale,Dashain Dhamaka,Mobile Week,Valentine's Day Sale,Cricket Streaming,Grocery Shopping in Nepal,Realme GT 2 Pro,Realme GT Neo 3,</p>
          </div>

          {/* Third Column: Top Categories & Brands */}
          <div className="col-lg-3 col-md-6 col-12">
            <h5 className="font-bold mb-3">Top Categories & Brands</h5>
            <h6 className="font-bold">NEW MOBILE PHONES IN NEPAL</h6>
            <ul className="list-unstyled text-sm">
              <li>Samsung Mobile Phones, Xiaomi Mobiles, Nokia Mobiles, Oppo Mobiles...</li>
            </ul>
            <h6 className="font-bold mt-3">LATEST LAPTOPS</h6>
            <ul className="list-unstyled text-sm">
              <li>Apple Laptops, Samsung Laptops, Asus Laptops...</li>
            </ul>
            <h6 className="font-bold mt-3">BEST ELECTRONICS</h6>
            <ul className="list-unstyled text-sm">
              <li>Samsung LED TVs, Sony LED TVs, Videocon LED TVs...</li>
            </ul>
            <h6 className="font-bold mt-3">SUMMER APPLIANCES</h6>
            <ul className="list-unstyled text-sm">
              <li>Air Conditioners, Refrigerators & Fridges, Samsung Refrigerators...</li>
            </ul>
          </div>

          {/* Fourth Column: All the other categories on the right side */}
          <div className="col-lg-3 col-md-6 col-12">
            <h5 className="font-bold mb-3">COMPUTER COMPONENTS</h5>
            <ul className="list-unstyled text-sm">
              <li>Ram, Motherboards, Processors, Desktop Casings, CPU Cooling Fans, Gaming Graphic Cards</li>
            </ul>
            <h5 className="font-bold mt-3">WOMEN'S FASHION</h5>
            <ul className="list-unstyled text-sm">
              <li>Clothes, Ladies Watches, Jewelry, Sarees, Ladies Kurti Designs, Women Undergarments, Skirts for Ladies & Girls, T-shirts for Ladies & Girls</li>
            </ul>
            <h5 className="font-bold mt-3">MEN'S FASHION</h5>
            <ul className="list-unstyled text-sm">
              <li>Men's jeans, Bags for Men, Men's Shoes, Men's T-Shirts, Men's Watches</li>
            </ul>
            <h5 className="font-bold mt-3">ONLINE GROCERY STORE</h5>
            <ul className="list-unstyled text-sm">
              <li>Rice, Chocolates, Tea, Coffee</li>
            </ul>
            <h5 className="font-bold mt-3">ONLINE BOOKSTORE</h5>
            <ul className="list-unstyled text-sm">
              <li>Stationary Store, Religious Items</li>
            </ul>
            <h5 className="font-bold mt-3">ONLINE AUTOMOTIVE STORE</h5>
            <ul className="list-unstyled text-sm">
              <li>Motorcycles - Bikes, Helmets</li>
            </ul>
            <h5 className="font-bold mt-3">LEADING ONLINE STORES</h5>
            <ul className="list-unstyled text-sm">
              <li>Goldstar Store, Dell, Samsung, Canon, Oppo, Jony, Nokia, Apple</li>
            </ul>
            <h5 className="font-bold mt-3">TRENDING PRODUCTS</h5>
            <ul className="list-unstyled text-sm">
              <li>Vivo Y20, Oppo A12, Samsung Galaxy M31...</li>
            </ul>
          </div>
        </div>

        <hr className="my-5" />

        {/* Footer with flags, social icons and copyrights */}
        <div className="row">
          <div className="col-lg-4 col-md-12">
            <h3 className="font-bold mb-3">Daraz International</h3>
            <div className="d-flex flex-wrap gap-3">
              {countries.map((country, index) => (
                <div key={index} className="d-flex align-items-center">
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="me-2"
                    style={{ width: '30px', height: '20px' }}
                  />
                  <span>{country.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <h3 className="font-bold mb-3">Follow Us</h3>
            <div className="d-flex gap-3">
              {socialIcons.map((social, index) => (
                <Link
                  key={index}
                  to={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <h3 className="font-bold mb-3">@Daraz 2025</h3>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;