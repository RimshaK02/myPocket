import NestedNavCard from './ui/cards/NestedNavCard';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View, StyleProp, ViewStyle } from 'react-native';

export type LogType = 'task' | 'note' | 'animalEvent' | 'animal';
export type LogStatus = 'approved' | 'pending' | 'error';

type LogConfig = {
  iconName: keyof typeof MaterialCommunityIcons.glyphMap; //Used Material Icons for fast development, can be replaced with a filepath in future for consistency
  color: string;
  text: string;
};

export const LOG_CONFIG: Record<LogType, LogConfig> = {
  task: {
    iconName: 'clipboard-list-outline',
    color: '#5C7680',
    text: 'Task',
  },
  note: {
    iconName: 'note-edit-outline',
    color: '#7A866D',
    text: 'Note',
  },
  animalEvent: {
    iconName: 'paw',
    color: '#D5A663',
    text: 'Animal Event',
  },
  animal: {
    iconName: 'cow',
    color: '#AB83E3',
    text: 'Animal',
  },
};
export interface LogProps {
  style?: StyleProp<ViewStyle>,  
  id: string;
  type: LogType;
  title: string;
  date: string;
  time: string;
  transcription: string;
  status: LogStatus;
}

export default function LogCard({ style, id, type, title, date, time, transcription }: LogProps) {
  const color = LOG_CONFIG[type].color;
  const iconName = LOG_CONFIG[type].iconName;
  const icon = <MaterialCommunityIcons name={iconName} size={30} color={color} />;
  return (
    <View style={[{ borderColor: color, borderWidth: 2, borderRadius: 10, marginTop: 15 }, style]}>
      <NestedNavCard
        submenuRef="submenu"
        title={title}
        subtitle={`${date} | ${time}`}
        icon={icon}
      />
    </View>
  );
}
