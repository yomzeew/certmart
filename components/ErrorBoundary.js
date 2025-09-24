import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <View className="flex-1 bg-white items-center justify-center px-6">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
              <FontAwesome5 name="exclamation-triangle" size={32} color="#ef4444" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
              Oops! Something went wrong
            </Text>
            <Text className="text-gray-600 text-center mb-4">
              We encountered an unexpected error. Please try again.
            </Text>
          </View>

          <View className="w-full max-w-sm">
            <TouchableOpacity
              onPress={this.handleRetry}
              className="bg-red-500 rounded-xl px-6 py-3 w-full items-center mb-3"
            >
              <Text className="text-white font-semibold text-base">Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // You can add navigation logic here
                console.log('Navigate to home or support');
              }}
              className="bg-gray-100 rounded-xl px-6 py-3 w-full items-center"
            >
              <Text className="text-gray-700 font-medium text-base">Go to Home</Text>
            </TouchableOpacity>
          </View>

          {/* Development error details - only show in development */}
          {__DEV__ && this.state.error && (
            <View className="mt-8 p-4 bg-gray-100 rounded-lg w-full">
              <Text className="text-sm font-bold text-gray-800 mb-2">Error Details (Dev Mode):</Text>
              <ScrollView className="max-h-32">
                <Text className="text-xs text-gray-600 font-mono">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text className="text-xs text-gray-600 font-mono mt-2">
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
