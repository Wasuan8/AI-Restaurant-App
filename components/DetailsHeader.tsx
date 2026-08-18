import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

// ─── Same local image map as Home.tsx ─────────────────────────────
const LOCAL_IMAGES: Record<string, any> = {
  cappuccino:                require('../assets/images/menu/cappuccino.jpg'),
  latte:                     require('../assets/images/menu/Latte.jpg'),
  espresso_shot:             require('../assets/images/menu/Espresso_shot.webp'),
  jumbo_savory_scone:        require('../assets/images/menu/SavoryScone.webp'),
  chocolate_chip_biscotti:   require('../assets/images/menu/chocolat_biscotti.jpg'),
  hazelnut_biscotti:         require('../assets/images/menu/Hazelnut_Biscotti.jpg'),
  chocolate_croissant:       require('../assets/images/menu/Chocolate_Croissant.jpg'),
  cranberry_scone:           require('../assets/images/menu/Cranberry_Scone.jpg'),
  croissant:                 require('../assets/images/menu/Croissant.jpg'),
  almond_croissant:          require('../assets/images/menu/almond_croissant.jpg'),
  ginger_biscotti:           require('../assets/images/menu/Ginger_Biscotti.webp'),
  oatmeal_scone:             require('../assets/images/menu/oatmeal_scones.jpg'),
  ginger_scone:              require('../assets/images/menu/Ginger_Scone.webp'),
  dark_chocolate:            require('../assets/images/menu/Dark_chocolate.jpg'),
  chocolate_syrup:           require('../assets/images/menu/Chocolate_syrup.jpg'),
  hazelnut_syrup:            require('../assets/images/menu/Hazelnut_syrup.webp'),
  carmel_syrup:              require('../assets/images/menu/caramel_syrup.jpg'),
  sugar_free_vanilla_syrup:  require('../assets/images/menu/Vanilla_syrup.jpg'),
};

const FALLBACK_IMAGE = require('../assets/images/menu/cappuccino.jpg');

function resolveImage(name: string, imagePath?: string, remoteUrl?: string): any {
  if (imagePath) {
    const pathKey = imagePath
      .replace(/\.[^/.]+$/, '')  // strip extension
      .toLowerCase()
      .replace(/\s+/g, '_');
    const match = Object.entries(LOCAL_IMAGES).find(
      ([key]) => pathKey.includes(key) || key.includes(pathKey)
    );
    if (match) return match[1];
  }
  const nameKey = name.toLowerCase().replace(/\s+/g, '_');
  if (LOCAL_IMAGES[nameKey]) return LOCAL_IMAGES[nameKey];
  if (remoteUrl) return { uri: remoteUrl };
  return FALLBACK_IMAGE;
}
// ──────────────────────────────────────────────────────────────────

type Props = {
  image_url?: string;
  image_path?: string;   // ← new
  name: string;
  type: string;
  rating: number;
};

const DetailsHeader = ({ image_url, image_path, name, type, rating }: Props) => {
  const imageSource = resolveImage(name, image_path, image_url);

  return (
    <View style={styles.container}>
      <Image
        source={imageSource}
        style={styles.image}
        resizeMode='cover'
      />
      <Text style={styles.name}>{name}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.type}>{type}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.ratingValue}>{rating}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 16,
  },
  image: {
    width: '100%',
    height: 256,
    borderRadius: 24,
  },
  name: {
    color: '#242424',
    fontSize: 24,
    fontFamily: 'Sora-SemiBold',
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  type: {
    color: '#A2A2A2',
    fontSize: 14,
    fontFamily: 'Sora-Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    color: '#FACC15',
  },
  ratingValue: {
    color: '#242424',
    fontFamily: 'Sora-SemiBold',
  },
});

export default DetailsHeader