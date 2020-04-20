import React from "react"
import { useLocalStore } from "mobx-react-lite"
import PropTypes from "prop-types"

export const PokemonStoreContext = React.createContext()

export const PokemonStoreProvider = ({ children }) => {
  const store = useLocalStore(() => ({
    pokemons: [],
    types: [],
    filter: "",
    pokemonsIsLoaded: false,
    typesIsLoaded: false,
    addPokemon: (pokemon) => {
      store.pokemons.push(pokemon)
    },

    get filteredPokemons() {
      const matchesFilter = new RegExp(store.filter, "i")

      return store.pokemons
        .filter(({ name }) => !store.filter || matchesFilter.test(name))
        .filter((pokemon) => {
          if (store.selectedTags.length > 0) {
            if (pokemon.tags) {
              return pokemon.tags.some((tag) =>
                store.selectedTags.includes(tag)
              )
            } else {
              return false
            }
          } else {
            return true
          }
        })
    },

    get selectedTags() {
      let selectedTags = store.types
        .filter((type) => type.selected === true)
        .map((type) => type.name)
      return selectedTags
    },

    updateFilter(value) {
      store.filter = value
    },

    selectTag(typeName) {
      store.types.find((type) => type.name === typeName).selected = true
    },

    unselectTag(typeName) {
      store.types.find((type) => type.name === typeName).selected = false
    },

    getPokemonsList: () => {
      fetch("https://pokeapi.co/api/v2/pokemon/?limit=1000")
        .then((response) => response.json())
        .then(
          (response) => {
            //format response
            const formatedResult = response["results"].map((pokemon) => {
              const id = pokemon.url.split("/").slice(-2, -1)
              const name =
                pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
              return {
                id,
                name,
                isCompleteData: false,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
              }
            })
            store.pokemons = formatedResult
            store.pokemonsIsLoaded = true
          },
          (error) => {
            console.log("ERROR:", error)
          }
        )
    },

    getTypes: () => {
      fetch("https://pokeapi.co/api/v2/type/")
        .then((response) => response.json())
        .then(
          (response) => {
            store.types = response["results"]
            store.types.forEach((type, i) => (store.types[i].selected = false))
            store.typesIsLoaded = true
          },
          (error) => {
            console.log("ERROR:", error)
          }
        )
    },

    getPokemonsForType: (type) => {
      fetch(type.url)
        .then((response) => response.json())
        .then(
          (response) => {
            store.types = response["pokemon"]
            store.types.forEach((type, i) => (store.types[i].selected = false))

            store.typesIsLoaded = true
          },
          (error) => {
            console.log("ERROR:", error)
          }
        )
    },

    getDetailedInfo: (id) => {
      //fetch data and cache in store
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => response.json())
        .then(
          (response) => {
            //format response
            const pokemon = store.pokemons.find((pokemon) => pokemon.id === id)

            pokemon.tags = response["types"].reduce((acc, type) => {
              acc.push(type["type"]["name"])
              return acc
            }, [])

            pokemon.stats = response["stats"].reduce((acc, stat) => {
              acc.push({
                name: stat["stat"]["name"],
                value: stat["base_stat"],
              })
              return acc
            }, [])

            pokemon.abilities = response["abilities"].reduce((acc, ability) => {
              acc.push(ability["ability"])
              return acc
            }, [])

            pokemon.isCompleteData = true
          },
          (error) => {
            console.log("ERROR", error)
          }
        )
    },

    getDetailedAbilities(id) {
      const pokemon = store.pokemons.find((pokemon) => pokemon.id === id)

      let promiseArray = []
      pokemon.abilities.forEach((ability) => {
        promiseArray.push(
          fetch(ability.url).then((response) => response.json())
        )
      })
      let result = Promise.all(promiseArray)
      return result
    },
  }))

  return (
    <PokemonStoreContext.Provider value={store}>
      {children}
    </PokemonStoreContext.Provider>
  )
}

PokemonStoreProvider.propTypes = {
  children: PropTypes.object,
}
