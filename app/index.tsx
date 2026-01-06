import { useEffect, useState } from "react";
import { ScrollView, Text, View, Image, StyleSheet } from "react-native";

interface Pokemon {
  name: string;
  image: string;
  image_back: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  }
}

export default function Index() {

  const [pokemons, setPokemons] = useState<Pokemon[]>([])

  console.log(pokemons[0])

  useEffect(() => {
    // fetch pokemons
    fetchPokemons()
  },[])

  async function fetchPokemons() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=10")

      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const detailsResponse = await fetch(pokemon.url);
          const details = await detailsResponse.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            image_back: details.sprites.back_default,
            types: details.types,
          }
        }))

      setPokemons(detailedPokemons)
     } catch (e) {
      console.log(e)
    }
  }

  return (
    <ScrollView>
      { pokemons.map(pokemon => {
        return (
        <View key={pokemon.name}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
          <View style={{ flexDirection: 'row'}}>
          <Image 
          source={{uri: pokemon.image}}
          style={{width: 100, height: 100}}
          />
          <Image 
          source={{uri: pokemon.image_back}}
          style={{width: 100, height: 100}}
          />
          </View>
        </View>
        )
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  type: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray'
  }
})
