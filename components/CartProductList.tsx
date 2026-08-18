import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Product } from '@/types/types';
import OrdersHeader from './OrdersHeader';
import OrdersFooter from './OrdersFooter';

// Props for ProductList
interface ProductListProps {
  products: Product[];
  quantities: { [key: string]: number };
  setQuantities: (itemKey: string, delta: number) => void;
  totalPrice: number;
}

const ProductList: React.FC<ProductListProps> = ({ products, quantities, setQuantities, totalPrice }) => {

  const filteredProducts = products.filter((product) => (quantities[product.name] || 0) > 0);

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.image_url }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => setQuantities(item.name, -1)}>
          <Text style={styles.controlText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantities[item.name] || 0}</Text>
        <TouchableOpacity onPress={() => setQuantities(item.name, 1)}>
          <Text style={styles.controlText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View>
      {filteredProducts.length > 0 ? (
        <FlatList
          ListHeaderComponent={<OrdersHeader />}
          ListFooterComponent={<OrdersFooter totalPrice={totalPrice} />}
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
        />
      ) : (

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No items in your cart yet</Text>
          <Text style={styles.emptySubtitle}>Let's Go Get some Delicious Goodies</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 28,
    paddingBottom: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Sora-SemiBold',
    color: '#242424',
  },
  category: {
    fontFamily: 'Sora-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 20,
  },
  quantityText: {
    marginHorizontal: 8,
  },
  emptyContainer: {
    marginHorizontal: 28,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Sora-SemiBold',
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 20,
    fontFamily: 'Sora-SemiBold',
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default ProductList;