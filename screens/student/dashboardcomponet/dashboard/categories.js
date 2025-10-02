import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colorred } from "../../../../constant/color";
import { fetchCategories } from "../../../../utils/api"; // Import the fetchCategories function

const itemConfig = {
  ACAD: { icon: <Ionicons name="school" size={40} />, label: "Academy" },
  TECH: { icon: <FontAwesome5 name="cogs" size={40} />, label: "Tech" },
  VOC: { icon: <MaterialIcons name="engineering" size={40} />, label: "Vocational" },
  OTHER: { icon: null, label: "Other" },
};

const Categories = ({ handlecallbackvalue, showModal, setshowModal, handleactionseeall }) => {
  const [categorydata, setcategorydata] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchdata = async () => {
    try {
      const categories = await fetchCategories();
      setcategorydata(categories);
    } catch (error) {
      setErrorMsg(error.message);
      console.error("Error fetching categories:", error.message);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const handlepickvalue = (value) => {
    setSelectedCategory(value);
    handlecallbackvalue(value);
  };

  const handleshowmodal = () => {
    handleactionseeall();
    setshowModal(!showModal);
  };

  return (
    <View className="px-3 mt-3">
      <View className="flex justify-between flex-row items-center">
        <Text className="text-lg font-bold text-gray-800">📚 Categories</Text>
        <TouchableOpacity onPress={handleshowmodal}>
          <Text style={{ color: colorred, fontSize: 14 }} className="font-semibold">
            See all
          </Text>
        </TouchableOpacity>
      </View>

      <View className="w-full mt-3">
        {errorMsg ? (
          <Text style={{ color: colorred }} className="text-center">
            {errorMsg}
          </Text>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal
          >
            {categorydata.map((item, index) => {
              if (item !== "") {
                return (
                  <CourseCard
                    key={index}
                    item={item}
                    handlepickvalue={() => handlepickvalue(item)}
                    isSelected={item === selectedCategory}
                  />
                );
              }
              return null;
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const CourseCard = ({ item, handlepickvalue, isSelected }) => {
  const bgColor = isSelected ? colorred : "white";
  const textColor = isSelected ? "white" : "black";

  return (
    <View className="p-2">
      <TouchableOpacity
        onPress={handlepickvalue}
        style={{
          elevation: 6,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 3 },
          borderRadius: 20,
          backgroundColor: bgColor,
          width: 80,
          height: 80,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10,
        }}
      >
        {itemConfig[item]?.icon ? (
          React.cloneElement(itemConfig[item].icon, { color: textColor })
        ) : (
          <Text style={{ color: textColor, fontSize: 16, fontWeight: "bold" }}>
            {itemConfig[item]?.label}
          </Text>
        )}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: textColor,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          {itemConfig[item]?.label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Categories;
