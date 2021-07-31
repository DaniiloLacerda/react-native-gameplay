import React, { useState, useEffect } from "react";
import { Fontisto } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { BorderlessButton } from "react-native-gesture-handler";
import * as Linking from "expo-linking";

import {
  ImageBackground,
  Text,
  View,
  FlatList,
  Alert,
  Share,
  Platform,
} from "react-native";

import BannerImg from "../../assets/banner.png";

import { theme } from "../../global/styles/theme";
import { styles } from "./styles";
import { api } from "../../Services/api";

import { Background } from "../../components/Background";
import { ListHeader } from "../../components/ListHeader";
import { ListDivider } from "../../components/ListDivider";
import { Header } from "../../components/Header";
import { Member, MemberProps } from "../../components/Member";
import { ButtonIcon } from "../../components/ButtonIcon";
import { AppointmentProps } from "../../components/Appointment";
import { Load } from "../../components/Load";

type Params = {
  appointmentSelected: AppointmentProps;
};

type GuildWidGet = {
  id: string;
  name: string;
  instant_invite: string;
  members: MemberProps[];
};

export function AppointmentDetails() {
  const [widGet, setWidGet] = useState<GuildWidGet>({} as GuildWidGet);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { appointmentSelected } = route.params as Params;

  async function fetchGuildWidGet() {
    try {
      const response = await api.get(
        `guilds/${appointmentSelected.guild.id}/widget.json`
      );

      setWidGet(response.data);
      setLoading(false);
    } catch {
      Alert.alert("Verifique as configuração do servidor");
    } finally {
      setLoading(false);
    }
  }

  function handleShareInvitation() {
    const message =
      Platform.OS === "ios"
        ? `Junte-se a ${appointmentSelected.guild.name}`
        : widGet.instant_invite;

    Share.share({ message, url: widGet.instant_invite });
  }

  function handleOpenGuild() {
    Linking.openURL(widGet.instant_invite);
  }

  useEffect(() => {
    fetchGuildWidGet();
  }, []);

  return (
    <Background>
      <Header
        title="Detalhes"
        action={
          appointmentSelected.guild.owner && (
            <BorderlessButton>
              <Fontisto
                name="share"
                sizer={24}
                color={theme.colors.primary}
                onPress={handleShareInvitation}
              />
            </BorderlessButton>
          )
        }
      />

      <ImageBackground source={BannerImg} style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.title}>{appointmentSelected.guild.name}</Text>

          <Text style={styles.subtitle}>{appointmentSelected.description}</Text>
        </View>
      </ImageBackground>
      {loading ? (
        <Load />
      ) : (
        <>
          <ListHeader
            title="Jogadores"
            subtitle={`Total ${widGet ? widGet.members.length : 0}`}
          />
          <FlatList
            data={widGet.members}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Member data={item} />}
            ItemSeparatorComponent={() => <ListDivider isCentered />}
            style={styles.members}
          ></FlatList>
        </>
      )}
      {appointmentSelected.guild.owner && (
        <View style={styles.footer}>
          <ButtonIcon title="Entrar na partida" onPress={handleOpenGuild} />
        </View>
      )}
    </Background>
  );
}
