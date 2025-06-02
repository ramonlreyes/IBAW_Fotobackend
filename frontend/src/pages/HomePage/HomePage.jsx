import { useState } from "react";
import Header from '../../components/Header/Header';
import Carousel from "../../components/Carousel/Carousel";

function HomePage() {
  const categories = ['All', 'Portraits', 'Landscape', 'Events'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };


  return (
    <div className="min-h-screen bg-white flex">
      {/* Header Component */}
      <Header 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <Carousel />

    </div>
  );
}

export default HomePage;