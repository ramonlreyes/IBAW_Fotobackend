import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PORTFOLIO_CATEGORIES, findCategoryByIdentifier, getCategoryDisplayName } from '../../../constants/categories';

export const useCategoryNavigation = () => {

  const navigate = useNavigate();
  const { category: urlCategory } = useParams();

  const getCurrentCategory = useCallback(() => {
    if (!urlCategory) return 'all';

    const category = findCategoryByIdentifier(urlCategory);
    return category ? category.id : 'all';
  }, [urlCategory]);

  const currentCategory = getCurrentCategory();

  const selectCategory = useCallback((categoryIdentifier) => {
    const category = findCategoryByIdentifier(categoryIdentifier);

    if(!category) {
      console.warn(`Category "${categoryIdentifier}" not found`);
      return;
    }

    if(category.id === currentCategory) return;

    navigate(category.path);
  }, [currentCategory, navigate]);

  const isCategoryActive = useCallback((categoryIdentifier) => {
    const category = findCategoryByIdentifier(categoryIdentifier);
    return category ? category.id === currentCategory : false;
  }, [currentCategory]);

  const getNavigationItems = useCallback(() => {
    return PORTFOLIO_CATEGORIES.map(category => ({
      ...category,
      isActive: category.id === currentCategory,
      onClick: () => selectCategory(category.id)
    }));
  }, [currentCategory, selectCategory]);

  return {
    currentCategory,
    availableCategories: PORTFOLIO_CATEGORIES,
    selectCategory,
    isCategoryActive,
    getCategoryDisplayName: (cat) => getCategoryDisplayName(cat),
    getNavigationItems,
    getCurrentCategoryInfo: () => findCategoryByIdentifier(currentCategory)
  };
};