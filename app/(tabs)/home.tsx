import { useCart } from '@/components/CartContext';
import { fetchProducts } from '@/services/productService';
import { Product } from '@/types/types';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView, } from "react-native-gesture-handler";
import Toast from 'react-native-root-toast';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Local image map ──────────────────────────────────────────────
const LOCAL_IMAGES: Record<string, any> = {
  'cappuccino':               require('../../assets/images/menu/cappuccino.jpg'),
  'latte':                    require('../../assets/images/menu/Latte.jpg'),
  'espresso_shot':            require('../../assets/images/menu/Espresso_shot.webp'),
  'jumbo_savory_scone':       require('../../assets/images/menu/SavoryScone.webp'),
  'chocolate_chip_biscotti':  require('../../assets/images/menu/chocolat_biscotti.jpg'),
  'hazelnut_biscotti':        require('../../assets/images/menu/Hazelnut_Biscotti.jpg'),
  'chocolate_croissant':      require('../../assets/images/menu/Chocolate_Croissant.jpg'),
  'cranberry_scone':          require('../../assets/images/menu/Cranberry_Scone.jpg'),
  'croissant':                require('../../assets/images/menu/Croissant.jpg'),
  'almond_croissant':         require('../../assets/images/menu/almond_croissant.jpg'),
  'ginger_biscotti':          require('../../assets/images/menu/Ginger_Biscotti.webp'),
  'oatmeal_scone':            require('../../assets/images/menu/oatmeal_scones.jpg'),
  'ginger_scone':             require('../../assets/images/menu/Ginger_Scone.webp'),
  'dark_chocolate':           require('../../assets/images/menu/Dark_chocolate.jpg'),
  'chocolate_syrup':          require('../../assets/images/menu/Chocolate_syrup.jpg'),
  'hazelnut_syrup':           require('../../assets/images/menu/Hazelnut_syrup.webp'),
  'carmel_syrup':             require('../../assets/images/menu/caramel_syrup.jpg'),
  'sugar_free_vanilla_syrup': require('../../assets/images/menu/Vanilla_syrup.jpg'),
};
const FALLBACK_IMAGE = require('../../assets/images/menu/cappuccino.jpg');

function resolveImage(name: string, imagePath?: string, remoteUrl?: string): any {
  if (imagePath) {
    const pathKey = imagePath.replace(/\.[^/.]+$/, '').toLowerCase().replace(/\s+/g, '_');
    const match = Object.entries(LOCAL_IMAGES).find(([k]) => pathKey.includes(k) || k.includes(pathKey));
    if (match) return match[1];
  }
  const nameKey = name.toLowerCase().replace(/\s+/g, '_');
  if (LOCAL_IMAGES[nameKey]) return LOCAL_IMAGES[nameKey];
  if (remoteUrl) return { uri: remoteUrl };
  return FALLBACK_IMAGE;
}

// ─── Featured Card ────────────────────────────────────────────────
const FeaturedCard = ({
  item, index,
}: { item: Product; index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 500,
        delay: 300 + index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0, tension: 65, friction: 11,
        delay: 300 + index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn = () =>
    Animated.spring(pressScale, { toValue: 0.95, useNativeDriver: true, tension: 200, friction: 10 }).start();
  const onPressOut = () =>
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }).start();

  const imageSource = resolveImage(item.name, item.image_path, item.image_url);
  const isFirst = index === 0;

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateX: slideAnim }, { scale: pressScale }],
      marginRight: 14,
    }}>
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => router.push({
          pathname: '/details',
          params: { name: item.name, image_url: item.image_url, image_path: item.image_path, type: item.category, price: item.price, rating: item.rating, description: item.description }
        })}
        activeOpacity={1}
        style={{
          width: isFirst ? 158 : 138,
          backgroundColor: isFirst ? '#2A1A0E' : '#FFFFFF',
          borderRadius: 22,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: isFirst ? 8 : 4 },
          shadowOpacity: isFirst ? 0.22 : 0.08,
          shadowRadius: isFirst ? 16 : 12,
          elevation: isFirst ? 10 : 4,
        }}
      >
        <Image
          source={imageSource}
          style={{ width: '100%', height: isFirst ? 158 : 130 }}
          resizeMode="cover"
        />
        <View style={{ padding: 10 }}>
          <Text numberOfLines={1} style={{
            color: isFirst ? '#FFFFFF' : '#1A1A1A',
            fontSize: 13, fontFamily: 'Sora-SemiBold', marginBottom: 3,
          }}>{item.name}</Text>
          <Text style={{
            color: '#C57C3E', fontSize: 13, fontFamily: 'Sora-SemiBold',
          }}>${item.price}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Row Card ────────────────────────────────────────────────────
const RowCard = ({ item, index }: { item: Product; index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 450,
        delay: 100 + index * 80,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0, tension: 70, friction: 12,
        delay: 100 + index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn = () =>
    Animated.spring(pressScale, { toValue: 0.95, useNativeDriver: true, tension: 200, friction: 10 }).start();
  const onPressOut = () =>
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }).start();

  const imageSource = resolveImage(item.name, item.image_path, item.image_url);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateX: slideAnim }, { scale: pressScale }],
      marginRight: 12,
    }}>
      <TouchableOpacity
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => router.push({
          pathname: '/details',
          params: { name: item.name, image_url: item.image_url, image_path: item.image_path, type: item.category, price: item.price, rating: item.rating, description: item.description }
        })}
        activeOpacity={1}
        style={{
          width: 115,
          backgroundColor: '#FFFFFF',
          borderRadius: 18, overflow: 'hidden',
          shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
        }}
      >
        <Image source={imageSource} style={{ width: '100%', height: 95 }} resizeMode="cover" />
        <View style={{ padding: 8 }}>
          <Text numberOfLines={1} style={{ fontSize: 12, fontFamily: 'Sora-SemiBold', color: '#1A1A1A' }}>{item.name}</Text>
          <Text style={{ fontSize: 12, fontFamily: 'Sora-SemiBold', color: '#C57C3E', marginTop: 2 }}>${item.price}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Section Row ─────────────────────────────────────────────────
const ProductSection = ({
  title, products, sectionIndex,
}: { title: string; products: Product[]; sectionIndex: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 500,
        delay: 200 + sectionIndex * 150,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0, tension: 65, friction: 12,
        delay: 200 + sectionIndex * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (products.length === 0) return null;

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
      marginTop: 26,
    }}>
      {/* Section title — no See All */}
      <Text style={{
        fontSize: 15, fontFamily: 'Sora-SemiBold',
        color: '#1A1A1A', paddingHorizontal: 20, marginBottom: 14,
      }}>{title}</Text>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item, index }) => <RowCard item={item} index={index} />}
      />
    </Animated.View>
  );
};

// ─── Category Pill ────────────────────────────────────────────────
const CategoryPill = ({
  item, index, onPress,
}: { item: { id: string; selected: boolean }; index: number; onPress: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const scaleAnim = useRef(new Animated.Value(item.selected ? 1 : 0.97)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 400,
        delay: 150 + index * 60,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0, tension: 70, friction: 12,
        delay: 150 + index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animate scale on selection change
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: item.selected ? 1 : 0.97,
      tension: 150, friction: 8,
      useNativeDriver: true,
    }).start();
  }, [item.selected]);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
    }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 6,
          paddingHorizontal: 16, paddingVertical: 9, borderRadius: 30,
          backgroundColor: item.selected ? '#2A1A0E' : '#EFEFEF',
          shadowColor: item.selected ? '#2A1A0E' : 'transparent',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.25, shadowRadius: 8,
          elevation: item.selected ? 5 : 0,
          marginRight: 10,
        }}
      >
        <Ionicons name="cafe-outline" size={13} color={item.selected ? '#C57C3E' : '#888'} />
        <Text style={{
          color: item.selected ? '#FFFFFF' : '#555555',
          fontSize: 13, fontFamily: 'Sora-SemiBold',
        }}>{item.id}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────
const Home = () => {
  const { addToCart } = useCart();
  const params = useLocalSearchParams<{ userName?: string }>();
  const userName = params.userName || 'Coffee Lover!';

  const [products, setProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<{ id: string; selected: boolean }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Header animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const searchFade = useRef(new Animated.Value(0)).current;
  const searchSlide = useRef(new Animated.Value(-12)).current;
  const featuredTitleFade = useRef(new Animated.Value(0)).current;
  const featuredTitleSlide = useRef(new Animated.Value(16)).current;

  const runEntryAnimations = () => {
    // Header greeting
    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 70, friction: 12, useNativeDriver: true }),
    ]).start();

    // Search bar — slight delay
    Animated.parallel([
      Animated.timing(searchFade, { toValue: 1, duration: 600, delay: 150, useNativeDriver: true }),
      Animated.spring(searchSlide, { toValue: 0, tension: 70, friction: 12, delay: 150, useNativeDriver: true }),
    ]).start();

    // Featured section title
    Animated.parallel([
      Animated.timing(featuredTitleFade, { toValue: 1, duration: 500, delay: 280, useNativeDriver: true }),
      Animated.spring(featuredTitleSlide, { toValue: 0, tension: 65, friction: 12, delay: 280, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const data = await fetchProducts();
        if (!isMounted) return;
        const cats = ['All', ...Array.from(new Set(data.map((p) => p.category)))];
        setProducts(data);
        setProductCategories(cats.map((c) => ({ id: c, selected: c === 'All' })));
        runEntryAnimations();
      } catch (err) {
        if (isMounted) setError('Error: ' + err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const handleCategorySelect = useCallback((id: string) => {
    setSelectedCategory(id);
    setProductCategories(prev => prev.map(c => ({ ...c, selected: c.id === id })));
  }, []);

  const addButton = useCallback((name: string) => {
    addToCart(name, 1);
    Toast.show(`${name} added to cart 🛒`, { duration: Toast.durations.SHORT });
  }, []);

  const featuredProducts = selectedCategory === 'All'
    ? products.slice(0, 6)
    : products.filter(p => p.category === selectedCategory).slice(0, 6);

  const allCategories = Array.from(new Set(products.map(p => p.category)));
  const sectionsToShow = selectedCategory === 'All' ? allCategories : [selectedCategory];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F6F2' }}>
        <Ionicons name="cafe" size={36} color="#C57C3E" />
        <Text style={{ fontFamily: 'Sora-Regular', color: '#A2A2A2', marginTop: 12 }}>
          Brewing your menu...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F6F2' }}>
        <Text style={{ fontFamily: 'Sora-Regular', color: '#ED5151' }}>{error}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1C1C" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F6F2' }} edges={['top']}>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

          {/* ── Dark Header ── */}
          <View style={{ backgroundColor: '#1C1C1C', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 }}>

            {/* Greeting row */}
            <Animated.View style={{
              opacity: headerFade,
              transform: [{ translateY: headerSlide }],
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: '#C57C3E',
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 2, borderColor: '#3A2A1A',
                }}>
                  <Ionicons name="person" size={21} color="#FFF" />
                </View>
                <View>
                  <Text style={{ color: '#666', fontSize: 12, fontFamily: 'Sora-Regular' }}>Good Morning ☀️</Text>
                  <Text style={{ color: '#FFFFFF', fontSize: 17, fontFamily: 'Sora-SemiBold' }}>
                    Hi, <Text style={{ color: '#C57C3E' }}>{userName}</Text>
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={{ padding: 4 }}>
                <View style={{ gap: 5 }}>
                  <View style={{ width: 20, height: 2, backgroundColor: '#FFF', borderRadius: 1 }} />
                  <View style={{ width: 14, height: 2, backgroundColor: '#555', borderRadius: 1 }} />
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Search */}
            <Animated.View style={{
              opacity: searchFade,
              transform: [{ translateY: searchSlide }],
              flexDirection: 'row', gap: 10,
            }}>
              <View style={{
                flex: 1, flexDirection: 'row', alignItems: 'center',
                backgroundColor: '#2A2A2A', borderRadius: 14,
                paddingHorizontal: 14, height: 48,
                borderWidth: 1, borderColor: '#333',
              }}>
                <Ionicons name="search" size={18} color="#555" />
                <TextInput
                  placeholder="Coffee shop, beer & wine..."
                  placeholderTextColor="#555"
                  style={{ flex: 1, marginLeft: 10, color: '#FFF', fontFamily: 'Sora-Regular', fontSize: 13 }}
                />
              </View>
              <TouchableOpacity style={{
                width: 48, height: 48, backgroundColor: '#C57C3E',
                borderRadius: 14, alignItems: 'center', justifyContent: 'center',
                shadowColor: '#C57C3E', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
              }}>
                <Feather name="sliders" size={18} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* ── Category Pills ── */}
          <View style={{ paddingTop: 20, paddingBottom: 6 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              {productCategories.map((item, index) => (
                <CategoryPill
                  key={item.id}
                  item={item}
                  index={index}
                  onPress={() => handleCategorySelect(item.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* ── Featured Section Title ── */}
          <Animated.Text style={{
            opacity: featuredTitleFade,
            transform: [{ translateY: featuredTitleSlide }],
            fontSize: 15, fontFamily: 'Sora-SemiBold',
            color: '#1A1A1A', paddingHorizontal: 20,
            marginTop: 20, marginBottom: 14,
          }}>
            {selectedCategory === 'All' ? 'Featured' : selectedCategory}
          </Animated.Text>

          {/* ── Featured Cards ── */}
          <FlatList
            data={featuredProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item, index }) => <FeaturedCard item={item} index={index} />}
            scrollEnabled={true}
          />

          {/* ── Category Sections (no See All) ── */}
          {sectionsToShow.map((cat, sectionIndex) => (
            <ProductSection
              key={cat}
              title={cat}
              sectionIndex={sectionIndex}
              products={products.filter(p => p.category === cat)}
            />
          ))}

        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;