import { Stack } from "expo-router/stack";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{title:"Home", headerShown: false }} />
    </Stack>
  );
}
