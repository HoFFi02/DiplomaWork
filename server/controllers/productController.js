import Product from '../models/Product.js';

const getAllProducts = async (req, res) => {
  const language = req.query.language || 'pl'; 

  try {
    const products = await Product.findAll({
      attributes: [
        'id_product',
        language === 'pl' ? 'name_pl' : 'name_en',
        language === 'pl' ? 'unit_pl' : 'unit_en',
      ],
    });

    const formattedProducts = products.map((product) => ({
      id_product: product.id_product,
      name: language === 'pl' ? product.name_pl : product.name_en,
      unit: language === 'pl' ? product.unit_pl : product.unit_en,
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error('Błąd podczas pobierania produktów:', error.message);
    res.status(500).json({ message: 'Wystąpił błąd podczas pobierania produktów', error: error.message });
  }
};

export { getAllProducts };
