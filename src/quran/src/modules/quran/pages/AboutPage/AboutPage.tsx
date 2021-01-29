import React from "react"
import { Helmet } from "react-helmet"
import styled from "styled-components"

import { LARGE_SCREEN_MEDIA_QUERY } from "../../../../helpers/responsive"
import { AL_QURAN } from "../../constants/common"

const AboutPageContainer = styled.div`
  padding: 0 30px;

  @media ${ LARGE_SCREEN_MEDIA_QUERY } {
    max-width: 70%;
    margin: 0 auto;
  }
`

export const AboutPage: React.FunctionComponent = () => {
  return (
    <AboutPageContainer>
      <Helmet>
        <title>About | The Noble Quran | { AL_QURAN }</title>
      </Helmet>
    </AboutPageContainer>
  )
}