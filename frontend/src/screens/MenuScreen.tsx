import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import axios from "axios";
import { useCartStore } from "../store/cartStore";
import { Ionicons } from "@expo/vector-icons";
import Toast from 'react-native-toast-message';

// const API_URL = "http://localhost:3001";
const API_URL = "http://100.76.12.180:3001";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  tags: string[];
}

const CATEGORY_ICONS: Record<string, string> = {
  starters: "🥗",
  mains: "🍔",
  sides: "🍟",
  drinks: "🥤",
  desserts: "🍰",
};

const CATEGORY_COLORS: Record<string, string> = {
  starters: "#FF6B6B",
  mains: "#FF8E53",
  sides: "#FFA726",
  drinks: "#26C6DA",
  desserts: "#AB47BC",
};

export default function MenuScreen() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addItem, totalItems } = useCartStore();

  const categories = ["all", "starters", "mains", "sides", "drinks", "desserts"];

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/menu`);
      setMenu(res.data);
    } catch (err) {
      Alert.alert("Error", "Could not load menu. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const filteredMenu =
    selectedCategory === "all"
      ? menu
      : menu.filter((item) => item.category === selectedCategory);

  // const handleAddToCart = (item: MenuItem) => {
  //   addItem({
  //     item_id: item.id,
  //     item_name: item.name,
  //     price: item.price,
  //     quantity: 1,
  //   });
  //   Alert.alert("Added! ✓", `${item.name} added to cart`, [
  //     { text: "OK", style: "default" },
  //   ]);
  // };

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: 1,
    });
    Toast.show({
      type: 'success',
      text1: '✓ Added to cart!',
      text2: item.name,
      visibilityTime: 2000,
      position: 'bottom',
    });
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.categoryEmoji}>
          {CATEGORY_ICONS[item.category] || "🍽️"}
        </Text>
        <View style={styles.cardInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDesc} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.tagRow}>
              {item.tags.slice(0, 2).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.addBtn,
          { backgroundColor: CATEGORY_COLORS[item.category] || "#FF6B6B" },
        ]}
        onPress={() => handleAddToCart(item)}
      >
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.addBtnText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍽️ The Intelligent Bistro</Text>
        <Text style={styles.headerSubtitle}>Fresh • Delicious • Smart</Text>
      </View>

      {/* Category Filter */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryBtn,
              selectedCategory === item && styles.categoryBtnActive,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryBtnText,
                selectedCategory === item && styles.categoryBtnTextActive,
              ]}
            >
              {item === "all" ? "🍽️ All" : `${CATEGORY_ICONS[item]} ${item}`}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Menu List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Loading menu...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMenu}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  categoryList: { paddingHorizontal: 16, paddingVertical: 12, maxHeight: 56 },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    marginRight: 8,
  },
  categoryBtnActive: { backgroundColor: "#FF6B6B" },
  categoryBtnText: { fontSize: 13, color: "#666", fontWeight: "500", textTransform: "capitalize" },
  categoryBtnTextActive: { color: "#fff" },
  listContent: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", marginBottom: 12 },
  categoryEmoji: { fontSize: 40, marginRight: 12 },
  cardInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "600", color: "#1A1A1A", marginBottom: 4 },
  itemDesc: { fontSize: 13, color: "#888", lineHeight: 18, marginBottom: 8 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  itemPrice: { fontSize: 18, fontWeight: "700", color: "#FF6B6B" },
  tagRow: { flexDirection: "row", gap: 4 },
  tag: { backgroundColor: "#F0F0F0", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  tagText: { fontSize: 11, color: "#666" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#888", fontSize: 14 },
});
