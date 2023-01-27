module.exports = (template, product) => {
  return template
    .replaceAll('{productId}', product.id)
    .replaceAll('{productName}', product.productName)
    .replaceAll('{productImage}', product.image)
    .replaceAll('{productFrom}', product.from)
    .replaceAll('{productNutrients}', product.nutrients)
    .replaceAll('{productQuantity}', product.quantity)
    .replaceAll('{productPrice}', product.price)
    .replaceAll('{notOrganicClass}', product.organic ? '' : 'not-organic')
    .replaceAll('{productDescription}', product.description);
};
