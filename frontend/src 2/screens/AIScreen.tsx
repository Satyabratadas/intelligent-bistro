import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useCartStore } from "../store/cartStore";
import { Ionicons } from "@expo/vector-icons";
 
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
 
export default function AIScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      text: "👋 Hi! I'm your AI assistant. Tell me what you'd like to order and I'll add it to your cart automatically!\n\nTry: \"Add 2 spicy chicken sandwiches and a lemonade\"",
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
          break;
        case "remove":
          removeItem(action.item_id);
          break;
        case "update_qty":
          updateQuantity(action.item_id, action.quantity);
          break;
        case "clear_cart":
          clearCart();
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
    } catch (err) {
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🤖 AI Assistant</Text>
        <Text style={styles.headerSubtitle}>Order by chatting naturally</Text>
      </View>
 
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        {/* Messages */}
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
 
        {/* Typing indicator */}
        {loading && (
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color="#FF6B6B" />
            <Text style={styles.typingText}>AI is thinking...</Text>
          </View>
        )}
 
        {/* Suggestions */}
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
 
        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="e.g. Add 2 burgers and a coke..."
            placeholderTextColor="#aaa"
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
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#1A1A1A" },
  headerSubtitle: { fontSize: 13, color: "#888", marginTop: 2 },
  messageList: { padding: 16, paddingBottom: 8 },
  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: "#FF6B6B",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bubbleLabel: { fontSize: 11, color: "#aaa", marginBottom: 4, fontWeight: "500" },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  userText: { color: "#fff" },
  assistantText: { color: "#1A1A1A" },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 8,
  },
  typingText: { fontSize: 13, color: "#888" },
  suggestionsContainer: { paddingHorizontal: 16, paddingBottom: 8 },
  suggestionsLabel: { fontSize: 12, color: "#aaa", marginBottom: 8, fontWeight: "500" },
  suggestionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestionChip: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#FFE0E0",
  },
  suggestionText: { fontSize: 12, color: "#FF6B6B", fontWeight: "500" },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1A1A1A",
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: { backgroundColor: "#FFB3B3" },
});