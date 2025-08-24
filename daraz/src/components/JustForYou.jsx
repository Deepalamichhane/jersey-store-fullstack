import React from 'react';
import wipeImage from '../assets/public/wipe.jpg';
import downloadappImage from '../assets/public/app.png';
import logoImage from '../assets/public/logo.png';
import cashImage from '../assets/public/cash.png';
import mastercard from '../assets/public/mastercard.png';
import visa from '../assets/public/visa.png';

function JustForYou() {

    return (
        <>

            <div className="container  mt-5">
                <h2 className="m-2 ">Just For You</h2>
                <div className="row row-cols-4 g-3 mt-3" style={{ textAlign: "center", backgroundColor: "#f8f9fa" }}>
                    <div className="col">
                        <img src="/src/assets/public/wipe.jpg" alt="Breast pump" width="150" height="150" />
                        <p>Breast Pump & Accessories</p>
                    </div>

                    <div className="col">
                        <img src="/src/assets/public/wipe.jpg" alt="Baby wipes" width="150" height="150" />
                        <p>Baby Wipes & Diapers</p>
                    </div>

                    <div className="col">
                        <img src="/src/assets/public/wipe.jpg" alt="Baby food" width="150" height="150" />
                        <p>Baby Food & Formula</p>
                    </div>

                    <div className="col">
                        <img src="/src/assets/public/wipe.jpg" alt="Baby toys" width="150" height="150" />
                        <p>Toys & Games</p>
                    </div>
                </div>

                <div className="row row-cols-4" style={{ textAlign: "center", backgroundColor: "#f8f9fa" }}>
                    <div className="col">
                        <img src="/src/assets/public/wipe.jpg" alt="Baby clothes" width="150" height="150" />
                        <p>Baby Clothing</p>
                    </div>

                    <div className="col">
                        <img src="/src/assets/public/wipe.jpg" alt="Bath items" width="150" height="150" />
                        <p>Bath & Skincare</p>
                    </div>

                    <div className="col">
                        <img src="/src/assets/public/wipe.jpg" alt="Baby furniture" width="150" height="150" />
                        <p>Nursery & Furniture</p>
                    </div>

                    <div className="col">
                        <img src="/src/assets/public/wipe.jpg" alt="Baby gear" width="150" height="150" />
                        <p>Strollers & Gear</p>
                    </div>
                </div>

                <div className="row row-cols-4">
                    <button className="btn btn-primary col-3 justify-content-center" style={{ margin: "20px auto" }}>LOAD MORE</button>
                </div>
            </div>

            <div className=" blue-text container p-5 m-5">
                <div className="row row-cols-4">
                    <div className="col">
                        <p className="mb-3">Customer Care</p>
                        <ul className="list-unstyled">
                            <li>Help Center</li>
                            <li>Contact Customer Care</li>
                            <li>How to Buy</li>
                            <li>Contact us</li>
                        </ul>
                    </div>

                    <div className="col">
                        <p className="mb-3">Daraz</p>
                        <ul className="list-unstyled">
                            <li>Help Center</li>
                            <li>Contact Customer Care</li>
                            <li>How to Buy</li>
                            <li>Contact us</li>
                            <li>Help Center</li>
                            <li>Contact Customer Care</li>
                            <li>How to Buy</li>
                            <li>Contact us</li>
                            <li>Help Center</li>
                            <li>Contact Customer Care</li>
                            <li>How to Buy</li>
                            <li>Contact us</li>
                        </ul>
                    </div>

                    <div className="col">
                        <img src={logoImage} alt="Logo" width="100" height="100" />
                        <p className="mt-3">Happy Shopping</p>
                        <p>Download App</p>
                    </div>

                    <div className="col">
                        <img src={downloadappImage} alt="Logo" width="100" height="100" />
                        <img src={downloadappImage} alt="Logo" width="100" height="100" className="mt-3" />
                    </div>
                </div>
            </div>

             <div className="container mt-5 p-5 bg-white">
                    <div className="row">
                        {/* Payment Methods Section */}
                        <div className="col-md-6 mb-4 mb-md-0">
                        <p className="mb-3 fw-bold text-muted">Payment Methods</p>
                        <div className="d-flex flex-wrap gap-3">
                            <img src={cashImage} alt="Cash on Delivery" className="img-fluid" style={{ height: '30px' }} />
                            <img src={visa} alt="Visa & Mastercard" className="img-fluid" style={{ height: '30px' }} />
                            <img src={mastercard} alt="eSewa" className="img-fluid" style={{ height: '30px' }} />
                            <img src={cashImage} alt="IME Pay" className="img-fluid" style={{ height: '30px' }} />
                            <img src={visa} alt="Fonepay" className="img-fluid" style={{ height: '30px' }} />
                        </div>
                        </div>
                        
                        {/* Verified by Section */}
                        <div className="col-md-6">
                        <p className="mb-3 fw-bold text-muted">Verified by</p>
                        <div className="d-flex align-items-center gap-3">
                            <img src={visa} alt="DSS" className="img-fluid" style={{ height: '30px' }} />
                            <img src={cashImage} alt="DSS" className="img-fluid" style={{ height: '30px' }} />
                        </div>
                        </div>
                    </div>
              </div>
        </>
    );
}

export default JustForYou;