import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useCartStore } from "../store/cartStore";
import { Ionicons } from "@expo/vector-icons";
import { useBistroTheme } from "../hooks/useBistroTheme";
import { BistroColors } from "../theme/bistroTheme";

function createStyles(c: BistroColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    header: {
      backgroundColor: c.surface,
      paddingHorizontal: 20,
      paddingVertical: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    headerTitle: { fontSize: 24, fontWeight: "700", color: c.text },
    clearBtn: { padding: 8 },
    clearBtnText: { color: c.accent, fontWeight: "600", fontSize: 14 },
    listContent: { padding: 16, paddingBottom: 20 },
    card: {
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    cardLeft: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: "600", color: c.text, marginBottom: 4 },
    itemPrice: { fontSize: 17, fontWeight: "700", color: c.accent },
    unitPrice: { fontSize: 12, color: c.textSecondary, marginTop: 2 },
    cardRight: { alignItems: "center", gap: 12 },
    qtyRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: c.qtyRow,
      borderRadius: 12,
      padding: 4,
      gap: 12,
    },
    qtyBtn: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: c.qtyBtn,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    qtyText: {
      fontSize: 16,
      fontWeight: "700",
      color: c.text,
      minWidth: 20,
      textAlign: "center",
    },
    removeBtn: { padding: 4 },
    summary: {
      backgroundColor: c.surface,
      padding: 20,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    summaryLabel: { fontSize: 14, color: c.textSecondary },
    summaryValue: { fontSize: 14, color: c.text, fontWeight: "500" },
    totalRow: {
      borderTopWidth: 1,
      borderTopColor: c.border,
      paddingTop: 12,
      marginTop: 4,
      marginBottom: 16,
    },
    totalLabel: { fontSize: 18, fontWeight: "700", color: c.text },
    totalValue: { fontSize: 18, fontWeight: "700", color: c.accent },
    orderBtn: {
      backgroundColor: c.accent,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
    },
    orderBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyEmoji: { fontSize: 64, marginBottom: 16 },
    emptyTitle: { fontSize: 22, fontWeight: "700", color: c.text, marginBottom: 8 },
    emptySubtitle: {
      fontSize: 14,
      color: c.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    successContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
      backgroundColor: c.surface,
    },
    successEmoji: { fontSize: 80, marginBottom: 20 },
    successTitle: { fontSize: 32, fontWeight: "700", color: c.text, marginBottom: 8 },
    successSubtitle: {
      fontSize: 16,
      color: c.textSecondary,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 24,
    },
    successBadge: {
      backgroundColor: c.accentSoft,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.accentBorder,
    },
    successBadgeText: { color: c.accent, fontWeight: "600", fontSize: 14 },
  });
}

export default function CartScreen() {
  const { colors } = useBistroTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalItems } =
    useCartStore();
  const [ordered, setOrdered] = useState(false);

  const handleClear = () => {
    Alert.alert("Clear Cart", "Remove all items from your cart?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clearCart },
    ]);
  };

  const handlePlaceOrder = () => {
    setOrdered(true);
    clearCart();
    setTimeout(() => setOrdered(false), 3000);
  };

  if (ordered) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.surface} />
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successSubtitle}>
            Your food is being prepared fresh for you
          </Text>
          <View style={styles.successBadge}>
            <Text style={styles.successBadgeText}>
              Estimated time: 25-30 mins
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.surface} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add items from the menu or ask the AI assistant!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.surface} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
          <Text style={styles.clearBtnText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.item_id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardLeft}>
              <Text style={styles.itemName}>{item.item_name}</Text>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
              <Text style={styles.unitPrice}>${item.price.toFixed(2)} each</Text>
            </View>
            <View style={styles.cardRight}>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.item_id, item.quantity - 1)}
                >
                  <Ionicons name="remove" size={16} color={colors.accent} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.item_id, item.quantity + 1)}
                >
                  <Ionicons name="add" size={16} color={colors.accent} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeItem(item.item_id)}
              >
                <Ionicons name="trash-outline" size={18} color={colors.accent} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items ({totalItems()})</Text>
          <Text style={styles.summaryValue}>${totalPrice().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (8%)</Text>
          <Text style={styles.summaryValue}>
            ${(totalPrice() * 0.08).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${(totalPrice() * 1.08).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity style={styles.orderBtn} onPress={handlePlaceOrder}>
          <Text style={styles.orderBtnText}>Place Order 🚀</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
