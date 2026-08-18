// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, Alert, FlatList, Platform, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       // Mock fetching orders
//       setTimeout(() => {
//         setOrders([
//           { id: "ORD-1001", customer: "Test User", items: "1x Latte, 1x Croissant", total: "$8.50", status: "Preparing", created_at: "2026-04-05T09:30:00Z" },
//           { id: "ORD-1002", customer: "Coffee Fan", items: "2x Espresso", total: "$6.00", status: "Ready", created_at: "2026-04-05T10:00:00Z" }
//         ]);
//         setLoading(false);
//       }, 500);
//     } catch (error) {
//       console.log("Error fetching orders", error);
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item }: { item: any }) => (
//     <View style={{
//       backgroundColor: "#FAFAFA",
//       padding: 16,
//       borderRadius: 12,
//       marginBottom: 12,
//       borderWidth: 1,
//       borderColor: "#EDD9C0"
//     }}>
//       <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
//         <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 16, color: "#1A1A1A" }}>
//           {item.id}
//         </Text>
//         <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 14, color: item.status === "Ready" ? "#4CAF50" : "#C57C3E" }}>
//           {item.status}
//         </Text>
//       </View>
//       <Text style={{ fontFamily: "Sora-Regular", fontSize: 14, color: "#5C3317", marginBottom: 8 }}>
//         {item.customer}
//       </Text>
//       <Text style={{ fontFamily: "Sora-Regular", fontSize: 13, color: "#555", marginBottom: 8 }}>
//         {item.items}
//       </Text>
//       <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
//         <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 14, color: "#1A1A1A" }}>
//           {item.total}
//         </Text>
//         {item.created_at && (
//           <Text style={{ fontFamily: "Sora-Regular", fontSize: 12, color: "#AAAAAA" }}>
//             {new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//           </Text>
//         )}
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
//       <View style={{ paddingHorizontal: 28, paddingTop: 20, paddingBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>

//         <TouchableOpacity onPress={() => router.replace("/(tabs)/home" as any)} style={{ padding: 8, marginLeft: -8 }}>
//            <Ionicons name="home-outline" size={24} color="#1A1A1A" />
//         </TouchableOpacity>

//         <Text style={{ fontSize: 20, fontFamily: "Sora-SemiBold", color: "#1A1A1A" }}>
//           Admin Dashboard
//         </Text>

//         <TouchableOpacity onPress={() => router.replace("/login" as any)} style={{ padding: 8, marginRight: -8 }}>
//            <Ionicons name="log-out-outline" size={24} color="#1A1A1A" />
//         </TouchableOpacity>
//       </View>

//       <View style={{ flex: 1, paddingHorizontal: 28 }}>
//         <Text style={{ fontFamily: "Sora-Regular", fontSize: 14, color: "#AAAAAA", marginBottom: 20 }}>
//           Manage your orders and view platform activity.
//         </Text>

//         {loading ? (
//           <ActivityIndicator size="large" color="#5C3317" style={{ marginTop: 40 }} />
//         ) : (
//           <FlatList
//             data={orders}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderItem}
//             contentContainerStyle={{ paddingBottom: 40 }}
//             showsVerticalScrollIndicator={false}
//           />
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, Alert, FlatList, Modal,
  Platform, ScrollView, Text, TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearAuthToken, getAuthToken } from "../services/tokenStore"; // ✅ proper top-level import

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000");

const apiFetch = async (path: string, token: string, options: RequestInit = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "chats">("orders");
  const [data, setData] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<{ email: string; turns: any[] } | null>(null);
  const [chatDetailLoading, setChatDetailLoading] = useState(false);

  const switchTab = (tab: "orders" | "chats") => {
    if (tab !== activeTab) {
      setData([]);
      setActiveTab(tab);
    }
  };
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        Alert.alert("Session expired", "Please log in again.");
        router.replace("/login" as any);
        return;
      }

      const endpoint = activeTab === "orders" ? "/admin/orders" : "/admin/chats";
      const { ok, data: responseData, status } = await apiFetch(endpoint, token);

      if (ok) {
        if (activeTab === "orders") {
          setData(responseData);
          console.log(responseData)
        } else {
          // Map chat history sessions
          const sessions = Object.entries(responseData as Record<string, any[]>).map(
            ([email, turns]) => ({
              id: email,
              email,
              lastMessage: turns[turns.length - 1]?.user_message || "—",
              timestamp: turns[turns.length - 1]?.timestamp || new Date().toISOString(),
              turnCount: turns.length,
            })
          );
          setData(sessions);
        }
      } else if (status === 401 || status === 403) {
        Alert.alert("Access denied", "Admin privileges required.");
        router.replace("/(tabs)/home" as any);
      } else {
        Alert.alert("Error", `Could not load ${activeTab}.`);
      }
    } catch (error) {
      console.error("fetchData error:", error);
      Alert.alert("Network error", "Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    // Don't allow advancing past "delivered"
    if (currentStatus === "delivered") return;

    const statuses = ["pending", "preparing", "ready", "delivered"];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[currentIndex + 1];

    Alert.alert(
      "Update Status",
      `Change status from "${currentStatus}" to "${nextStatus}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: async () => {
            setActionLoading(orderId);
            try {
              const token = getAuthToken();
              if (!token) return;

              const { ok } = await apiFetch(`/admin/orders/${orderId}`, token, {
                method: "PATCH",
                body: JSON.stringify({ status: nextStatus }),
              });

              if (ok) {
                if (nextStatus === "delivered") {
                  // Auto-remove from list once delivered (payment received)
                  setData((prev) => prev.filter((o) => o.order_id !== orderId));
                  Alert.alert("✅ Order Delivered", "Order marked as delivered and removed from the list.");
                } else {
                  setData((prev) =>
                    prev.map((o) =>
                      o.order_id === orderId ? { ...o, status: nextStatus } : o
                    )
                  );
                }
              } else {
                Alert.alert("Error", "Could not update status.");
              }
            } catch {
              Alert.alert("Error", "Network error.");
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleDeleteItem = (id: string, email: string) => {
    const type = activeTab === "orders" ? "order" : "chat history";
    Alert.alert(
      `Delete ${type}`,
      `Are you sure you want to remove this ${type} for ${email}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setActionLoading(id);
            try {
              const token = getAuthToken();
              if (!token) return;

              const endpoint = activeTab === "orders"
                ? `/admin/orders/${id}`
                : `/admin/chats/${email}`;

              const { ok } = await apiFetch(endpoint, token, { method: "DELETE" });

              if (ok) {
                setData((prev) => prev.filter((item) =>
                  activeTab === "orders" ? item.order_id !== id : item.id !== id
                ));
              } else {
                Alert.alert("Error", `Could not delete ${type}.`);
              }
            } catch {
              Alert.alert("Error", "Network error.");
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          clearAuthToken();
          router.replace("/login" as any);
        },
      },
    ]);
  };

  const renderOrder = ({ item }: { item: any }) => {
    const isUpdating = actionLoading === item.order_id;
    const statusColors: any = {
      pending: { bg: "#FAEEDA", text: "#854F0B" },
      preparing: { bg: "#E3F2FD", text: "#1976D2" },
      ready: { bg: "#EAF3DE", text: "#3B6D11" },
      delivered: { bg: "#EEEEEE", text: "#666666" },
    };
    const colors = statusColors[item.status] || statusColors.pending;

    return (
      <View style={{
        backgroundColor: "#FAFAFA", padding: 16, borderRadius: 12, marginBottom: 12,
        borderWidth: 1, borderColor: "#EDD9C0", opacity: isUpdating ? 0.5 : 1,
      }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
          <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 15, color: "#1A1A1A" }}>
            #{item.order_id}
          </Text>
          <View style={{ backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 }}>
            <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 11, color: colors.text, textTransform: "uppercase" }}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={{ fontFamily: "Sora-Regular", fontSize: 13, color: "#5C3317", marginBottom: 8 }}>
          {item.user_email}
        </Text>

        <View style={{ marginBottom: 10 }}>
          {item.items?.map((it: any, idx: number) => (
            <Text key={idx} style={{ fontFamily: "Sora-Regular", fontSize: 13, color: "#555" }}>
              • {it.quantity}x {it.item} (${it.price})
            </Text>
          ))}
        </View>

        <View style={{ borderTopWidth: 0.5, borderColor: "#EDD9C0", marginVertical: 10 }} />

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 14, color: "#1A1A1A" }}>
            Total: ${item.total?.toFixed(2) || "0.00"}
          </Text>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => handleUpdateStatus(item.order_id, item.status)}
              disabled={isUpdating}
              style={{ backgroundColor: "#EAF3DE", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}
            >
              <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 12, color: "#3B6D11" }}>Status</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteItem(item.order_id, item.user_email)}
              disabled={isUpdating}
              style={{ backgroundColor: "#FCEBEB", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}
            >
              <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 12, color: "#A32D2D" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const handleViewChat = async (email: string) => {
    setChatDetailLoading(true);
    setSelectedChat({ email, turns: [] });
    try {
      const token = getAuthToken();
      if (!token) return;
      const { ok, data: turns } = await apiFetch(`/admin/chats/${encodeURIComponent(email)}`, token);
      if (ok && Array.isArray(turns)) {
        setSelectedChat({ email, turns });
      } else {
        Alert.alert("Error", "Could not load chat history.");
        setSelectedChat(null);
      }
    } catch {
      Alert.alert("Error", "Network error.");
      setSelectedChat(null);
    } finally {
      setChatDetailLoading(false);
    }
  };

  const renderChat = ({ item }: { item: any }) => {
    const isDeleting = actionLoading === item.id;
    return (
      <View style={{
        backgroundColor: "#FAFAFA", padding: 16, borderRadius: 12, marginBottom: 12,
        borderWidth: 1, borderColor: "#EDD9C0", opacity: isDeleting ? 0.5 : 1,
      }}>
        <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 14, color: "#1A1A1A", marginBottom: 4 }}>
          {item.email}
        </Text>
        <Text numberOfLines={2} style={{ fontFamily: "Sora-Regular", fontSize: 13, color: "#555", marginBottom: 10 }}>
          Last: {item.lastMessage}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontFamily: "Sora-Regular", fontSize: 12, color: "#AAA" }}>
            {item.turnCount} turns • {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => handleViewChat(item.email)}
              style={{ backgroundColor: "#E8F0FE", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
            >
              <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 12, color: "#1A56DB" }}>View Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteItem(item.id, item.email)}
              disabled={isDeleting}
              style={{ backgroundColor: "#FCEBEB", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
            >
              <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 12, color: "#A32D2D" }}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderChatMessage = (turn: any, idx: number) => {
    const isUser = turn.role === "user";
    const content = typeof turn.content === "object" ? turn.content?.content || JSON.stringify(turn.content) : turn.content;
    const time = turn.timestamp ? new Date(turn.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

    return (
      <View key={idx} style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        maxWidth: "80%",
        marginBottom: 10,
      }}>
        <View style={{
          backgroundColor: isUser ? "#5C3317" : "#F3EDE6",
          borderRadius: 14,
          borderBottomRightRadius: isUser ? 2 : 14,
          borderBottomLeftRadius: isUser ? 14 : 2,
          padding: 12,
        }}>
          <Text style={{
            fontFamily: "Sora-Regular",
            fontSize: 13,
            color: isUser ? "#FFF" : "#1A1A1A",
            lineHeight: 20,
          }}>
            {content}
          </Text>
        </View>
        <Text style={{
          fontFamily: "Sora-Regular",
          fontSize: 10,
          color: "#AAA",
          marginTop: 3,
          alignSelf: isUser ? "flex-end" : "flex-start",
        }}>
          {isUser ? "Customer" : "AI"} • {time}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Chat Detail Modal */}
      <Modal
        visible={!!selectedChat}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedChat(null)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          {/* Modal Header */}
          <View style={{
            flexDirection: "row", alignItems: "center", paddingHorizontal: 20,
            paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: "#EDD9C0",
          }}>
            <TouchableOpacity onPress={() => setSelectedChat(null)} style={{ marginRight: 12 }}>
              <Ionicons name="close" size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 15, color: "#1A1A1A" }}>
                Chat History
              </Text>
              <Text numberOfLines={1} style={{ fontFamily: "Sora-Regular", fontSize: 12, color: "#888" }}>
                {selectedChat?.email}
              </Text>
            </View>
            <View style={{ backgroundColor: "#5C3317", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 11, color: "#FFF" }}>
                {selectedChat?.turns.length ?? 0} msgs
              </Text>
            </View>
          </View>

          {/* Chat Messages */}
          {chatDetailLoading ? (
            <ActivityIndicator size="large" color="#5C3317" style={{ marginTop: 60 }} />
          ) : (
            <ScrollView
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {selectedChat?.turns.length === 0 ? (
                <Text style={{ fontFamily: "Sora-Regular", color: "#AAA", textAlign: "center", marginTop: 40 }}>
                  No messages found.
                </Text>
              ) : (
                selectedChat?.turns.map((turn, idx) => renderChatMessage(turn, idx))
              )}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      {/* Header */}
      <View style={{
        paddingHorizontal: 28, paddingTop: 20, paddingBottom: 10,
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      }}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/home" as any)}>
          <Ionicons name="home-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontFamily: "Sora-SemiBold", color: "#1A1A1A" }}>
          Admin Panel
        </Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: "row", paddingHorizontal: 28, marginBottom: 16, gap: 12 }}>
        <TouchableOpacity
          onPress={() => switchTab("orders")}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center",
            backgroundColor: activeTab === "orders" ? "#5C3317" : "#F5F5F5",
          }}
        >
          <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 14, color: activeTab === "orders" ? "#FFF" : "#666" }}>
            Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => switchTab("chats")}
          style={{
            flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center",
            backgroundColor: activeTab === "chats" ? "#5C3317" : "#F5F5F5",
          }}
        >
          <Text style={{ fontFamily: "Sora-SemiBold", fontSize: 14, color: activeTab === "chats" ? "#FFF" : "#666" }}>
            Chat History
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 28 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#5C3317" style={{ marginTop: 40 }} />
        ) : data.length === 0 ? (
          <Text style={{ fontFamily: "Sora-Regular", color: "#AAAAAA", textAlign: "center", marginTop: 60 }}>
            No {activeTab} found
          </Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => activeTab === "orders" ? item.order_id : item.id}
            renderItem={activeTab === "orders" ? renderOrder : renderChat}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            onRefresh={fetchData}
            refreshing={loading}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

