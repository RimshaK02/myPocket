import { Text, useColorScheme, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface DividerProps {
  text: string;
  icon: React.ReactNode;
}

export default function Divider({ text, icon }: DividerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        {icon}
        <Text style={{ color: colors.darkGray, textAlign: 'left' }}>{text}</Text>
      </View>
      <View style={{ height: 1, backgroundColor: colors.darkGray, marginTop: 8 }} />
    </View>
  );
}
