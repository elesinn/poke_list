import React, { useEffect, useState } from "react"
import { Card, Skeleton, List, Tag, Button } from "antd"
import PropTypes from "prop-types"

import defaultImage from "./../assets/images/default.jpg"
import { useObserver } from "mobx-react-lite"
import { PokemonInfoModal } from "./PokemonInfoModal"

export const PokemonCard = ({ pokemon, store }) => {
  const [modalIsVisible, setModalIsVisible] = useState(false)

  useEffect(() => {
    if (!pokemon.isCompleteData) {
      store.getDetailedInfo(pokemon.id)
    }
  }, [pokemon])

  const setDefaultImg = (ev) => {
    ev.target.src = defaultImage
  }

  const showModal = () => {
    setModalIsVisible(true)
  }

  return useObserver(() => (
    <>
      <Card hoverable title={pokemon.name} className="animated-card">
        <div className="img-container">
          <img onError={setDefaultImg} alt="pokemon" src={pokemon.image} />
        </div>

        {pokemon.isCompleteData ? (
          <>
            <div>
              {pokemon.tags.map((tag) => (
                <Tag key={tag} className={`type-${tag}`}>
                  {tag}
                </Tag>
              ))}
            </div>
            <List
              header={
                <div>
                  <b>Main stats:</b>
                </div>
              }
              dataSource={pokemon.stats}
              renderItem={(stat) => (
                <List.Item>
                  <span>{stat.name}:</span> {stat.value}
                </List.Item>
              )}
            />
          </>
        ) : (
          <Skeleton active loading={true} paragraph={{ rows: 6 }} />
        )}
        <Button key="show" type="primary" size="large" onClick={showModal}>
          Show abilities
        </Button>
      </Card>
      <PokemonInfoModal
        pokemon={pokemon}
        visible={modalIsVisible}
        handleOk={() => setModalIsVisible(false)}
        store={store}
      />
    </>
  ))
}

PokemonCard.propTypes = {
  pokemon: PropTypes.object,
  store: PropTypes.object,
}
