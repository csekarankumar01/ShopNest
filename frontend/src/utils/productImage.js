const fallbackImage = '/ShopNestLogo.png';

export const getProductImage = (imageUrl) => {
  if (Array.isArray(imageUrl)) {
    return imageUrl[0] || fallbackImage;
  }

  return imageUrl || fallbackImage;
};
