import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Modal, Button, List, Skeleton } from "antd"
import { useObserver } from "mobx-react-lite"

export const PokemonInfoModal = ({ pokemon, visible, handleOk, store }) => {
  const [abilities, setAbilities] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (visible) {
      setIsLoaded(false)
      store.getDetailedAbilities(pokemon.id).then((data) => {
        setAbilities(
          data.map((el) => ({
            name: el["names"]["2"]["name"],
            description: el["effect_entries"]["0"]["effect"],
          }))
        )
        setIsLoaded(true)
      })
    }
  }, [visible])

  return useObserver(() => (
    <Modal
      title="Abilities"
      visible={visible}
      onCancel={handleOk}
      footer={[
        <Button key="back" type="primary" onClick={handleOk}>
          Return
        </Button>,
      ]}
    >
      {isLoaded ? (
        <List
          itemLayout="horizontal"
          dataSource={abilities}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.name}
                description={item.description}
              />
            </List.Item>
          )}
        />
      ) : (
        <Skeleton active loading={true} />
      )}
    </Modal>
  ))
}

PokemonInfoModal.propTypes = {
  visible: PropTypes.bool,
  handleOk: PropTypes.func,
  pokemon: PropTypes.object,
  store: PropTypes.object,
}
