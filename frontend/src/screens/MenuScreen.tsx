import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import axios from "axios";
import { useCartStore } from "../store/cartStore";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useBistroTheme } from "../hooks/useBistroTheme";
import { BistroColors } from "../theme/bistroTheme";

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
    categoryBar: {
      backgroundColor: c.surface,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    categoryScrollContent: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 8,
    },
    categoryBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: c.chip,
      gap: 6,
      ...(Platform.OS === "android" ? { overflow: "hidden" as const } : {}),
    },
    categoryBtnActive: { backgroundColor: c.accent },
    categoryIcon: {
      fontSize: 16,
      lineHeight: 22,
      ...(Platform.OS === "android" ? { includeFontPadding: false } : {}),
    },
    categoryLabel: {
      fontSize: 13,
      lineHeight: 22,
      color: c.chipText,
      fontWeight: "600",
      textTransform: "capitalize",
      ...(Platform.OS === "android" ? { includeFontPadding: false } : {}),
    },
    categoryLabelActive: { color: "#fff" },
    listContent: { padding: 16, paddingBottom: 100 },
    card: {
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    cardHeader: { flexDirection: "row", marginBottom: 12 },
    categoryEmoji: { fontSize: 40, marginRight: 12 },
    cardInfo: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: "600", color: c.text, marginBottom: 4 },
    itemDesc: { fontSize: 13, color: c.textSecondary, lineHeight: 18, marginBottom: 8 },
    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemPrice: { fontSize: 18, fontWeight: "700", color: c.accent },
    tagRow: { flexDirection: "row", gap: 4 },
    tag: {
      backgroundColor: c.chip,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
    },
    tagText: { fontSize: 11, color: c.chipText },
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
    loadingText: { marginTop: 12, color: c.textSecondary, fontSize: 14 },
  });
}

export default function MenuScreen() {
  const { colors } = useBistroTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addItem } = useCartStore();

  const categories = ["all", "starters", "mains", "sides", "drinks", "desserts"];

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/menu`);
      setMenu(res.data);
    } catch {
      Alert.alert("Error", "Could not load menu. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const filteredMenu =
    selectedCategory === "all"
      ? menu
      : menu.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: 1,
    });
    Toast.show({
      type: "success",
      text1: "✓ Added to cart!",
      text2: item.name,
      visibilityTime: 2000,
      position: "bottom",
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
          { backgroundColor: CATEGORY_COLORS[item.category] || colors.accent },
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
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.surface} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍽️ The Intelligent Bistro</Text>
        <Text style={styles.headerSubtitle}>Fresh • Delicious • Smart</Text>
      </View>

      <View style={styles.categoryBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map((item) => {
            const isActive = selectedCategory === item;
            const label = item === "all" ? "All" : item;
            const icon = item === "all" ? "🍽️" : CATEGORY_ICONS[item];
            return (
              <TouchableOpacity
                key={item}
                activeOpacity={0.75}
                style={[styles.categoryBtn, isActive && styles.categoryBtnActive]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={styles.categoryIcon}>{icon}</Text>
                <Text
                  style={[
                    styles.categoryLabel,
                    isActive && styles.categoryLabelActive,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
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
