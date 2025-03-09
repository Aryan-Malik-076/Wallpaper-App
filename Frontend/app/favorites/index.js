import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import { useRouter } from 'expo-router';
import ImageGrid from '../../components/imageGrid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

const FavoritesScreen = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const scrollRef = useRef(null);

  // Use useFocusEffect to reload favorites each time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const fetchFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Persistent Header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>
            <Text style={styles.titleHighlight}>Wall</Text>
            tastic
          </Text>
        </Pressable>
      </View>

      {/* Favorites Content */}
      <ScrollView
        contentContainerStyle={styles.scrollView}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
      >
        {favorites.length > 0 ? (
          <ImageGrid images={favorites} router={router} />
        ) : (
          <View style={styles.noFavoritesContainer}>
            <Text style={styles.noFavorites}>No favorites added yet.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15
  },
  header: {
    marginHorizontal: wp(4),
    marginTop: wp(14),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grayBG,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
    textAlign: 'center',
  },
  titleHighlight: {
    color: theme.colors.primary, // Or any color you want for the "Wall" part
  },
  scrollView: {
    paddingHorizontal: wp(4),
    paddingBottom: wp(4),
    gap: 15,
  },
  noFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(20),
  },
  noFavorites: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.neutral(0.6),
  },
});

export default FavoritesScreen;