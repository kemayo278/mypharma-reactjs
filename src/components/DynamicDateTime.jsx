import React, { useState, useEffect } from "react";

const DynamicDateTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <p className="section-title" style={{ color:"grey",fontSize:"20px" }}>
            {currentTime.toLocaleDateString("fr-FR")} - {currentTime.toLocaleTimeString("fr-FR")}
        </p>
    );
};

export default DynamicDateTime;
