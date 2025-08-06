import React, { useEffect } from 'react';
import './LandingPage.css';
import animateLandingPage from '../animations/landingPage';
import { gsap } from 'gsap';
import rocketImg from '../assets/rocket.svg';


function LandingPage() {
    useEffect(() => {
        animateLandingPage();
    }, []);

    const handleExploreClick = () => {
        // Trigger rocket launch animation
        const rocket = document.querySelector('.rocket');
        if (rocket) {
            gsap.to(rocket, {
                y: -500,
                x: 200,
                rotation: 45,
                scale: 0.5,
                duration: 2,
                ease: "power2.out",
                onComplete: () => {
                    // You can add navigation or other actions here
                    console.log('Rocket launched! 🚀');
                    // Example: window.location.href = '/explore';
                    // Or show a new section, modal, etc.
                }
            });
        }

        // Add some visual feedback to the button
        const button = document.querySelector('.explore-button');
        if (button) {
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });
        }
    };

    return (
        <div className="landing-page">
            <div className="background-stars"></div>
            <img
                src={require('../assets/stars.svg').default}
                alt="Stars"
                className="background-stars"
                style={{ position: 'absolute', width: '100vw', height: '100vh', top: 0, left: 0, zIndex: 0 }}
            />
            <img
                src={require('../assets/planets.svg').default}
                alt="Planets"
                className="planets"
                style={{ position: 'absolute', width: '300px', top: 50, right: 50, zIndex: 1 }}
            />
            <img 
                src={rocketImg} 
                className="rocket" 
                alt="Rocket" 
            />

            <h1 className="header-title">Welcome Universe</h1>
            <div className="feature-list">
                <div className="feature">✨ Animated space background</div>
                <div className="feature">🚀 Rocket launch on Explore</div>
                <div className="feature">🌌 Smooth feature fade-ins</div>
            </div>
            <button className="cta-button explore-button" onClick={handleExploreClick}>
                Explore
            </button>
        </div>
    );
}

export default LandingPage;