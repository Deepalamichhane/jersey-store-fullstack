import React from 'react';
import { Muuchstac } from '../assets/public/Muuchstac.png'; // 
function DetailsLayout() {

  return (

    <>
    <div class="card" style="width:400px">
        <img class={Muuchstac} src="img_avatar1.png" alt="Card image"/>
        
    </div>

    <div class="card-body">
            <h4 class="card-title">Muuchstac Ocean Face Wash for Men | Fight Acne & Pimples, Brighten Skin, Clears Dirt, Oil Control, Refreshing Feel - Multi-Action Formula (100 ml)</h4>
            <p class="card-text">Some example text.</p>
            <a href="#" class="btn btn-primary">Buy Now </a>
    </div>

    </>
  );
}