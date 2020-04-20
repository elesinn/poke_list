import React, { useEffect } from "react"
import { Input, Spin } from "antd"
import { MyTag } from "./MyTag"
import { observer } from "mobx-react-lite"

export const PokemonListHeader = observer(({ store }) => {
  useEffect(() => {
    store.getTypes()
  }, [])

  const filterPokemons = ({ target: { value } }) => {
    store.updateFilter(value)
  }

  const handleCheck = (typeName, value) => {
    value ? store.selectTag(typeName) : store.unselectTag(typeName)
  }

  return (
    <div className="list-header">
      <div className="search-container">
        <Input
          placeholder="Enter Pokemon name"
          value={store.filter}
          onChange={filterPokemons}
        />
      </div>
      {store.typesIsLoaded ? (
        <div className="types">
          Filter by already loaded pokemons (avoid API spam), change page to
          load more pokemons.
          <br />
          {store.types.map((type) => (
            <MyTag
              key={type.name}
              className={`type-${type.name}`}
              handleCheck={(value) => handleCheck(type.name, value)}
              checked={type.selected}
            >
              {type.name}
            </MyTag>
          ))}
        </div>
      ) : (
        <Spin size="large" />
      )}
    </div>
  )
})
