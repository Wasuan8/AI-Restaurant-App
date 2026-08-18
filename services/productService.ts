// import { fireBaseDB } from '../config/firebaseConfig';
// import { Product } from '../types/types';
// import { ref, get } from 'firebase/database';

// const productsRef = ref(fireBaseDB, 'products');

// const fetchProducts = async (): Promise<Product[]> => {
//   const snapshot = await get(productsRef);
//   const data = snapshot.val();
  
//   const products: Product[] = [];
//   if (data) {
//     for (const key in data) {
//       if (data.hasOwnProperty(key)) {
//         products.push({ ...data[key] });
//       }
//     }
//   }
  
//   return products;
// };

// export { fetchProducts };
import axios from 'axios';
import { Product } from '../types/types';
import { API_URL } from '../config/runpodConfigs';

let cachedProducts: Product[] | null = null;

const fetchProducts = async (forceRefresh = false): Promise<Product[]> => {
  if (cachedProducts && !forceRefresh) {
    return cachedProducts;
  }
  const response = await axios.get(`${API_URL}/products`);
  cachedProducts = response.data;
  return cachedProducts as Product[];
};


export { fetchProducts };