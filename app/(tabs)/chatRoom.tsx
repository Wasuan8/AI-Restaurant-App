import { useCart } from '@/components/CartContext';
import PageHeader from '@/components/PageHeader';
import { formatMessageContent } from '@/constants/formatMessage';
import { callChatBotAPI, callVoiceChatBotAPI, getChatHistory, deleteChatHistory } from '@/services/chatBot';
import { MessageInterface } from '@/types/types';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { AudioModule, RecordingPresets, useAudioRecorder, useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert, Animated, Easing, FlatList,
  Image,
  KeyboardAvoidingView,
  Platform, Text, TouchableOpacity, View
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-root-toast';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// ─── Product Card ────────────────────────────────────────────────
const ProductCard = ({ item, onAdd }: { item: any, onAdd: (name: string, qty: number) => void }) => {
  const imageUrl = `${API_URL}/images/${item.image_path}`;
  const [qty, setQty] = useState(1);

  return (
    <View style={{
      width: '100%', backgroundColor: '#fff', borderRadius: 12,
      padding: 10, borderWidth: 1, borderColor: '#EEE',
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
      flexDirection: 'row', alignItems: 'center', gap: 10
    }}>
      <Image
        source={{ uri: imageUrl }}
        style={{ width: 55, height: 55, borderRadius: 8 }}
        resizeMode="cover"
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Sora-SemiBold', fontSize: 13, color: '#2A2A2A' }} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={{ fontFamily: 'Sora-Regular', fontSize: 12, color: '#C57C3E' }}>
          ${item.price.toFixed(2)}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F8F8F8', borderRadius: 8, paddingHorizontal: 4 }}>
        <TouchableOpacity onPress={() => setQty(Math.max(1, qty - 1))} style={{ padding: 4 }}>
          <Feather name="minus" size={14} color="#C57C3E" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Sora-SemiBold', fontSize: 13, color: '#2A2A2A', minWidth: 16, textAlign: 'center' }}>{qty}</Text>
        <TouchableOpacity onPress={() => setQty(qty + 1)} style={{ padding: 4 }}>
          <Feather name="plus" size={14} color="#C57C3E" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => onAdd(item.name, qty)}
        style={{
          backgroundColor: '#C57C3E', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'Sora-SemiBold' }}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Order Summary Card ───────────────────────────────────────────
const OrderSummaryCard = ({ order, onPlaceOrder }: { order: any[], onPlaceOrder: () => void }) => {
  const total = order.reduce((sum, it) => {
    const qty = it.quantity ?? it.quanitity ?? 1;
    const priceRaw = it.price;
    let price = 0;
    if (typeof priceRaw === 'number') {
      price = priceRaw;
    } else if (typeof priceRaw === 'string') {
      const match = priceRaw.replace(',', '').match(/[\d.]+/);
      price = match ? parseFloat(match[0]) : 0;
    }
    return sum + price;
  }, 0);

  return (
    <View style={{
      marginTop: 12,
      backgroundColor: '#FFF8F2',
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: '#EDD9C0',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#5C3317',
        paddingHorizontal: 14, paddingVertical: 10,
        flexDirection: 'row', alignItems: 'center', gap: 8,
      }}>
        <Ionicons name="receipt-outline" size={16} color="#FFD59E" />
        <Text style={{ fontFamily: 'Sora-SemiBold', fontSize: 13, color: '#FFD59E', letterSpacing: 0.5 }}>
          ORDER SUMMARY
        </Text>
      </View>

      {/* Items */}
      <View style={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 4, gap: 8 }}>
        {order.map((it: any, idx: number) => {
          const qty = it.quantity ?? it.quanitity ?? 1;
          let priceVal = 0;
          if (typeof it.price === 'number') priceVal = it.price;
          else if (typeof it.price === 'string') {
            const m = it.price.replace(',', '').match(/[\d.]+/);
            priceVal = m ? parseFloat(m[0]) : 0;
          }
          return (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{
                  width: 24, height: 24, borderRadius: 12,
                  backgroundColor: '#C57C3E22', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontFamily: 'Sora-SemiBold', fontSize: 11, color: '#C57C3E' }}>{qty}</Text>
                </View>
                <Text numberOfLines={1} style={{ fontFamily: 'Sora-Regular', fontSize: 13, color: '#2A2A2A', flex: 1 }}>
                  {it.item}
                </Text>
              </View>
              <Text style={{ fontFamily: 'Sora-SemiBold', fontSize: 13, color: '#5C3317', marginLeft: 8 }}>
                ${priceVal.toFixed(2)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Divider */}
      <View style={{ marginHorizontal: 14, marginVertical: 10, height: 1, backgroundColor: '#EDD9C0' }} />

      {/* Total */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, marginBottom: 12 }}>
        <Text style={{ fontFamily: 'Sora-SemiBold', fontSize: 14, color: '#5C3317' }}>Total</Text>
        <Text style={{ fontFamily: 'Sora-SemiBold', fontSize: 15, color: '#C57C3E' }}>${total.toFixed(2)}</Text>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity
        onPress={onPlaceOrder}
        activeOpacity={0.85}
        style={{
          marginHorizontal: 14, marginBottom: 14,
          backgroundColor: '#C57C3E',
          borderRadius: 12, paddingVertical: 11,
          alignItems: 'center', justifyContent: 'center',
          flexDirection: 'row', gap: 8,
          shadowColor: '#C57C3E', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
        }}
      >
        <Ionicons name="bag-check-outline" size={16} color="white" />
        <Text style={{ fontFamily: 'Sora-SemiBold', fontSize: 14, color: '#FFF' }}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Bot Bubble ───────────────────────────────────────────────────
const BotBubble = ({
  item,
  onAddProduct,
  onPlaceOrder,
}: {
  item: MessageInterface;
  onAddProduct: (name: string, qty: number) => void;
  onPlaceOrder: (order: any[]) => void;
}) => {
  const paragraphs = formatMessageContent(item.content);
  const menu = item.memory?.menu;
  const orderItems: any[] = item.memory?.order ?? [];
  const stepNumber = item.memory?.['step number'];
  // Show order card when there are items and the step looks final
  const isFinalOrder =
    orderItems.length > 0 &&
    (String(stepNumber) === '6' ||
      item.content?.toLowerCase().includes('total') ||
      item.content?.toLowerCase().includes('thank you for your order'));

  return (
    <View style={{ maxWidth: '88%', alignSelf: 'flex-start', marginBottom: 12, marginLeft: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 }}>
        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#C57C3E', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="cafe" size={14} color="white" />
        </View>
        <Text style={{ fontSize: 11, color: '#999', fontFamily: 'Sora-Regular' }}>Apna Cafe</Text>
      </View>
      <View style={{
        backgroundColor: '#FFFFFF', borderRadius: 18, borderTopLeftRadius: 4,
        paddingHorizontal: 14, paddingVertical: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, gap: 8,
      }}>
        {paragraphs.map((para, i) => (
          <Text key={i} style={{ fontSize: 14, color: '#2A2A2A', fontFamily: 'Sora-Regular', lineHeight: 22 }}>
            {para}
          </Text>
        ))}
      </View>

      {/* Order Summary Card — shown when AI finalises the order */}
      {isFinalOrder && (
        <OrderSummaryCard
          order={orderItems}
          onPlaceOrder={() => onPlaceOrder(orderItems)}
        />
      )}

      {/* Visual Menu — shown on welcome/recommendation messages */}
      {menu && menu.length > 0 && !isFinalOrder && (
        <View style={{ marginTop: 10, gap: 10 }}>
          {menu.map((product: any, idx: number) => (
            <ProductCard key={idx} item={product} onAdd={onAddProduct} />
          ))}
        </View>
      )}
    </View>
  );
};

// ─── Voice Bubble ──────────────────────────────────────────────────
const VoiceBubble = ({ uri, transcription }: { uri: string; transcription: string }) => {
  const player = useAudioPlayer(uri);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const subscription = player.addListener('playbackStatusUpdate', (status) => {
      setIsPlaying(status.playing);
      if (status.duration > 0) {
        setProgress(status.currentTime / status.duration);
        // Reset when finished
        if (status.currentTime >= status.duration) {
          player.pause();
          player.seekTo(0);
          setProgress(0);
        }
      }
    });
    return () => subscription.remove();
  }, [player]);

  const togglePlay = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View style={{ maxWidth: '85%', alignSelf: 'flex-end', marginBottom: 12, marginRight: 12 }}>
      <View style={{
        backgroundColor: '#C57C3E', borderRadius: 20, borderBottomRightRadius: 4,
        paddingHorizontal: 12, paddingVertical: 10,
        shadowColor: '#C57C3E', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
        width: 240,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {/* Play/Pause Button */}
          <TouchableOpacity
            onPress={togglePlay}
            style={{
              width: 38, height: 38, borderRadius: 19,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="white" style={!isPlaying ? { marginLeft: 2 } : {}} />
          </TouchableOpacity>

          {/* Progress Bar Container */}
          <View style={{ flex: 1, gap: 6 }}>
             {/* Waveform/Progress mock */}
             <View style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${progress * 100}%`, backgroundColor: '#FFF' }} />
             </View>
             
             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontFamily: 'Sora-Regular' }}>
                   {transcription ? (transcription.length > 25 ? transcription.substring(0, 25) + '...' : transcription) : 'Voice Message'}
                </Text>
                <Ionicons name="mic" size={12} color="rgba(255,255,255,0.6)" />
             </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// ─── User Bubble ──────────────────────────────────────────────────
const UserBubble = ({ message }: { message: MessageInterface }) => {
  if (message.audioUri) {
    return <VoiceBubble uri={message.audioUri} transcription={message.content} />;
  }
  return (
    <View style={{ maxWidth: '75%', alignSelf: 'flex-end', marginBottom: 12, marginRight: 12 }}>
      <View style={{
        backgroundColor: '#C57C3E', borderRadius: 18, borderBottomRightRadius: 4,
        paddingHorizontal: 14, paddingVertical: 10,
        shadowColor: '#C57C3E', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25, shadowRadius: 8, elevation: 3,
      }}>
        <Text style={{ fontSize: 14, color: '#fff', fontFamily: 'Sora-Regular', lineHeight: 21 }}>
          {message.content}
        </Text>
      </View>
    </View>
  );
};

// ─── Typing Indicator ─────────────────────────────────────────────
const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      );
    bounce(dot1, 0).start();
    bounce(dot2, 150).start();
    bounce(dot3, 300).start();
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12, marginBottom: 12, gap: 6 }}>
      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#C57C3E', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="cafe" size={14} color="white" />
      </View>
      <View style={{
        backgroundColor: '#fff', borderRadius: 18, borderTopLeftRadius: 4,
        paddingHorizontal: 14, paddingVertical: 12,
        flexDirection: 'row', gap: 5, alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
      }}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View
            key={i}
            style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#C57C3E', transform: [{ translateY: dot }] }}
          />
        ))}
      </View>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────
const ChatRoom = () => {
  const headerHeight = useHeaderHeight();
  const { addToCart, emptyCart } = useCart();
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const recorder = useAudioRecorder(RecordingPresets.LOW_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const recordingStartTime = useRef<number | null>(null);
  const voiceIndicatorAnim = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  // ── Pulse Animation for Voice ──
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(voiceIndicatorAnim, {
            toValue: 1.5,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(voiceIndicatorAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      voiceIndicatorAnim.setValue(1);
    }
  }, [isRecording]);

  // ── Send message ──
  const handleSendMessage = useCallback(async (customMessage?: any): Promise<void> => {
    // Ensure we only use string messages (prevent event objects from triggering errors)
    const textToSend = typeof customMessage === 'string' ? customMessage : inputText;
    const message = textToSend.trim();
    if (!message) return;

    try {
      const inputMessages = [...messages, { content: message, role: 'user' }];
      setMessages(inputMessages);
      setInputText('');
      inputRef.current?.clear();
      setIsTyping(true);

      const responseMessage = await callChatBotAPI(inputMessages);
      setIsTyping(false);
      setMessages(prev => [...prev, responseMessage]);
    } catch (err: any) {
      setIsTyping(false);
      Alert.alert('Error', err.message);
    }
  }, [messages, inputText]); // ✅ Added inputText dependency

  // ── Place Order (from Order Summary Card) ──
  const handlePlaceOrder = useCallback((order: any[]) => {
    Alert.alert(
      '🛒 Confirm Order',
      `Place this order with ${order.length} item${order.length > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Order',
          onPress: () => {
            emptyCart();
            order.forEach((it: any) => {
              const quantity = it.quantity ?? it.quanitity ?? 1;
              if (quantity > 0) addToCart(it.item, quantity);
            });
            router.push('/(tabs)/order' as any);
          },
        },
      ]
    );
  }, [emptyCart, addToCart]);

  // ── Voice Recording ──
  const startRecording = async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission denied', 'Microphone access is required for voice chat.');
        return;
      }

      await AudioModule.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      await recorder.record();
      recordingStartTime.current = Date.now();
      setIsRecording(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Could not start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    try {
      const duration = recordingStartTime.current ? Date.now() - recordingStartTime.current : 0;
      setIsRecording(false);
      await recorder.stop();
      
      // Prevent processing if recording was too short (under 1s)
      if (duration < 1000) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Toast.show('Hold to record voice message', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          backgroundColor: '#5C3317',
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
        return;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const uri = recorder.uri;

      if (uri) {
        // Small delay to ensure file is flushed to disk
        setTimeout(() => handleVoiceMessage(uri), 100);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    } finally {
      recordingStartTime.current = null;
    }
  };

  const handleVoiceMessage = async (uri: string) => {
    setIsTyping(true);
    try {
      const response = await callVoiceChatBotAPI(uri);

      if (response.error) {
        Alert.alert('Voice API Error', response.error);
        return;
      }

      // The transcription is returned from the backend
      const userText = response.transcription || "Voice Message";

      // Update messages with transcription AND audio URI
      setMessages(prev => [...prev, { content: userText, role: 'user', audioUri: uri }]);
      setMessages(prev => [...prev, response]);
    } catch (err: any) {
      if (err.response?.status === 401) {
        Alert.alert('Authentication Required', 'Please log in to use voice chat.');
      } else if (err.response?.status === 500) {
        Alert.alert('Server Error', 'The voice processing service is currently unavailable.');
      } else {
        Alert.alert('Error', 'Failed to process voice message');
      }
    } finally {
      setIsTyping(false);
    }
  };

  // ── Reset Chat ──
  const handleResetChat = useCallback(() => {
    Alert.alert(
      '🧹 New Chat',
      'Are you sure you want to clear this conversation and start fresh?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'New Chat',
          style: 'destructive',
          onPress: async () => {
            setIsTyping(true);
            try {
              await deleteChatHistory();
              setMessages([]);
              // Fetch a fresh welcome greeting
              const responseMessage = await callChatBotAPI([]);
              setMessages([responseMessage]);
            } catch (err) {
              console.error('Reset chat error:', err);
            } finally {
              setIsTyping(false);
            }
          },
        },
      ]
    );
  }, []);

  // ── Load history, then greet if no prior chat ──
  useEffect(() => {
    const initChat = async () => {
      setIsTyping(true);
      try {
        // 1. Try to restore previous conversation
        const history = await getChatHistory();
        if (history && history.length > 0) {
          setMessages(history);
          setIsTyping(false);
          return;
        }

        // 2. No history – fetch a welcome greeting
        const responseMessage = await callChatBotAPI([]);
        setIsTyping(false);
        setMessages([responseMessage]);
      } catch (err: any) {
        setIsTyping(false);
        console.error('Chat init error:', err);
      }
    };
    initChat();
  }, []);

  // ── Scroll to bottom ──
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, isTyping]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style='dark' />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#F5F3EF' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : headerHeight}
      >
        <PageHeader 
          title="Chat Bot" 
          showHeaderRight={true} 
          rightIcon="trash-alt"
          onPressRight={handleResetChat}
          bgColor='white' 
        />
        <View style={{ height: 1, backgroundColor: '#E8E4DE' }} />

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            item.role === 'user'
              ? <UserBubble message={item} />
              : <BotBubble
                item={item}
                onPlaceOrder={handlePlaceOrder}
                onAddProduct={(name, qty) => {
                  setInputText(prev => {
                    const baseText = "I would like to add";
                    const suffix = "to my cart";
                    const itemText = qty > 1 ? `${qty} ${name}` : name;

                    if (!prev.toLowerCase().includes(baseText.toLowerCase())) {
                      return `${baseText} ${itemText} ${suffix}`;
                    }

                    // If product already in list, do nothing
                    if (prev.includes(name)) return prev;

                    // Try to insert before "to my cart"
                    if (prev.toLowerCase().includes(suffix)) {
                      const regex = new RegExp(` ${suffix}`, 'i');
                      return prev.replace(regex, `, ${itemText} ${suffix}`);
                    }

                    return `${prev} and ${itemText}`;
                  });
                  inputRef.current?.focus();
                }}
              />
          }
          ListEmptyComponent={() => (
            <View style={{ flex: 1, alignItems: 'center', marginTop: hp(12), gap: 10 }}>
              <View style={{
                width: 64, height: 64, borderRadius: 32,
                backgroundColor: '#C57C3E', alignItems: 'center', justifyContent: 'center',
                shadowColor: '#C57C3E', shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3, shadowRadius: 14, elevation: 6,
              }}>
                <Ionicons name="cafe" size={30} color="white" />
              </View>
              <Text style={{ fontFamily: 'Sora-SemiBold', fontSize: 16, color: '#2A2A2A' }}>
                Apna Cafe Assistant
              </Text>
              <Text style={{ fontFamily: 'Sora-Regular', fontSize: 13, color: '#999', textAlign: 'center', paddingHorizontal: 40 }}>
                Ask me about our menu, specials, or place an order!
              </Text>
            </View>
          )}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {/* Input bar */}
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          marginHorizontal: 12, marginBottom: hp(3), marginTop: 8,
          backgroundColor: '#FFFFFF', borderRadius: 28,
          borderWidth: 1, borderColor: '#E8E4DE',
          paddingLeft: 16, paddingRight: 6, paddingVertical: 6,
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
        }}>

          <TextInput
            ref={inputRef}
            value={inputText}
            onChangeText={setInputText}
            placeholder='Ask about our menu...'
            placeholderTextColor='#BBBBBB'
            style={{ flex: 1, fontSize: hp(1.9), fontFamily: 'Sora-Regular', color: '#2A2A2A', paddingVertical: 6 }}
            multiline
          />

          {/* Voice button */}
          <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            {isRecording && (
              <Animated.View style={{
                position: 'absolute',
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: '#FF4B4B44',
                transform: [{ scale: voiceIndicatorAnim }]
              }} />
            )}
            <TouchableOpacity
              onPressIn={startRecording}
              onPressOut={stopRecording}
              activeOpacity={0.7}
              style={{
                backgroundColor: isRecording ? '#FF4B4B' : '#F0F0F0',
                width: 40, height: 40, borderRadius: 20,
                alignItems: 'center', justifyContent: 'center',
                marginRight: 8,
                borderWidth: isRecording ? 1 : 0,
                borderColor: '#FF0000',
              }}
            >
              <Ionicons name={isRecording ? "mic" : "mic-outline"} size={20} color={isRecording ? "white" : "#C57C3E"} />
            </TouchableOpacity>
          </View>

          {/* Send button */}
          <TouchableOpacity
            onPress={() => handleSendMessage()}
            disabled={isTyping || !inputText.trim()}
            style={{
              backgroundColor: isTyping || !inputText.trim() ? '#E0E0E0' : '#C57C3E',
              width: 40, height: 40, borderRadius: 20,
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#C57C3E', shadowOffset: { width: 0, height: 3 },
              shadowOpacity: isTyping || !inputText.trim() ? 0 : 0.35,
              shadowRadius: 6, elevation: 4,
            }}
          >
            {isTyping ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={18} color="white" style={{ marginLeft: 2 }} />
            )}
          </TouchableOpacity>
        </View>

        {/* Listening Overlay */}
        {isRecording && (
          <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.85)',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
          }}>
            <View style={{ alignItems: 'center', gap: 20 }}>
              <View style={{
                width: 100, height: 100, borderRadius: 50,
                backgroundColor: '#FF4B4B15', alignItems: 'center', justifyContent: 'center'
              }}>
                <Animated.View style={{
                  width: 80, height: 80, borderRadius: 40,
                  backgroundColor: '#FF4B4B25', alignItems: 'center', justifyContent: 'center',
                  transform: [{ scale: voiceIndicatorAnim }]
                }}>
                  <Ionicons name="mic" size={40} color="#FF4B4B" />
                </Animated.View>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Sora-SemiBold', fontSize: 20, color: '#FF4B4B' }}>Listening...</Text>
                <Text style={{ fontFamily: 'Sora-Regular', fontSize: 14, color: '#666', marginTop: 4 }}>Release to send</Text>
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ChatRoom;