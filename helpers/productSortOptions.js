const sortingOptions = {
    'Recommended': [], 
    'Price: Low to High': ['price', 'ASC'],
    'Price: High to Low': ['price', 'DESC'],
    'Rating: High to Low': ['rating', 'DESC'],
    'Rating: Low to High': ['rating', 'ASC'],
    'A-Z': ['title', 'ASC'], 
  };

module.exports = sortingOptions;