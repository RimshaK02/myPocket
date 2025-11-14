import { View, Text, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export interface ModalButtonProps {
  onPress: () => void;
  color: string;
  title: string;
  size: number;
  iconName: any;
}

export default function ModalButton({ onPress, color, title, size, iconName }: ModalButtonProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        marginRight: 10,
        marginLeft: 10,
        width: 100,
      }}
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
        <MaterialCommunityIcons name={iconName} size={size / 2} color="white" />
      </Pressable>
      <Text style={{ fontSize: 12, color: 'white' }}>{title}</Text>
    </View>
  );
}
