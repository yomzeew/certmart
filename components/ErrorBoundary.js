import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { navigate } from "./NavigationService";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  handleGoHome = () => {
    navigate("onboarding"); // or "dashboard"
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Oops! Something went wrong
          </Text>

          <TouchableOpacity
            onPress={this.handleRetry}
            style={{
              backgroundColor: "red",
              borderRadius: 10,
              padding: 12,
              marginBottom: 10,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handleGoHome}
            style={{
              backgroundColor: "blue",
              borderRadius: 10,
              padding: 12,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Go Home</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
