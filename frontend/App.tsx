import 'react-native-gesture-handler';
import React, { useMemo } from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import Toast from "react-native-toast-message";
import MenuScreen from "./src/screens/MenuScreen";
import CartScreen from "./src/screens/CartScreen";
import AIScreen from "./src/screens/AIScreen";
import { useCartStore } from "./src/store/cartStore";
import { getBistroColors } from "./src/theme/bistroTheme";

const Tab = createBottomTabNavigator();

function CartTabIcon({ color, size }: { color: string; size: number }) {
  const totalItems = useCartStore((state) => state.totalItems());
  return (
    <View>
      <Ionicons name="cart-outline" size={size} color={color} />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {totalItems > 9 ? "9+" : totalItems}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const colors = getBistroColors(scheme);
  const isDark = scheme === "dark";

  const navTheme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        background: colors.background,
        card: colors.tabBar,
        border: colors.border,
        text: colors.text,
        primary: colors.accent,
      },
    }),
    [isDark, colors]
  );

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.tabInactive,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      >
        <Tab.Screen
          name="Menu"
          component={MenuScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="restaurant-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <CartTabIcon color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="AI Order"
          component={AIScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "#FF6B6B",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
