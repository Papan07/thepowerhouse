import React, { useRef } from 'react';
import {
  StyleSheet,
  Platform,
  View,
  ActivityIndicator,
  StatusBar as RNStatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function App() {
  const webViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  // In Local Development:
  // - On Browser (Expo Web): http://localhost:3000
  // - On Physical Phone (Expo Go): Replace with your Mac's IP (e.g. http://192.168.1.5:3000)
  // In Production:
  // - https://your-production-domain.com
  const WEBSITE_URL = 'https://the-q-bowl-qjcg.vercel.app';

  // Standard Mobile Safari / Chrome User-Agent to prevent Google OAuth 403 (disallowed_useragent)
  const customUserAgent =
    Platform.OS === 'android'
      ? 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
      : 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';

  // Injected CSS to ensure web layout respects mobile top padding and doesn't get cut off
  const injectedCSS = `
    (function() {
      var meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        document.head.appendChild(meta);
      }
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    })();
    true;
  `;

  // 1. Web Browser Mode (Runs instantly in Safari/Chrome via Expo Web)
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          src={WEBSITE_URL}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="The Q Bowl"
          allow="geolocation; camera; payment; microphone"
        />
      </View>
    );
  }

  // 2. Mobile Device Mode (iOS / Android phone via Expo Go)
  // Calculate proper status bar top offset and navigation gesture bar bottom offset
  const topPadding = Platform.OS === 'android' ? (RNStatusBar.currentHeight || insets.top || 24) : insets.top;
  const bottomPadding = insets.bottom > 0 ? insets.bottom : (Platform.OS === 'android' ? 12 : 0);

  return (
    <View style={[styles.container, { paddingTop: topPadding, paddingBottom: bottomPadding }]}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEBSITE_URL }}
        userAgent={customUserAgent}
        injectedJavaScript={injectedCSS}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#E5A00D" />
          </View>
        )}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#f5e3cd' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5e3cd',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5e3cd',
  },
});
