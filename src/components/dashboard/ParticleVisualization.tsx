// ParticleVisualization.tsx
import React from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';

const ParticleVisualization: React.FC = () => {
    let particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const speed = 0.85; // Constant speed for particles

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(window.innerWidth, 400).parent(canvasParentRef);

        // Initialize particles with random positions and velocities
        particles = Array.from({ length: 200 }, () => {
            // Random angle for consistent speed in random direction
            const angle = p5.random(p5.TWO_PI);
            return {
                x: p5.random(p5.width),
                y: p5.random(p5.height),
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
            };
        });
    };

    const draw = (p5: p5Types) => {
        p5.background(0, 0, 40, 50); // Dark background

        particles.forEach((particle) => {
            // Calculate distance from the mouse
            const dx = particle.x - p5.mouseX;
            const dy = particle.y - p5.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Apply a slight direction adjustment if close to the mouse
            const minDistance = 50; // Radius around the mouse for repulsion
            const repulsionFactor = 0.1; // Small adjustment factor

            if (distance < minDistance) {
                // Calculate slight repulsion direction without slowing speed
                particle.vx += (dx / distance) * repulsionFactor;
                particle.vy += (dy / distance) * repulsionFactor;

                // Normalize velocity to maintain constant speed
                const magnitude = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                particle.vx = (particle.vx / magnitude) * speed;
                particle.vy = (particle.vy / magnitude) * speed;
            }

            // Update particle position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around the edges of the canvas
            if (particle.x < 0) particle.x = p5.width;
            if (particle.x > p5.width) particle.x = 0;
            if (particle.y < 0) particle.y = p5.height;
            if (particle.y > p5.height) particle.y = 0;

            // Draw the particle
            p5.noStroke();
            p5.fill(0, 255, 200);
            p5.ellipse(particle.x, particle.y, 5, 5);
        });
    };

    return <Sketch setup={setup} draw={draw} />;
};

export default ParticleVisualization;
