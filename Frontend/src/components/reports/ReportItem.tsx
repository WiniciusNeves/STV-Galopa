import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import colors from '../../styles/Colors';

interface ReportItemProps {
  date: string;
  time: string;
  user: string;
  onPress: () => void;
}
export default function ReportItem({ date, time, user, onPress }: ReportItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: colors.darkCard, padding: 16, borderRadius: 12, marginBottom: 12 }}>
      <Text style={{ color: colors.white, fontSize: 16, marginBottom: 4 }}>

        <AntDesign name="calendar" size={16} color={colors.degradeEnd} />
        <Text style={{ fontWeight: 'bold' , margin: 8 }}>{date}</Text>
        {'  '}
        <AntDesign name="clockcircleo" size={16} color={colors.degradeEnd} /> {time}
      </Text>
      <Text style={{ color: colors.white, fontSize: 16 }}>
        <AntDesign name="user" size={16} color={colors.degradeEnd} /> {user}
      </Text>
    </TouchableOpacity>
  );
}

