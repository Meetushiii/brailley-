
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutBrailleArt: React.FC = () => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>About Braille Art</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Braille art uses patterns of raised dots to create tactile images that can be explored through 
          touch. It's a unique form of artistic expression that makes visual concepts accessible to 
          those with visual impairments while also being visually interesting for sighted individuals.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Tactile Experience</h3>
            <p className="text-sm">
              Create art that can be experienced through touch, providing a multisensory creative outlet.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Export Options</h3>
            <p className="text-sm">
              Download your design for embossing or 3D printing to create physical, tactile artwork.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Creative Expression</h3>
            <p className="text-sm">
              Use dots to create patterns, shapes, scenes, or abstract designs in a unique artistic medium.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutBrailleArt;
