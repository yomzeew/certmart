import { View, Text } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";

const BannerDisplay = () => {
  return (
    <View style={{ marginVertical: 12, borderRadius: 16, overflow: "hidden" }}>
      {/* Background Gradient */}
      <Svg height="140" width="100%">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#ff416c" stopOpacity="1" />  
            <Stop offset="1" stopColor="#ff4b2b" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="140" fill="url(#grad)" />
      </Svg>

      {/* Content Layer (absolute on top of SVG) */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 20,
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          🎓 Join CertMart, Africa's biggest learning platform
        </Text>
        <Text style={{ color: "white", fontSize: 12, marginTop: 8 }}>
          ✅ Get certified for <Text style={{ fontWeight: "bold" }}>FREE</Text> on CertMart!
        </Text>
        <Text style={{ color: "white", fontSize: 12, marginTop: 8 }}>
          🎁 We're giving out <Text style={{ fontWeight: "bold" }}>500 exam vouchers</Text> 
          to 500 lucky learners to earn the prestigious CertMart Certification.
        </Text>
      </View>
    </View>
  );
};

export default BannerDisplay;
