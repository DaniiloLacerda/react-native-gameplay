import React, { useState, useCallback } from "react";
import { View, FlatList } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Background } from "../../components/Background";
import { ButtonAdd } from "../../components/ButtonAdd";
import { CategorySelect } from "../../components/CategorySelect";
import { ListHeader } from "../../components/ListHeader";
import { Appointment, AppointmentProps } from "../../components/Appointment";
import { Profile } from "../../components/Profile";
import { ListDivider } from "../../components/ListDivider";
import { Load } from "../../components/Load";

import { styles } from "./styles";
import { COLLECTION_APPOINTMENTS } from "../../configs/database";

export function Home() {
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);
  const navigation = useNavigation();

  function handleCategorySelect(categoryId: string) {
    categoryId === category ? setCategory("") : setCategory(categoryId);
  }

  function handleAppointmentDetails(appointmentSelected: AppointmentProps) {
    navigation.navigate("AppointmentDetails", { appointmentSelected });
  }

  function handleAppointmentCreate() {
    navigation.navigate("AppointmentCreate");
  }

  async function loadingAppointments() {
    const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
    const storage: AppointmentProps[] = response ? JSON.parse(response) : [];

    if (category) {
      setAppointments(storage.filter((item) => item.category === category));
    } else {
      setAppointments(storage);
    }

    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadingAppointments();
    }, [category])
  );

  return (
    <Background>
      <View style={styles.header}>
        <Profile />
        <ButtonAdd onPress={handleAppointmentCreate} />
      </View>

      <CategorySelect
        categorySelected={category}
        setCategory={handleCategorySelect}
      />
      {loading ? (
        <Load />
      ) : (
        <>
          <ListHeader
            title="Partidas agendadas"
            subtitle={`Total ${appointments.length}`}
          />
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Appointment
                data={item}
                onPress={() => handleAppointmentDetails(item)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 69 }}
            ItemSeparatorComponent={() => <ListDivider />}
            style={styles.matches}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </Background>
  );
}
