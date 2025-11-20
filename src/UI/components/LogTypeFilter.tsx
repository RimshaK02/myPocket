import { Pressable, Text } from 'react-native';
import { LOG_CONFIG, LogType } from './LogCard';
import { StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
interface LogTypeFilterProps {
  type: LogType;
  selected: boolean;
  onPress: () => void;
}
const LogTypeFilter = ({ type, selected, onPress }: LogTypeFilterProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        selected
          ? { backgroundColor: LOG_CONFIG[type].color, borderColor: LOG_CONFIG[type].color }
          : { backgroundColor: 'white', borderColor: LOG_CONFIG[type].color },
      ]}
    >
      <MaterialCommunityIcons
        name={LOG_CONFIG[type].iconName}
        size={30}
        color={selected ? 'white' : LOG_CONFIG[type].color}
      />
      {/* <Text
        style={[styles.text, selected ? { color: 'white' } : { color: LOG_CONFIG[type].color }]}
      >
        {LOG_CONFIG[type].text}
      </Text> */}
      {/* commented out because I feel like larger buttons will be more user friendly on mobile devices. 
      but we can compare these two and see which one looks better */}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  text: { fontSize: 18 },
});

export default LogTypeFilter;
