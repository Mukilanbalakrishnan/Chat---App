import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import io from "socket.io-client";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

const socket = io("https://chat-app-uxdn.onrender.com"); 

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [mySocketId, setMySocketId] = useState(null);
  const { username } = useLocalSearchParams();

  useEffect(() => {
    socket.on("connect", () => {
      setMySocketId(socket.id);
    });

    socket.on("receive_message", (data) => {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          ...data,
          isMe: data.senderId === socket.id,
        },
      ]);
    });

    return () => {
      socket.off("receive_message");
      socket.off("connect");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      message,
      username,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      senderId: socket.id,
    };

    socket.emit("send_message", newMessage);
    setMessage("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.header}>Chat Room</Text>

        <ScrollView style={styles.chatArea} contentContainerStyle={{ paddingBottom: 100 }}>
          {chatMessages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                msg.isMe ? styles.rightBubble : styles.leftBubble,
              ]}
            >
              {!msg.isMe && msg.username && (
                <Text style={styles.senderName}>{msg.username}</Text>
              )}
              <Text style={styles.messageText}>{msg.message}</Text>
              <Text style={styles.timestamp}>{msg.timestamp}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}



// styling...
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginVertical: 15,
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 12,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 20,
    marginVertical: 6,
  },
  leftBubble: {
    backgroundColor: "#474343",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },
  rightBubble: {
    backgroundColor: "#66BB6A",
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
  },
  timestamp: {
    fontSize: 11,
    color: "#f0f0f0",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  senderName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  inputContainer: {
    position: "absolute",
    bottom: 10,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#66BB6A",
    paddingHorizontal: 15,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#388E3C",
    borderRadius: 25,
    padding: 10,
    marginLeft: 10,
  },
});
