import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface SavedGameItem {
  id: string;
  bookTitle: string;
  gameTitle: string;
  createdAt: string;
  playCount: number;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [savedGames, setSavedGames] = useState<SavedGameItem[]>([]);

  useEffect(() => {
    loadSavedGames();
  }, []);

  const loadSavedGames = async () => {
    try {
      const gamesJson = await AsyncStorage.getItem('saved_games');
      if (gamesJson) {
        setSavedGames(JSON.parse(gamesJson));
      }
    } catch (error) {
      console.error('Error loading saved games:', error);
    }
  };

  const startNewGame = () => {
    navigation.navigate('Camera');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🎮 The Game Maker</Text>
          <Text style={styles.subtitle}>by Farrah</Text>
          <Text style={styles.description}>
            Turn your favorite books into awesome games!
          </Text>
        </View>

        {/* New Game Button */}
        <TouchableOpacity
          style={styles.newGameButton}
          onPress={startNewGame}
        >
          <Text style={styles.newGameIcon}>📚 ➔ 🎮</Text>
          <Text style={styles.newGameText}>Create New Game</Text>
          <Text style={styles.newGameHint}>Take a picture of your book!</Text>
        </TouchableOpacity>

        {/* Saved Games Library */}
        {savedGames.length > 0 && (
          <View style={styles.librarySection}>
            <Text style={styles.sectionTitle}>📖 My Games</Text>
            {savedGames.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={styles.gameCard}
                onPress={() => {
                  // TODO: Load and play saved game
                  alert('Loading saved game feature coming soon!');
                }}
              >
                <View style={styles.gameCardContent}>
                  <Text style={styles.gameTitle}>{game.gameTitle}</Text>
                  <Text style={styles.bookTitle}>From: {game.bookTitle}</Text>
                  <Text style={styles.gameStats}>
                    Played {game.playCount} times
                  </Text>
                </View>
                <Text style={styles.playIcon}>▶️</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* How It Works */}
        <View style={styles.howItWorks}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Take a picture of your book</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Tell me about the story</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Design your dream game</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>Play your awesome game!</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  newGameButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  newGameIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  newGameText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  newGameHint: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  librarySection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameCardContent: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  gameStats: {
    fontSize: 12,
    color: '#999',
  },
  playIcon: {
    fontSize: 32,
  },
  howItWorks: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 36,
    marginRight: 16,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

