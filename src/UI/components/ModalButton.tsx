import { View, Text, Pressable, StyleProp, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export interface ModalButtonProps {
  extraStyles?: StyleProp<ViewStyle>,  // Optional extra styling components, if necessary
  onPress: () => void;
  color: string;
  title: string;
  size: number;
  icon: ReactNode;
}

export default function ModalButton({ extraStyles, onPress, color, title, size, icon }: ModalButtonProps) {
  return (
    <View
      style={[{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginRight: 10,
        marginLeft: 10,
        width: 100,
      }, extraStyles]}
    >
      <Pressable
        onPress={onPress}
        style={{
          width: size,
          height: size,
          borderWidth: 2,
          borderColor: 'white',
          borderRadius: '50%',
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 6,
        }}
      >
        {icon}
        {/* <MaterialCommunityIcons name={iconName} size={size / 2} color="white" /> */}
      </Pressable>
      <Text style={{ fontSize: 12, color: 'white' }}>{title}</Text>
    </View>
  );
}
