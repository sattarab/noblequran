import React from "react"
import styled from "styled-components"
import { QuranIcon } from "../../../components/Icon"

const HeaderContainer = styled.div`
  align-items: center;
  display: flex;
  height: 120px;
`

const HeaderIconContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
`

// eslint-disable-next-line space-in-parens
const HeaderQuranIcon = styled(QuranIcon)`
  height: 100px;
  width: 100px;
`

export const Header: React.FunctionComponent = () => {
  return (
    <HeaderContainer>
      <HeaderIconContainer>
        <HeaderQuranIcon />
      </HeaderIconContainer>
    </HeaderContainer>
  )
}