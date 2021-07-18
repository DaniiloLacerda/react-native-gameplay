import React from "react";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";
import { Image } from "react-native";
import { styles } from "./styles";

export function GuildIcon() {
  const uri = "https://img.icons8.com/nolan/452/discord-logo.png";
  return <Image source={{ uri }} style={styles.image} />;
}
