import { Image } from 'lucide-react';
import { getCategoryDisplayName } from '../../../constants/categories';

const EmptyState = ({ category }) => (
  <div className="text-center py-12">
    <Image size={48} className="mx-auto text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No albums found</h3>
    <p className="text-gray-500">
      {category && category !== 'all' 
        ? `No albums found in the "${getCategoryDisplayName(category)}" category.`
        : 'No albums have been created yet.'
      }
    </p>
  </div>
);

export default EmptyState;