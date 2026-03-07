import React from 'react';

export default function StarRating({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#CFA052' : '#E5E7EB', fontSize: size }}>
          ★
        </span>
      ))}
    </div>
  );
}
