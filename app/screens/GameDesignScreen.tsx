import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { ChatBubble } from '../components/ChatBubble';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { AgentIndicator } from '../components/AgentIndicator';

type Props = NativeStackScreenProps<RootStackParamList, 'GameDesign'>;

export const GameDesignScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookAnalysis } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [designComplete, setDesignComplete] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    addMessage(
      'agent',
      `Awesome! Now let's design a game based on "${bookAnalysis.book.title}"! 🎮\n\nI have a few ideas:\n\n1. 🏃 Side-scrolling platformer - Jump and collect tacos!\n2. 🎯 Top-down collection game - Gather tacos while avoiding spicy salsa!\n3. ⚡ Fast obstacle avoider - Dodge spicy obstacles!\n\nWhich sounds the most fun to you?`,
      'game-designer'
    );
  }, []);

  const addMessage = (role: 'user' | 'agent', content: string, agentType?: string) => {
    const newMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      agentType,
    };
    setMessages((prev) => [...prev, newMessage]);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    addMessage('user', text);
    setInputText('');
    setIsAgentTyping(true);

    try {
      // Real agent integration - Process response with Game Designer
      const { getOrchestrator } = await import('../services/agents/orchestrator');
      const orchestrator = await getOrchestrator();
      
      console.log('🤖 Processing game design response...');
      const result = await orchestrator.processGameDesignResponse(text);
      
      if (result.success && result.agentMessage) {
        console.log('✅ Game Designer response received');
        addMessage('agent', result.agentMessage, 'game-designer');
      } else {
        addMessage('agent', 'That sounds great! What else should we add?', 'game-designer');
      }
      
      setIsAgentTyping(false);
      
      // Check if design is complete
      if (result.isComplete) {
        console.log('✅ Game design complete!');
        setDesignComplete(true);
      }
    } catch (error) {
      console.error('❌ Error processing design:', error);
      addMessage('agent', 'Let me think about that differently...', 'game-designer');
      setIsAgentTyping(false);
    }
  };

  const handleVoiceTranscription = (text: string) => {
    handleSend(text);
  };

  const handleBuildGame = async () => {
    try {
      // Get game design from orchestrator
      const { getOrchestrator } = await import('../services/agents/orchestrator');
      const orchestrator = await getOrchestrator();
      
      console.log('🎨 Getting game design...');
      const gameDesign = await orchestrator.getGameDesign();
      
      if (gameDesign) {
        console.log('✅ Game design retrieved');
        navigation.navigate('Generation', { gameDesign });
      } else {
        // Fallback design if needed
        const fallbackDesign = {
          gameTitle: `${bookAnalysis.book.title} - The Game`,
          gameType: 'platformer' as const,
          objective: 'Complete the adventure!',
          mechanics: [
            { name: 'Move', description: 'Move and jump', implementation: 'Arcade physics' },
          ],
          characters: [
            { name: 'Hero', role: 'player' as const, abilities: ['jump', 'run'], appearance: 'Brave hero' },
          ],
          collectibles: [
            { name: 'Star', points: 10, appearance: 'Golden star' },
          ],
          obstacles: [
            { name: 'Obstacle', behavior: 'Static', appearance: 'Block' },
          ],
          powerUps: [],
          levelDesign: {
            layout: 'Simple platformer',
            difficulty: 'easy' as const,
            estimatedDuration: '2-3 minutes',
          },
          visualStyle: {
            colorScheme: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
            artStyle: 'Colorful',
            animations: ['jump', 'collect'],
          },
          designNotes: messages.map(m => m.content),
        };
        navigation.navigate('Generation', { gameDesign: fallbackDesign });
      }
    } catch (error) {
      console.error('❌ Error getting game design:', error);
      // Navigate with fallback
      const fallbackDesign = {
        gameTitle: `${bookAnalysis.book.title} - The Game`,
        gameType: 'platformer' as const,
        objective: 'Complete the adventure!',
        mechanics: [
          { name: 'Move', description: 'Move and jump', implementation: 'Arcade physics' },
        ],
        characters: [
          { name: 'Hero', role: 'player' as const, abilities: ['jump', 'run'], appearance: 'Brave hero' },
        ],
        collectibles: [
          { name: 'Star', points: 10, appearance: 'Golden star' },
        ],
        obstacles: [
          { name: 'Obstacle', behavior: 'Static', appearance: 'Block' },
        ],
        powerUps: [],
        levelDesign: {
          layout: 'Simple platformer',
          difficulty: 'easy' as const,
          estimatedDuration: '2-3 minutes',
        },
        visualStyle: {
          colorScheme: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
          artStyle: 'Colorful',
          animations: ['jump', 'collect'],
        },
        designNotes: messages.map(m => m.content),
      };
      navigation.navigate('Generation', { gameDesign: fallbackDesign });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Game Design Studio</Text>
          <Text style={styles.headerSubtitle}>Let's create something awesome!</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
        >
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.content}
              isUser={message.role === 'user'}
              agentType={message.agentType}
              timestamp={message.timestamp}
            />
          ))}
          {isAgentTyping && (
            <AgentIndicator agentType="game-designer" message="designing something cool..." />
          )}
        </ScrollView>

        {!designComplete ? (
          <View style={styles.inputContainer}>
            <VoiceRecorder
              onTranscription={handleVoiceTranscription}
              disabled={isAgentTyping}
            />
            <Text style={styles.orText}>or</Text>
            <View style={styles.textInputRow}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Tell me your ideas..."
                multiline
                editable={!isAgentTyping}
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={() => handleSend(inputText)}
                disabled={!inputText.trim() || isAgentTyping}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.buildContainer}>
            <TouchableOpacity
              style={styles.buildButton}
              onPress={handleBuildGame}
            >
              <Text style={styles.buildButtonText}>Build My Game! ⚙️</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4ECDC4',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingVertical: 16,
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  orText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 8,
    fontSize: 14,
  },
  textInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buildContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  buildButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  buildButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

