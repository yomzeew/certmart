// globalTextOverride.js
import React from "react";
import { Text as RNText } from "react-native";

const defaultRender = RNText.render;

RNText.render = function (...args) {
  const origin = defaultRender.apply(this, args);

  // If the element has no props or style, just return it
  if (!origin?.props?.style) return origin;

  // Common icon font families used in React Native vector icons
  const iconFonts = [
    "Material",
    "FontAwesome",
    "Ionicons",
    "Feather",
    "Entypo",
    "AntDesign",
    "SimpleLineIcons",
    "EvilIcons",
    "Octicons",
    "Foundation",
    "MaterialCommunityIcons",
  ];

  // Check if this Text node belongs to an icon component
  const isIconFont = origin.props.style.some?.(
    (style) =>
      typeof style?.fontFamily === "string" &&
      iconFonts.some((font) => style.fontFamily.includes(font))
  );

  if (isIconFont) return origin;

  // Otherwise, apply the global font
  return React.cloneElement(origin, {
    style: [{ fontFamily: "Rimouski" }, origin.props.style],
  });
};
