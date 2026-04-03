import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

export default function NatureCard({ title, subtitle, date, image, onPress, style }) {
  return (
    <TouchableOpacity 
      style={[styles.card, style]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      {image && (
        <Image 
          source={typeof image === 'string' ? { uri: image } : image} 
          style={styles.image} 
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        {date && <Text style={styles.date}>{date}</Text>}
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.light.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E5E0',
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 24,
  },
  date: {
    fontFamily: 'Jakarta-Medium',
    fontSize: 12,
    color: '#9BA39B',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 22,
    color: Colors.light.forest,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Jakarta-Regular',
    fontSize: 14,
    color: '#4A554A',
    lineHeight: 20,
  },
});
