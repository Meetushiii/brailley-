
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-braille-blue text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Braillely</p>
        <p className="text-sm mt-1">Helping blind students learn mathematics through multi-sensory education</p>
      </div>
    </footer>
  );
};

export default Footer;
