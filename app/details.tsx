import { useCart } from '@/components/CartContext';
import DescriptionSection from '@/components/DescriptionSection';
import DetailsHeader from '@/components/DetailsHeader';
import PageHeader from '@/components/PageHeader';
import SizesSection from '@/components/SizesSection';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-root-toast';

const DetailsPage = () => {
  const { addToCart } = useCart();

  const { name, image_url, image_path, type, description, price, rating } = useLocalSearchParams() as {
    name: string;
    image_url: string;
    image_path: string;   // ← new
    type: string;
    description: string;
    price: string;
    rating: string;
  };

  const buyNow = () => {
    addToCart(name, 1);
    Toast.show(`${name} added to cart`, { duration: Toast.durations.SHORT });
    router.back();
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar backgroundColor="white" />
      <PageHeader title="Detail" showHeaderRight={true} bgColor='#F9F9F9' />

      <View style={styles.mainContainer}>
        <ScrollView>
          <View style={styles.scrollContent}>
            <DetailsHeader
              image_url={image_url}
              image_path={image_path}   // ← pass it down
              name={name}
              type={type}
              rating={Number(rating)}
            />
            <DescriptionSection description={description} />
            <SizesSection />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}> ₹{price}</Text>
          </View>

          <TouchableOpacity
            style={styles.buyButton}
            onPress={buyNow}
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
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
  scrollContent: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  priceLabel: {
    color: '#A2A2A2',
    fontSize: 16,
    fontFamily: 'Sora-Regular',
    paddingBottom: 12,
  },
  priceValue: {
    color: '#C67C4E',
    fontSize: 24,
    fontFamily: 'Sora-SemiBold',
  },
  buyButton: {
    backgroundColor: '#C67C4E',
    width: '70%',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Sora-Regular',
  },
});

export default DetailsPage