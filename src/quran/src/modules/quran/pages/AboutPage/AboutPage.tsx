import styled from "@emotion/styled"
import React from "react"
import { Helmet } from "react-helmet"

import { LARGE_SCREEN_MEDIA_QUERY } from "../../../../helpers/responsive"
import { AL_QURAN } from "../../constants/common"

const AboutPageBody = styled.div`
  margin-top: 30px;

  @media ${ LARGE_SCREEN_MEDIA_QUERY } {
    margin-top: 64px;
  }
`

const AboutPageIntro = styled.p`
  font: 400 16px/24px "HarmoniaSansPro";
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
        <AboutPageIntro>
          <strong>The Quran</strong>, also romanized <strong>Qur&apos;an</strong> or <strong>Koran</strong> is the central religious text of Islam revealed to <strong>Prophet Muhammad (P.B.U.H)</strong> by God through the archangel Gabriel. It is regarded as the finest work in classical Arabic literature. It is organized in 114 chapters (surahs), which consist of verses (ayahs).
        </AboutPageIntro>
      </AboutPageBody>
    </AboutPageContainer>
  )
}
