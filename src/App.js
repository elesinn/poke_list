import React, { useEffect, useContext } from "react"
import "antd/dist/antd.css"
import "./App.css"
import { Layout, List, BackTop, Spin } from "antd"
import { PokemonCard } from "./components/PokemonCard"
import { PokemonListHeader } from "./components/PokemonListHeader"
import { PokemonStoreProvider, PokemonStoreContext } from "./store/PokemonStore"
import { useObserver } from "mobx-react-lite"
const { Header, Footer, Content } = Layout

const PokemonApp = () => {
  const store = useContext(PokemonStoreContext)

  useEffect(() => {
    store.getPokemonsList()
  }, [])

  return useObserver(() => (
    <Layout>
      <Header>Pokemons</Header>
      <Content className="main-wrapper">
        <div className="main-content">
          {store.pokemonsIsLoaded ? (
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 3,
                lg: 4,
                xl: 6,
              }}
              pagination={{
                pageSizeOptions: ["10", "20", "50"],
              }}
              header={<PokemonListHeader store={store} />}
              dataSource={store.filteredPokemons}
              renderItem={(item) => (
                <List.Item>
                  <PokemonCard pokemon={item} store={store} />
                </List.Item>
              )}
            />
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Content>
      <BackTop />
      <Footer className="footer">© PokeApp</Footer>
    </Layout>
  ))
}

const App = () => {
  return (
    <PokemonStoreProvider>
      <PokemonApp />
    </PokemonStoreProvider>
  )
}

export default App
