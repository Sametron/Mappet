import React from 'react';

const RotateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16.3 5H7.7C6.76 5 6 5.76 6 6.7v10.6c0 .94.76 1.7 1.7 1.7h8.6c.94 0 1.7-.76 1.7-1.7V6.7c0-.94-.76-1.7-1.7-1.7z" />
    <path d="M20.8 16.5c.2-.3.2-.6 0-.9l-2.4-3.4c-.3-.4-.9-.5-1.3-.2s-.5.9-.2 1.3l1.1 1.6-1.1 1.6c-.3.4-.2 1 .2 1.3s1 .5 1.3.2l2.4-3.4zM3.2 7.5c-.2.3-.2.6 0 .9l2.4 3.4c.3.4.9.5 1.3.2s.5-.9.2-1.3L6 9.6l1.1-1.6c.3-.4.2-1-.2-1.3s-1-.5-1.3-.2L3.2 7.5z" />
  </svg>
);

export default RotateIcon;
