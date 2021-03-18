import styled from "@emotion/styled"
import React, { memo } from "react"
import { Helmet } from "react-helmet"
import { useEffectOnce } from "react-use"

import { DARK_TEXT_COLOR, DEFAULT_TEXT_COLOR } from "../../../../components/Styles"
import { MEDIUM_SCREEN_MEDIA_QUERY } from "../../../../helpers/responsive"
import { AL_QURAN } from "../../constants/common"
import { trackMixpanelEvent } from "../../services/mixpanel"

const AboutPageBody = styled.div`
  margin-top: 30px;

  @media ${ MEDIUM_SCREEN_MEDIA_QUERY } {
    margin-top: 64px;
  }
`

const AboutPageContainer = styled.div`
  padding: 0 30px;

  @media ${ MEDIUM_SCREEN_MEDIA_QUERY } {
    margin: 0 auto;
    max-width: 1440px;
    padding-bottom: 90px;
  }
`

const AboutPageSectionBody = styled.p`
  color: ${ DEFAULT_TEXT_COLOR };
  font: 400 16px/20px "HarmoniaSansPro";
`

const AboutPageSectionHeader = styled.h2`
  color: ${ DARK_TEXT_COLOR };
  font: 500 20px/24px "HarmoniaSansPro";
  margin: 30px 0 10px;
`

const AboutPageFunction: React.FunctionComponent = () => {
  useEffectOnce( () => {
    trackMixpanelEvent( "Page Opened", { Name: "About" } )
  } )

  return (
    <AboutPageContainer>
      <Helmet>
        <title>About - The Noble Quran | { AL_QURAN }</title>
        <meta name="description" content="The Quran is the central religious text of Islam. It is regarded as the finest work in classical Arabic literature. It is organized in 114 chapters(surahs), which consist of verses(ayahs)." />
      </Helmet>
      <AboutPageBody>
        <AboutPageSectionBody>
          <strong>The Quran</strong>, also romanized <strong>Qur&apos;an</strong> or <strong>Koran</strong> is the central religious text of Islam revealed to <strong>Prophet Muhammad (P.B.U.H)</strong> by God through the archangel Gabriel. It is regarded as the finest work in classical Arabic literature. It is organized in 114 chapters (surahs), which consist of verses (ayat).
        </AboutPageSectionBody>
        <AboutPageSectionHeader>Meccan Surahs</AboutPageSectionHeader>
        <AboutPageSectionBody>
          The Meccan surahs are the chronologically earlier chapters of the <strong>Quran</strong>. The Meccan surahs are believed to have been revealed anytime before the migration of <strong>Prophet Muhammad (P.B.U.H)</strong> and his followers from Mecca to Medina (Hijra). Meccan surahs are typically shorter than Medinan surahs, with relatively short verses (āyāt), and mostly come near the end of the Qur&apos;an.
        </AboutPageSectionBody>
        <AboutPageSectionHeader>Medinan Surahs</AboutPageSectionHeader>
        <AboutPageSectionBody>
          The Medinan surahs are chapters of the <strong>Quran</strong> which were revealed after the migration of <strong>Prophet Muhammad (P.B.U.H)</strong> and his followers from Mecca to Medina (Hijra). Medinan surahs typically have relatively longer verses (āyāt), and mostly come either at the start or the middle of the Qur&apos;an.
        </AboutPageSectionBody>
      </AboutPageBody>
    </AboutPageContainer>
  )
}

export const AboutPage = memo( AboutPageFunction )
