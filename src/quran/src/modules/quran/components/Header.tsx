import styled from "@emotion/styled"
import Button from "@material-ui/core/Button"
import Drawer from "@material-ui/core/Drawer"
import { withStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import React, { memo, useCallback, useState } from "react"
import { Link, useHistory, useLocation } from "react-router-dom"

import { MenuIcon, QuranIcon } from "../../../components/Icon"
import { BLUE_COLOR, BLUE_COLOR_WITH_OPACITY, BORDER_COLOR, DARK_BLUE_COLOR, DEFAULT_TEXT_COLOR, HEADER_HEIGHT, WHITE_SMOKE_COLOR } from "../../../components/Styles"
import { LARGE_SCREEN_MEDIA_QUERY } from "../../../helpers/responsive"
import { useAppSelector } from "../../../hooks"
import { useQuranState } from "./QuranContext"
import { QRightDrawerButton } from "./RightDrawerButton"

const StyledButton = withStyles( {
  root: {
    borderRadius: 0,
    color: `${ DEFAULT_TEXT_COLOR }`,
    fontSize: "16px",
    fontWeight: 500,
    padding: "0 15px",
    textTransform: "none",
  },
} )( Button )

const StyledLink = styled( Link )`
  display: flex;
  height: 100%;
  text-decoration: none;
`

const StyledLinkWithMargin = styled( StyledLink )`
  & + & {
    margin-left: 10px;
  }
`

const StyledMenuIcon = styled( MenuIcon )`
  fill: ${ DEFAULT_TEXT_COLOR };
  margin-right: 15px;
`

const HeaderActionIconContainer = styled.div`
  margin-left: 30px;
`

const HeaderContainer = styled.div`
  align-items: center;
  border-bottom: 1px solid ${ BORDER_COLOR };
  box-sizing: border-box;
  display: flex;
  height: ${ HEADER_HEIGHT };
  justify-content: space-between;
  padding: 0 30px;

  @media ${ LARGE_SCREEN_MEDIA_QUERY } {
    padding: 0 60px;
  }
`

const HeaderNavigationContainer = styled.nav`
  align-items: center;
  display: inline-flex;
  height: 100%;
`

const HeaderNavigationTab = styled( StyledButton )`
  align-items: center;
  display: flex;

  &:hover {
    background-color: ${ WHITE_SMOKE_COLOR };
  }

  &.nav-tab--selected {
    border-bottom: 2px solid ${ BLUE_COLOR };
    .MuiButton-label {
      color: ${ BLUE_COLOR };
    }

    &:hover {
      background-color: ${ BLUE_COLOR_WITH_OPACITY };
      .MuiButton-label {
        color: ${ DARK_BLUE_COLOR };
      }
    }
  }
`

const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`

const HeaderTitleContainer = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex: 1;
`

const MenuContainer = styled.div`
  max-width: 320px;
  width: calc( 100vw - 60px );
`

const MenuNavigationTabContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 8px;
  padding-top: 8px;
`

const MenuTabContainer = styled.div`
  align-items: center;
  border-bottom-right-radius: 25px;
  border-top-right-radius: 25px;
  color: ${ DEFAULT_TEXT_COLOR };
  display: flex;
  font-weight: 500;
  height: 50px;
  padding-left: 24px;
  width: calc( 100% - 24px );

  &:hover {
    background-color: ${ WHITE_SMOKE_COLOR };
  }

  & + & {
    margin-top: 10px;
  }

  &.nav-tab--selected {
    background-color: ${ BLUE_COLOR_WITH_OPACITY };
    color: ${ BLUE_COLOR };

    &:hover {
      color: ${ DARK_BLUE_COLOR };
    }
  }
`

const MenuTitleContainer = styled.div`
  align-items: center;
  border-bottom: 1px solid ${ BORDER_COLOR };
  box-sizing: border-box;
  display: flex;
  flex: 1;
  height: ${ HEADER_HEIGHT };
  margin-bottom: 4px;
  padding-left: 24px;
`

const StyledQuranIcon = styled( QuranIcon )`
  margin-right: 5px;
`

const QHeaderFunction: React.FunctionComponent = () => {
  const history = useHistory()
  const isRightDrawerOpen = useAppSelector( ( state ) => state.quran.isRightDrawerOpen )
  const location = useLocation()

  const [ isLeftDrawerOpen, setIsLeftDrawerOpen ] = useState<boolean>( false )
  const { baseClasses, isMobileDevice } = useQuranState()

  const toggleLeftMenu = useCallback( ( open: boolean ) => {
    setIsLeftDrawerOpen( open )
  }, [] )

  const toggleLeftMenuByButton = useCallback( ( event: React.MouseEvent<SVGSVGElement>, open: boolean ) => {
    event.stopPropagation()
    event.preventDefault()
    toggleLeftMenu( open )
  }, [ toggleLeftMenu ] )

  return (
    <>
      <HeaderContainer className={ clsx( baseClasses.header, {
        [ baseClasses.headerShift ]: isRightDrawerOpen && ! isMobileDevice,
      } ) }>
        <HeaderTitleContainer onClick={ () => history.push( "/" ) }>
          {
            isMobileDevice && (
              <StyledMenuIcon onClick={ ( event ) => toggleLeftMenuByButton( event, ! isLeftDrawerOpen ) } />
            )
          }
          <StyledQuranIcon />
          <HeaderTitle>Quran</HeaderTitle>
        </HeaderTitleContainer>
        {
          ! isMobileDevice && (
            <HeaderNavigationContainer>
              <StyledLinkWithMargin to="/">
                <HeaderNavigationTab className={ location.pathname === "/" ? "nav-tab--selected" : "" }>Browse Surahs</HeaderNavigationTab>
              </StyledLinkWithMargin>
              <StyledLinkWithMargin to="/about">
                <HeaderNavigationTab className={ location.pathname === "/about" ? "nav-tab--selected" : "" }>About</HeaderNavigationTab>
              </StyledLinkWithMargin>
            </HeaderNavigationContainer>
          )
        }
        <HeaderActionIconContainer>
          <QRightDrawerButton />
        </HeaderActionIconContainer>
      </HeaderContainer>
      <Drawer onClose={ () => toggleLeftMenu( false ) } open={ isLeftDrawerOpen } >
        <MenuContainer>
          <MenuTitleContainer>
            <StyledQuranIcon />
            <HeaderTitle>Quran</HeaderTitle>
          </MenuTitleContainer>
          <MenuNavigationTabContainer>
            <StyledLink to="/" onClick={ () => toggleLeftMenu( false ) }>
              <MenuTabContainer className={ location.pathname === "/" ? "nav-tab--selected" : "" }>Browse Surahs</MenuTabContainer>
            </StyledLink>
            <StyledLink to="/about" onClick={ () => toggleLeftMenu( false ) }>
              <MenuTabContainer className={ location.pathname === "/about" ? "nav-tab--selected" : "" }>About</MenuTabContainer>
            </StyledLink>
          </MenuNavigationTabContainer>
        </MenuContainer>
      </Drawer>
    </>
  )
}

export const QHeader = memo( QHeaderFunction )
