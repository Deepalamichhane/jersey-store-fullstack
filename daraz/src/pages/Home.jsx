import React from "react";
import Categories from "../components/Categories";
import Flash from "../components/flash";
import Hero from "../components/Hero";
import JustForYou from "../components/justforyou";


function Home() {
    return (
        <>
            <Hero />
            <Flash />
            <Categories />
            <JustForYou />

        </>
    );
}

export default Home;
