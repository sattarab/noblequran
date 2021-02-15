import React from "react"
import { Helmet } from "react-helmet"
import styled from "styled-components"

import { LARGE_SCREEN_MEDIA_QUERY } from "../../../../helpers/responsive"
import { AL_QURAN } from "../../constants/common"

const AboutPageBody = styled.div`
  margin-top: 64px;
`

const AboutPageIntro = styled.div`
  font-size: 16px;
  line-height: 1.5;
`

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
        <title>About - The Noble Quran | { AL_QURAN }</title>
        <meta name="description" content="The Quran is the central religious text of Islam. It is regarded as the finest work in classical Arabic literature. It is organized in 114 chapters(surahs), which consist of verses(ayahs)." />
      </Helmet>
      <AboutPageBody>
        <AboutPageIntro>The Quran, also romanized Qur&apos;an or Koran is the central religious text of Islam revealed to Prophet Muhammad (P.B.U.H) by Allah (God) through the archangel Gabriel (Jibril). It is regarded as the finest work in classical Arabic literature. It is organized in 114 chapters (surahs), which consist of verses (ayahs).</AboutPageIntro>
      </AboutPageBody>
    </AboutPageContainer>
  )
}
