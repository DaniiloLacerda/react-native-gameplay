import React from "react";
import { View, Text } from "react-native";

import { Background } from "../../components/Background";
import { Header } from "../../components/Header";

import { styles } from "./styles";

export function AppointmentDetails() {
  return (
    <Background>
      <Header title="Detalhes" />

      <View style={styles.container}></View>
    </Background>
  );
}
