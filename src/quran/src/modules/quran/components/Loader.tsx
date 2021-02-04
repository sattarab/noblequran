import React from "react"
import Loader from "react-loader-spinner"

import { BLUE_COLOR } from "../../../components/Styles"

export const QLoader: React.FunctionComponent = () => {
  return (
    <Loader type="ThreeDots" color={ BLUE_COLOR } width="100" height="100" />
  )
}
