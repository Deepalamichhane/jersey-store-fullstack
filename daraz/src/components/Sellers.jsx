import React from 'react';
import { Link } from 'react-router-dom';
 
function Sellers() {
    return (

        <>

            {/* Sellers program */}
            <div className="container mt-5 p-5 text-white" style={{ backgroundColor: "#202351" }}>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Daraz Seller Center</h5>
                                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                <button
                                    className="btn btn-primary"
                                    style={{ backgroundColor: "#f27b1a" }}
                                >
                                    Sign up Now
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Mall</h5>
                                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                <Link
                                    to="#"
                                    className="btn btn-primary"
                                    style={{ backgroundColor: "#f27b1a" }}
                                >
                                    Find out More
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>


            {/* sellers support */}
            <div className="container mt-5  px-5 text-white" style={{ backgroundColor: "#e6d8b0" }}>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title"> Univeristy</h5>
                                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="card text-dark bg-white">
                            <div className="card-body">
                                <h5 className="card-title">Sellers Community</h5>
                                <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>

                            </div>
                        </div>
                    </div>

                </div>
            </div>



        </>
    );
}

export default Sellers;