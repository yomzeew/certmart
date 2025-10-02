import React, { useRef, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

// ✅ Single Course Card
const CourseItem = ({ course }) => {
  const navigation = useNavigation();
  const bannerUri = course?.icon
    ? `https://certmart.org/icon/${course.icon}.jpeg`
    : null;

  const handlenavigate = (course) => {
    navigation.navigate("coursesdetail", { course });
  };

  return (
    <TouchableOpacity
      onPress={() => handlenavigate(course)}
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        padding: 12,
        elevation: 3,
      }}
    >
      {bannerUri && (
        <Image
          source={{ uri: bannerUri }}
          style={{
            width: "100%",
            height: 140,
            borderRadius: 12,
            marginBottom: 8,
          }}
          resizeMode="cover"
        />
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold", fontSize: 14, flex: 1 }}>
          {course.course}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ✅ Stack of Swipeable Cards
const PopularCoursesCardStack = ({ data, onSwipe = () => {} }) => {
  const [cards, setCards] = useState(data);
  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    setCards(data);
    position.setValue({ x: 0, y: 0 });
  }, [data]);

  const removeTopCard = (direction) => {
    const updated = [...cards];
    const removed = updated.shift();
    setCards(updated);
    position.setValue({ x: 0, y: 0 });
    onSwipe(direction, removed);
  };

  const forceSwipe = (direction) => {
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => removeTopCard(direction));
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe("right");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe("left");
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ["-10deg", "0deg", "10deg"],
  });

  const renderCards = () => {
    if (!cards || cards.length === 0) {
      return (
        <View style={styles.empty}>
          <Text>No courses</Text>
        </View>
      );
    }

    return cards
      .map((course, i) => {
        const isTop = i === 0;
        const offset = i * 8;
        const scale = 1 - i * 0.05;

        if (isTop) {
          return (
            <Animated.View
              key={course.id || i}
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: position.x },
                    { translateY: position.y },
                    { rotate },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <CourseItem course={course} />
            </Animated.View>
          );
        }

        return (
          <Animated.View
            key={course.id || i}
            style={[
              styles.card,
              {
                top: offset,
                transform: [{ scale }],
              },
            ]}
          >
            <CourseItem course={course} />
          </Animated.View>
        );
      })
      .reverse();
  };

  return <View style={styles.container}>{renderCards()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 280,
  },
  card: {
    position: "absolute",
    width: "90%",
    alignSelf: "center",
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
});

export default PopularCoursesCardStack;
