import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colorred } from '../../constant/color';

const NumericKeyboard = ({ onKeyPress, onBackspace }) => {
    return (
        <View className="w-screen items-center bg-red-50 py-3">
            <View className="w-5/6 flex flex-row justify-center flex-wrap">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
                <TouchableOpacity
                    key={digit}
                    style={{elevation:4}}
                    className="w-16 h-12 items-center justify-center flex m-2 bg-slate-100 rounded-lg shadow-slate-400 shadow-sm "
                    onPress={() => onKeyPress(digit)}
                >
                    <Text style={{color:colorred}} className="font-semibold text-sm">{digit}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity
            style={{elevation:4}}
             className="w-32 h-12 items-center shadow-slate-400 shadow-sm justify-center flex m-2 bg-slate-100 rounded-lg" onPress={onBackspace}>
                <Text style={{color:colorred}} className="font-semibold text-lg">⌫</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
};

export default NumericKeyboard;

const styles = StyleSheet.create({
    keyboardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '80%',
    },
    key: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        backgroundColor: '#ddd',
        borderRadius: 30,
    },
    keyText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
