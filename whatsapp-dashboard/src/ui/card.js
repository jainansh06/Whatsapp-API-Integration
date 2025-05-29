import React from 'react';


export function Card({ children, className }) {
  return (
    <div className={`rounded-lg border bg-white shadow-sm ${className || ''}`}>
      {children}
    </div>
  );
}


export function CardContent({ children, className }) {
  return (
    <div className={`p-4 ${className || ''}`}>
      {children}
    </div>
  );
}


export function CardHeader({ children, className }) {
  return (
    <div className={`px-4 py-2 border-b ${className || ''}`}>
      {children}
    </div>
  );
}


export function CardTitle({ children, className }) {
  return (
    <h3 className={`text-lg font-semibold ${className || ''}`}>
      {children}
    </h3>
  );
}
