import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../../styles/Colors';

interface ReportItemProps {
  date: string;
  time: string;
  user: string;
  onPress: () => void;
}

export default function ReportItem({ date, time, user, onPress }: ReportItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.row}>
        <AntDesign name="calendar" size={16} color={colors.degradeEnd} />
        <Text style={styles.textBold}>{date}</Text>
        <AntDesign name="clockcircleo" size={16} color={colors.degradeEnd} style={styles.iconSpacing} />
        <Text style={styles.text}>{time}</Text>
      </View>
      <View style={styles.row}>
        <AntDesign name="user" size={16} color={colors.degradeEnd} />
        <Text style={styles.text}>{user}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkCard,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconSpacing: {
    marginLeft: 12,
  },
  textBold: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    marginLeft: 8,
  },
});
