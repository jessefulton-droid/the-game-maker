import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  agentType?: 'story-analyst' | 'game-designer' | 'code-generator';
  timestamp?: Date;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, agentType, timestamp }) => {
  const getAgentName = () => {
    switch (agentType) {
      case 'story-analyst':
        return '📚 Story Expert';
      case 'game-designer':
        return '🎮 Game Designer';
      case 'code-generator':
        return '⚙️ Code Builder';
      default:
        return 'Assistant';
    }
  };

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.agentContainer]}>
      {!isUser && agentType && (
        <Text style={styles.agentLabel}>{getAgentName()}</Text>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.agentBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.agentText]}>
          {message}
        </Text>
      </View>
      {timestamp && (
        <Text style={styles.timestamp}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  agentContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 4,
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  agentBubble: {
    backgroundColor: '#E8E8E8',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  agentText: {
    color: '#000',
  },
  agentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    marginLeft: 4,
  },
});

