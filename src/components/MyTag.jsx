import React from "react"
import { Tag } from "antd"
import PropTypes from "prop-types"

export const MyTag = ({ handleCheck, checked, ...props }) => {
  const handleChange = (checked) => {
    handleCheck(checked)
  }

  return (
    <Tag.CheckableTag {...props} checked={checked} onChange={handleChange} />
  )
}

MyTag.propTypes = {
  handleCheck: PropTypes.func,
  checked: PropTypes.bool,
}
