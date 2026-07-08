// @ts-nocheck
import { useState } from "react";
import { Pressable, Text } from "react-native-web";

function useToggle(initialValue = false) {
  const [on, setOn] = useState(initialValue);
  return { on, toggle: () => setOn((value) => !value) };
}

export function FavoriteButton() {
  const favorite = useToggle();

  return (
    <Pressable onPress={favorite.toggle}>
      <Text>{favorite.on ? "Saved" : "Save"}</Text>
    </Pressable>
  );
}
