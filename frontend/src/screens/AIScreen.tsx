import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useCartStore } from "../store/cartStore";
import { Ionicons } from "@expo/vector-icons";
import { useBistroTheme } from "../hooks/useBistroTheme";
import { BistroColors } from "../theme/bistroTheme";

const API_URL = "http://localhost:3001";
interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "Add 2 spicy chicken sandwiches 🍔",
  "I want truffle fries and a lemonade 🍟",
  "Add chocolate lava cake 🍰",
  "Clear my cart 🗑️",
];

function createStyles(c: BistroColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    header: {
      backgroundColor: c.surface,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    headerTitle: { fontSize: 24, fontWeight: "700", color: c.text },
    headerSubtitle: { fontSize: 13, color: c.textSecondary, marginTop: 2 },
    messageList: { padding: 16, paddingBottom: 8 },
    bubble: {
      maxWidth: "80%",
      borderRadius: 16,
      padding: 12,
      marginBottom: 12,
    },
    userBubble: {
      backgroundColor: c.accent,
      alignSelf: "flex-end",
      borderBottomRightRadius: 4,
    },
    assistantBubble: {
      backgroundColor: c.card,
      alignSelf: "flex-start",
      borderBottomLeftRadius: 4,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    bubbleLabel: {
      fontSize: 11,
      color: c.textSecondary,
      marginBottom: 4,
      fontWeight: "500",
    },
    bubbleText: { fontSize: 14, lineHeight: 20 },
    userText: { color: "#fff" },
    assistantText: { color: c.text },
    typingContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 8,
      gap: 8,
    },
    typingText: { fontSize: 13, color: c.textSecondary },
    suggestionsContainer: { paddingHorizontal: 16, paddingBottom: 8 },
    suggestionsLabel: {
      fontSize: 12,
      color: c.textSecondary,
      marginBottom: 8,
      fontWeight: "500",
    },
    suggestionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    suggestionChip: {
      backgroundColor: c.card,
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: c.accentBorder,
    },
    suggestionText: { fontSize: 12, color: c.accent, fontWeight: "500" },
    inputBar: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: c.surface,
      borderTopWidth: 1,
      borderTopColor: c.border,
      gap: 10,
    },
    input: {
      flex: 1,
      backgroundColor: c.inputBg,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 14,
      color: c.text,
      maxHeight: 100,
      borderWidth: 1,
      borderColor: c.border,
    },
    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.accent,
      justifyContent: "center",
      alignItems: "center",
    },
    sendBtnDisabled: { backgroundColor: c.accentBorder },
  });
}

export default function AIScreen() {
  const { colors } = useBistroTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      text: '👋 Hi! I\'m your AI assistant. Tell me what you\'d like to order and I\'ll add it to your cart automatically!\n\nTry: "Add 2 spicy chicken sandwiches and a lemonade"',
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCartStore();

  const applyActions = (actions: any[]) => {
    actions.forEach((action) => {
      switch (action.type) {
        case "add":
          addItem({
            item_id: action.item_id,
            item_name: action.item_name,
            price: action.price,
            quantity: action.quantity,
          });
          Toast.show({
            type: "success",
            text1: "✓ Added by AI!",
            text2: `${action.item_name} x${action.quantity}`,
            visibilityTime: 2000,
            position: "bottom",
          });
          break;
        case "remove":
          if (action.item_id) {
            removeItem(action.item_id);
          } else if (action.item_name) {
            const cartItem = items.find(
              (i) => i.item_name.toLowerCase() === action.item_name.toLowerCase()
            );
            if (cartItem) removeItem(cartItem.item_id);
          }
          Toast.show({
            type: "error",
            text1: "🗑️ Removed from cart",
            text2: action.item_name,
            visibilityTime: 2000,
            position: "bottom",
          });
          break;
        case "update_qty":
          if (action.item_id) {
            updateQuantity(action.item_id, action.quantity);
          } else if (action.item_name) {
            const cartItem = items.find(
              (i) => i.item_name.toLowerCase() === action.item_name.toLowerCase()
            );
            if (cartItem) updateQuantity(cartItem.item_id, action.quantity);
          }
          Toast.show({
            type: "success",
            text1: "✓ Quantity updated!",
            text2: `${action.item_name} → x${action.quantity}`,
            visibilityTime: 2000,
            position: "bottom",
          });
          break;
        case "clear_cart":
          clearCart();
          Toast.show({
            type: "error",
            text1: "🗑️ Cart cleared",
            visibilityTime: 2000,
            position: "bottom",
          });
          break;
      }
    });
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: messageText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const cartContext = items.map((item) => ({
        item_id: item.item_id,
        item_name: item.item_name,
        quantity: item.quantity,
        price: item.price,
      }));

      const res = await axios.post(`${API_URL}/api/ai/order`, {
        message: messageText,
        cart: cartContext,
      });

      const { actions, reply } = res.data;
      applyActions(actions);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: reply,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "Sorry, I couldn't connect to the server. Make sure the backend is running!",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.bubble,
        item.role === "user" ? styles.userBubble : styles.assistantBubble,
      ]}
    >
      {item.role === "assistant" && (
        <Text style={styles.bubbleLabel}>🤖 AI Assistant</Text>
      )}
      <Text
        style={[
          styles.bubbleText,
          item.role === "user" ? styles.userText : styles.assistantText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.surface} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 AI Assistant</Text>
        <Text style={styles.headerSubtitle}>Order by chatting naturally</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {loading && (
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={styles.typingText}>AI is thinking...</Text>
          </View>
        )}

        {messages.length <= 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsLabel}>Try saying:</Text>
            <View style={styles.suggestionsRow}>
              {SUGGESTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestionChip}
                  onPress={() => sendMessage(s)}
                >
                  <Text style={styles.suggestionText} numberOfLines={1}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="e.g. Add 2 burgers and a coke..."
            placeholderTextColor={colors.placeholder}
            multiline
            maxLength={200}
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
