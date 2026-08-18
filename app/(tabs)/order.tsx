import { useCart } from '@/components/CartContext';
import ProductList from '@/components/CartProductList';
import PageHeader from '@/components/PageHeader';
import { fetchProducts } from '@/services/productService';
import { Product } from '@/types/types';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-root-toast';

const Order = () => {

  const { cartItems, SetQuantityCart, emptyCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const calculateTotal = (products: Product[], quantities: { [key: string]: number }): number => {
    return products.reduce((total, product) => {
      const quantity = quantities[product.name] || 0;
      return total + product.price * quantity;
    }, 0);
  };

  useEffect(() => {
    const total = calculateTotal(products, cartItems);
    setTotalPrice(total);
  }, [cartItems, products]);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts();
        if (isMounted) {
          setProducts(productsData);
        }
      } catch (err) {
        if (isMounted) {
          setError("Error fetching products" + err);
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadProducts();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  const orderNow = () => {
    emptyCart();
    Toast.show('Order placed successfully!', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
    });
    router.push('/thankyou')
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar backgroundColor="white" />
      <PageHeader title="Order" showHeaderRight={false} bgColor='#F9F9F9' />

      <View style={styles.mainContainer}>
        <View style={styles.listContainer}>
          <ProductList products={products} quantities={cartItems} setQuantities={SetQuantityCart} totalPrice={totalPrice} />
        </View>

        <View style={styles.footer}>
          <View style={styles.paymentRow}>
            <View style={styles.paymentInfo}>
              <Ionicons name="wallet-outline" size={24} color="#C67C4E" />
              <View>
                <Text style={styles.paymentLabel}>Cash/Wallet</Text>
                <Text style={styles.paymentValue}> ₹{totalPrice === 0 ? 0 : totalPrice + 1}</Text>
              </View>
            </View>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          </View>

          <TouchableOpacity
            style={[styles.orderButton, totalPrice === 0 ? styles.orderButtonDisabled : styles.orderButtonEnabled]}
            disabled={totalPrice === 0}
            onPress={orderNow}
          >
            <Text style={styles.orderButtonText}>Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  listContainer: {
    height: '75%',
  },
  footer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 24,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentLabel: {
    color: '#242424',
    fontSize: 16,
    fontFamily: 'Sora-SemiBold',
    paddingBottom: 4,
    marginLeft: 12,
  },
  paymentValue: {
    color: '#C67C4E',
    fontSize: 14,
    fontFamily: 'Sora-SemiBold',
    marginLeft: 12,
  },
  orderButton: {
    width: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 12,
  },
  orderButtonEnabled: {
    backgroundColor: '#C67C4E',
  },
  orderButtonDisabled: {
    backgroundColor: '#EDEDED',
  },
  orderButtonText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Sora-Regular',
  },
});

export default Order