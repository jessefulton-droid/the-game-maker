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

type Props = NativeStackScreenProps<RootStackParamList, 'BookDiscussion'>;

export const BookDiscussionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookInfo } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Initialize with welcome message
    addMessage('agent', `Hi! I see you have "${bookInfo.title}"! That's such a great book! 📚\n\nCan you tell me what this book is about?`, 'story-analyst');
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
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    addMessage('user', text);
    setInputText('');
    setIsAgentTyping(true);

    // TODO: Integrate with Story Analyst agent
    // For now, simulate agent response
    setTimeout(() => {
      const responses = [
        "That sounds awesome! What did you like most about that part of the story?",
        "Wow, that's so cool! What did you learn from this book?",
        "I love that! Were there any characters that were your favorites?",
        "Great! Now I have a really good understanding of what makes this book special to you. Ready to turn it into a game?",
      ];
      
      const responseIndex = Math.min(messages.length / 2, responses.length - 1);
      const response = responses[Math.floor(responseIndex)];
      
      addMessage('agent', response, 'story-analyst');
      setIsAgentTyping(false);
      
      // Check if conversation is complete
      if (messages.length >= 6) {
        setConversationComplete(true);
      }
    }, 2000);
  };

  const handleVoiceTranscription = (text: string) => {
    handleSend(text);
  };

  const handleContinue = () => {
    // TODO: Get book analysis from orchestrator
    const mockBookAnalysis = {
      book: bookInfo,
      plotSummary: "A story about dragons who love tacos but can't handle spicy salsa.",
      themes: ['friendship', 'preferences', 'problem-solving'],
      characters: [
        { name: 'Dragons', description: 'Taco-loving dragons', role: 'protagonists', traits: ['friendly', 'hungry'] },
      ],
      keyMoments: ['Dragons eat tacos', 'Spicy salsa causes problems', 'Dragons breathe fire'],
      gameElements: [
        { type: 'collectible' as const, name: 'Tacos', description: 'Yummy tacos to collect', storyConnection: 'Dragons love them' },
        { type: 'obstacle' as const, name: 'Spicy Salsa', description: 'Makes dragons breathe fire', storyConnection: 'Main conflict' },
      ],
      discussionNotes: messages.map(m => m.content),
    };

    navigation.navigate('GameDesign', { bookAnalysis: mockBookAnalysis });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Let's Talk About the Book!</Text>
          <Text style={styles.headerSubtitle}>{bookInfo.title}</Text>
        </View>

        {/* Messages */}
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
            <AgentIndicator agentType="story-analyst" message="thinking about your answer..." />
          )}
        </ScrollView>

        {/* Input Area */}
        {!conversationComplete ? (
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
                placeholder="Type your answer..."
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
          <View style={styles.continueContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Let's Design the Game! 🎮</Text>
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
    backgroundColor: '#FF6B6B',
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
  continueContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

