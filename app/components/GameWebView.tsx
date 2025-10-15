import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface GameWebViewProps {
  html: string;
  onMessage?: (message: string) => void;
}

export const GameWebView: React.FC<GameWebViewProps> = ({ html, onMessage }) => {
  const webViewRef = useRef<WebView>(null);

  const handleMessage = (event: any) => {
    const message = event.nativeEvent.data;
    if (onMessage) {
      onMessage(message);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        originWhitelist={['*']}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
        onLoadStart={() => {
          console.log('WebView: Starting to load game...');
        }}
        onLoadEnd={() => {
          console.log('WebView: Game loaded successfully!');
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          console.error('HTML preview:', html?.substring(0, 200));
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('HTTP error:', nativeEvent);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

