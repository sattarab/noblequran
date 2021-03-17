import styled from "@emotion/styled"
import React, { memo, useCallback } from "react"
import { Link } from "react-router-dom"

import { QuranIcon } from "../../../components/Icon"
import { FOOTER_COLOR } from "../../../components/Styles"
import { MEDIUM_SCREEN_MEDIA_QUERY, MOBILE_SCREEN_MEDIA_QUERY } from "../../../helpers/responsive"

const Footer = styled.footer`
  background: ${ FOOTER_COLOR };
  box-sizing: border-box;
  height: 646px;
  padding: 40px 30px 24px 30px;
  margin-top: 32px;

  @media ${ MEDIUM_SCREEN_MEDIA_QUERY } {
    height: 440px;
    padding: 64px 64px 48px;
  }
`

const FooterContainer = styled.div`
  height: 100%;
  margin: 0 auto;
  max-width: 1440px;
  overflow: hidden;
  position: relative;
  width: 100%;
`

const FooterDescription = styled.p`
  font: 400 16px/24px "HarmoniaSansPro";
  letter-spacing: 0.2px;
  margin: 0 0 40px 0;
  max-width: 480px;
  padding-right: 40px;
`

const FooterDetailContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media ${ MEDIUM_SCREEN_MEDIA_QUERY } {
    flex: 50%;
    flex-direction: row;
  }
`

const FooterDetailsContainer = styled.div`
  align-items: start;
  display: flex;
  flex-direction: column;
  justify-content: start;

  @media ${ MEDIUM_SCREEN_MEDIA_QUERY } {
    flex-direction: row;
  }
`

const FooterLink = styled( Link )`
  text-decoration: none;

  & + & {
    margin-top: 5px;
  }
`

const FooterLinksContainer = styled.nav`
  display: flex;
  flex: 100%;
  flex-direction: column;

  @media ${ MOBILE_SCREEN_MEDIA_QUERY } {
    & + & {
      margin-top: 15px;
    }
  }

  @media ${ MEDIUM_SCREEN_MEDIA_QUERY } {
    flex: 50%;
  }
`

const FooterLogoContainer = styled.div`
  bottom: 30px;
  position: absolute;
`

const FooterTitle = styled.h3`
  font-size: 24px;
  margin: 0 0 24px 0;
`

const StyledQuranIcon = styled( QuranIcon )`
  height: 64px;
  width: 64px;
`

const QFooterFunction: React.FunctionComponent = () => {
  const scrollTop = useCallback( () => {
    window.scrollTo( 0, 0 )
  }, [] )

  return (
    <Footer>
      <FooterContainer>
        <FooterTitle>Quran</FooterTitle>
        <FooterDetailsContainer>
          <FooterDetailContainer>
            <FooterDescription>Noble Quran is a reading and translation resource of Quran. Our aim is to provide beautiful, elegant and easy to use UI to facilitate reading. Download Quran to use in your digital products for Android, Ios or web.</FooterDescription>
          </FooterDetailContainer>
          <FooterDetailContainer>
            <FooterLinksContainer>
              <FooterLink onClick={ scrollTop } to="/">Browse Surahs</FooterLink>
              <FooterLink onClick={ scrollTop } to="/about">About</FooterLink>
            </FooterLinksContainer>
            <FooterLinksContainer>
              <FooterLink onClick={ scrollTop } to="/2">Al-Baqarah</FooterLink>
              <FooterLink onClick={ scrollTop } to="/18">Al-Kahf</FooterLink>
              <FooterLink onClick={ scrollTop } to="/36">Ya Sin</FooterLink>
              <FooterLink onClick={ scrollTop } to="/67">Al-Mulk</FooterLink>
            </FooterLinksContainer>
          </FooterDetailContainer>
        </FooterDetailsContainer>
        <FooterLogoContainer>
          <StyledQuranIcon />
        </FooterLogoContainer>
      </FooterContainer>
    </Footer>
  )
}

export const QFooter = memo( QFooterFunction )
