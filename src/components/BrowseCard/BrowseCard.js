// BrowseCard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

const BrowseCard = ({ topic, mediaArray, fetchFunction }) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (mediaArray.length > 0) {
            const intervalId = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % mediaArray.length);
            }, 6000); // Change image every 6 seconds

            return () => clearInterval(intervalId); // Cleanup on component unmount
        }
    }, [mediaArray.length]);

    const handleClick = () => {
        navigate(`/info/${topic}`, { state: { mediaArray, fetchFunction } });
    };

    return (
        <Tooltip
            title={mediaArray[currentImageIndex]?.name || mediaArray[currentImageIndex]?.title || ''}
            arrow
            placement="top"
            PopperProps={{
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 10], // Adjusts tooltip position relative to the cursor
                        },
                    },
                ],
            }}
        >
            <div
                onClick={handleClick}
                style={{
                    position: 'relative',
                    width: '300px',
                    height: '200px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.3s ease-in-out', // Smooth transition for hover effect
                    backgroundColor: '#333',
                }}
                className="browse-card"
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(.9)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${mediaArray[currentImageIndex]?.posterUrl || ''})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0,
                    }}
                    className="browse-card__background"
                />

                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    className="browse-card__overlay"
                >
                    <h2 style={{ color: 'white', fontSize: '24px', margin: 0 }}>{topic}</h2>
                </div>
            </div>
        </Tooltip>
    );
};

export default BrowseCard;
