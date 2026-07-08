// @ts-nocheck
import { Pressable, Text, View } from "react-native-web";

export function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <View>
      <Text>Daily checklist</Text>
      <Pressable onPress={onStart}>
        <Text>Start</Text>
      </Pressable>
    </View>
  );
}
