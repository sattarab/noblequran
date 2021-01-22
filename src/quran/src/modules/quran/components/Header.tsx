import React from "react"
import styled from "styled-components"

import { QuranIcon } from "../../../components/Icon"
import { BACKGROUND_COLOR, DEFAULT_TEXT_COLOR } from "../../../components/Styles"

const HeaderContainer = styled.div`
  align-items: center;
  background: ${ BACKGROUND_COLOR };
  display: flex;
  height: 80px;
  padding: 0 30px;
`

// eslint-disable-next-line space-in-parens
const StyledQuranIcon = styled(QuranIcon)`
  fill: ${ DEFAULT_TEXT_COLOR };
  height: 60px;
  width: 60px;
`

export const Header: React.FunctionComponent = () => {
  return (
    <HeaderContainer>
      <StyledQuranIcon />
    </HeaderContainer>
  )
}