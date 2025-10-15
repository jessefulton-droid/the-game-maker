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

    // TODO: Integrate with Game Designer agent
    setTimeout(() => {
      const responses = [
        "Great choice! What should the player collect in the game?",
        "Cool! What obstacles or enemies should they avoid?",
        "Love it! Should there be any power-ups or special abilities?",
        "Perfect! I think we have an amazing game design. Ready to build it?",
      ];
      
      const responseIndex = Math.min(messages.length / 2, responses.length - 1);
      const response = responses[Math.floor(responseIndex)];
      
      addMessage('agent', response, 'game-designer');
      setIsAgentTyping(false);
      
      if (messages.length >= 6) {
        setDesignComplete(true);
      }
    }, 2000);
  };

  const handleVoiceTranscription = (text: string) => {
    handleSend(text);
  };

  const handleBuildGame = () => {
    // TODO: Get game design from orchestrator
    const mockGameDesign = {
      gameTitle: `${bookAnalysis.book.title} - The Game`,
      gameType: 'platformer' as const,
      objective: 'Collect all the tacos while avoiding spicy salsa!',
      mechanics: [
        { name: 'Jump', description: 'Jump over obstacles', implementation: 'Arcade physics' },
        { name: 'Collect', description: 'Gather tacos', implementation: 'Overlap detection' },
      ],
      characters: [
        { name: 'Dragon', role: 'player' as const, abilities: ['jump', 'run'], appearance: 'Red dragon' },
      ],
      collectibles: [
        { name: 'Taco', points: 10, appearance: 'Yellow taco' },
      ],
      obstacles: [
        { name: 'Spicy Salsa', behavior: 'Static hazard', appearance: 'Red puddle' },
      ],
      powerUps: [],
      levelDesign: {
        layout: 'Linear platformer level',
        difficulty: 'easy' as const,
        estimatedDuration: '3-5 minutes',
      },
      visualStyle: {
        colorScheme: ['#FF6B6B', '#4ECDC4', '#FFE66D'],
        artStyle: 'Colorful geometric shapes',
        animations: ['jump', 'collect', 'idle'],
      },
      designNotes: messages.map(m => m.content),
    };

    navigation.navigate('Generation', { gameDesign: mockGameDesign });
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

