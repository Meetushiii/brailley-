
import React from 'react';

interface BrailleCellProps {
  dots: boolean[];
  size?: "sm" | "md" | "lg";
}

const BrailleCell: React.FC<BrailleCellProps> = ({ dots, size = "md" }) => {
  // Braille cells have 6 dots numbered 1-6
  // dots[0] corresponds to dot 1, dots[1] to dot 2, etc.
  
  const sizeClasses = {
    sm: {
      dot: "w-2 h-2 m-0.5",
      cell: "gap-1"
    },
    md: {
      dot: "w-3 h-3 m-1",
      cell: "gap-1.5"
    },
    lg: {
      dot: "w-4 h-4 m-1.5",
      cell: "gap-2"
    }
  };
  
  return (
    <div className={`braille-cell ${sizeClasses[size].cell}`}>
      {dots.map((active, index) => (
        <div 
          key={index}
          className={`${sizeClasses[size].dot} rounded-full ${active ? 'bg-braille-black' : 'bg-gray-200'}`}
          aria-label={active ? `Dot ${index + 1} active` : `Dot ${index + 1} inactive`}
        />
      ))}
    </div>
  );
};

export default BrailleCell;
