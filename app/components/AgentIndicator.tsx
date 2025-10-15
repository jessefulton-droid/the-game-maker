import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface AgentIndicatorProps {
  agentType: 'story-analyst' | 'game-designer' | 'code-generator';
  message?: string;
}

export const AgentIndicator: React.FC<AgentIndicatorProps> = ({ agentType, message }) => {
  const getAgentInfo = () => {
    switch (agentType) {
      case 'story-analyst':
        return { icon: '📚', name: 'Story Expert', color: '#FF6B6B' };
      case 'game-designer':
        return { icon: '🎮', name: 'Game Designer', color: '#4ECDC4' };
      case 'code-generator':
        return { icon: '⚙️', name: 'Code Builder', color: '#95E1D3' };
    }
  };

  const agentInfo = getAgentInfo();

  return (
    <View style={[styles.container, { backgroundColor: agentInfo.color }]}>
      <View style={styles.content}>
        <Text style={styles.icon}>{agentInfo.icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{agentInfo.name}</Text>
          <Text style={styles.message}>
            {message || 'is thinking...'}
          </Text>
        </View>
        <ActivityIndicator color="#fff" size="small" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
});

