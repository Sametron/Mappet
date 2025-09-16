
import React from 'react';

const TowerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        viewBox="0 0 64 64" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor" 
        stroke="currentColor"
        {...props}
    >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <path d="M32,2A12,12,0,0,0,20,14V42.56a1,1,0,0,0,.52.88l10,5.62a1,1,0,0,0,1,0l10-5.62a1,1,0,0,0,.52-.88V14A12,12,0,0,0,32,2Zm8,40.8-8,4.5-8-4.5V14a10,10,0,0,1,20,0v1.17l-10,6.67a1,1,0,0,0-.4.8v19Z"></path>
            <path d="M49.48,46.12,39,40.5V26.83l12.48-8.32a1,1,0,0,0-.48-1.84L28.23,8.44a1,1,0,0,0-1,1.72l9.29,4.9v19.5L22.09,27.91a1,1,0,0,0-1.28.21,1,1,0,0,0,.21,1.28l10.36,9.15a1,1,0,0,0,1.24,0l10-8.83V50.56a1,1,0,0,0,.52.88l10,5.62a1,1,0,0,0,1,0l-1.39-.78a1,1,0,0,0-1-1.72Z"></path>
        </g>
    </svg>
);

export default TowerIcon;
