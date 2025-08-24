import React from 'react';
import { Link } from 'react-router-dom';

function FAQ() {
    return (
        <>

            {/* FAQ */}
            <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            How can I sell on Daraz?
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>To start selling on Daraz, visit the Daraz Seller Center and create a new account using your phone number. Complete the sign-up process by verifying your email, adding your pickup address, and uploading the required documents for verification. Once your store is approved, add your first product, and you're ready to sell! You can also customize your store by adding your logo, cover, and banners through the Store Builder tool.</strong>
                        </div>
                    </div>
                </div>
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingTwo">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            What categories can I sell on Daraz?
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>With multiple categories on Daraz—ranging from fashion, lifestyle, digital goods, FMCG, and lifestyle—you’ll find the perfect fit for your products. However, it's essential to avoid listing counterfeit, dangerous, or prohibited items and those restricted by law or cultural norms. Click Here to learn more body.</strong>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                How much commission does Daraz charge?
                            </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <strong>This is the third item's accordion body. Opening a shop on Daraz is free! However, a small commission is deducted from each order's payment, with rates varying based on the product category. You can find out about commissions in different categories here. </strong>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                What is the payment policy for Daraz?
                            </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <strong>This is the third item's accordion body. Opening a shop on Daraz is free! However, a small commission is deducted from each order's payment, with rates varying based on the product category. You can find out about commissions in different categories here. </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Need more help */}
            <div className="container mt-5 text-start mb-4">
                <button className="btn outlined border-2 rounded-pills-2 " type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                    Need more help
                </button>
            </div>



            <div className="container.fluid " style={{ backgroundColor: "#f37622ff" }}>
                <div className="container text-center text-white py-5">
                    <h2 className="mb-4">What are you waiting for? Start selling with Daraz today.</h2>

                    <Link to="#" className="btn d-grid gap-2 d-md-flex justify-content-md-end">
                        <button className="btn btn-primary" type="button">Get Started</button></Link>
                </div>
            </div>







        </>
    );
}
export default FAQ;