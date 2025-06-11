import { FolderOpen, Image, Camera, Eye } from "lucide-react";

const AdminStatsCards = ({ albums }) => {
  const totalImages = albums.reduce((total, album) => total + (album.images?.length || 0), 0);
  const totalCategories = new Set(albums.map(album => album.category)).size;
  const totalViews = albums.reduce((total, album) => total + (album.views || 0), 0);

  const stats = [
    {
      icon: FolderOpen,
      label: 'Albums',
      value: albums.length,
      color: 'text-blue-500'
    },
    {
      icon: Image,
      label: 'Images',
      value: totalImages,
      color: 'text-green-500'
    },
    {
      icon: Camera,
      label: 'Categories',
      value: totalCategories,
      color: 'text-purple-500'
    },
    {
      icon: Eye,
      label: 'Views',
      value: totalViews,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 lg:gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return(
          <div key={index} className="bg-white rounded-lg shadow p-4 lg:p-6">
            <div className="flex items-center">
              <IconComponent className={`h-6 w-6 lg:h-8 lg:w-8 ${stat.color}`} />
              <div className="ml-3 lg:ml-4">
                <p className="text-xs lg:text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStatsCards;