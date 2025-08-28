import portraitImage from '../../../shared/utils/fotos/Portrait.jpg';
import { useNavigate } from 'react-router-dom';


const AboutMePage = () => {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Back navigation */}
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 sm:mb-6 md:mb-8"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs sm:text-sm font-light tracking-wide">Back</span>
            </button>
            
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Side - Image and Quote */}
          <div className="lg:w-1/2">
            <div className="relative">
              {/* Main portrait image */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={portraitImage}
                  alt="Ramon Lora Reyes - Photographer" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Quote box overlay - positioned top left */}
              <div className="absolute -top-6 -left-6 bg-white p-8 rounded-xl shadow-2xl max-w-xs border border-gray-100">
                <p className="text-gray-800 text-sm leading-relaxed font-light italic">
                  I love a good cheese board, anything plant/foliage related or snack-able.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="lg:w-1/2 space-y-8">
            
            {/* Main Heading */}
            <div>
              <h1 className="text-5xl md:text-6xl font-light text-gray-800 mb-8 leading-tight">
                Grüezi, I'm Ramon!
              </h1>
              
              <p className="text-xl text-gray-600 font-light mb-8 leading-relaxed">
                A photographer based in Zürich, Switzerland.
              </p>
            </div>

            {/* Bio paragraphs */}
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-base">
                I have an unhealthy obsession with constantly DIY-ing things in my 
                house and going on frequent trips to IKEA. When I'm not eyeing up 
                a new plant baby, you can find me netflixing in my fleecy joggers 
                with a bowl of ramen.
              </p>
              
              <p className="text-gray-700 leading-relaxed text-base">
                The walls in my room are full of photos, receipts and tickets I've 
                collected over the years. Turns out I'm a sucker for memories and I 
                can't wait to preserve a piece of yours too.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button 
                onClick={() => navigate('/all')}
                className="bg-gray-800 hover:bg-gray-700 text-white px-10 py-4 rounded-lg transition-colors duration-300 text-sm font-medium tracking-wider uppercase">
                Get to know me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMePage;