import { SwipeableDrawer } from "@material-ui/core"
import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useMedia } from "react-use"
import styled from "styled-components"

import { AddTaskIcon, MenuIcon } from "../../../components/Icon"
import { BLUE_COLOR, BLUE_COLOR_WITH_OPACITY, BORDER_COLOR, DARK_BLUE_COLOR, DEFAULT_TEXT_COLOR, WHITE_SMOKE_COLOR } from "../../../components/Styles"
import { isGreaterThanMediumScreen, LARGE_SCREEN_MEDIA_QUERY } from "../../../helpers/responsive"

const HeaderActionIconContainer = styled.div`
  align-items: center;
  display: flex;
  margin-left: 30px;
`
const HeaderContainer = styled.div`
  align-items: center;
  border-bottom: 1px solid ${ BORDER_COLOR };
  display: flex;
  height: 63px;
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

const HeaderNavigationTab = styled.div`
  align-items: center;
  box-sizing: border-box;
  color: ${ DEFAULT_TEXT_COLOR };
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 500;
  height: 100%;
  padding: 0 15px;
  text-align: center;
  text-decoration: none;

  &:hover {
    background-color: ${ WHITE_SMOKE_COLOR };
  }

  & + & {
    margin-left: 10px;
  }

  &.nav-tab--selected {
    border-bottom: 2px solid ${ BLUE_COLOR };
    color: ${ BLUE_COLOR };

    &:hover {
      background-color: ${ BLUE_COLOR_WITH_OPACITY };
      color: ${ DARK_BLUE_COLOR };
    }
  }
`

const HeaderTitle = styled.div`
  cursor: pointer;
  font-size: 24px;
  font-weight: 500;
`

const HeaderTitleContainer = styled.div`
  align-items: center;
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
  height: 63px;
  margin-bottom: 4px;
  padding-left: 24px;
`

// eslint-disable-next-line space-in-parens
const StyledTaskIcon = styled(AddTaskIcon)`
  fill: ${ DEFAULT_TEXT_COLOR };
`

// eslint-disable-next-line space-in-parens
const StyledLink = styled(Link)`
  display: flex;
  height: 100%;
  text-decoration: none;
`

// eslint-disable-next-line space-in-parens
const StyledMenuIcon = styled(MenuIcon)`
  fill: ${ DEFAULT_TEXT_COLOR };
  margin-right: 15px;
`

export const Header: React.FunctionComponent = () => {
  const location = useLocation()
  const [ isMenuOpen, setIsMenuOpen ] = useState<boolean>( false )
  const isDesktopDevice = useMedia( LARGE_SCREEN_MEDIA_QUERY, isGreaterThanMediumScreen() )

  const toggleMenu = ( open: boolean ) => {
    setIsMenuOpen( open )
  }

  return (
    <React.Fragment>
      <HeaderContainer>
        <HeaderTitleContainer>
          {
            ! isDesktopDevice && (
              <div onClick={ () => toggleMenu( ! isMenuOpen ) }><StyledMenuIcon/></div>
            )
          }
          <HeaderTitle>Quran</HeaderTitle>
        </HeaderTitleContainer>
        {
          isDesktopDevice && (
            <HeaderNavigationContainer>
              <StyledLink to="/">
                <HeaderNavigationTab className={ location.pathname === "/" ? "nav-tab--selected" : "" }>Browse Surahs</HeaderNavigationTab>
              </StyledLink>
              <StyledLink to="/about">
                <HeaderNavigationTab className={ location.pathname === "/about" ? "nav-tab--selected" : "" }>About</HeaderNavigationTab>
              </StyledLink>
            </HeaderNavigationContainer>
          )
        }
        <HeaderActionIconContainer>
          <StyledTaskIcon />
        </HeaderActionIconContainer>
      </HeaderContainer>
      <SwipeableDrawer onClose={ () => toggleMenu( false ) } onOpen={ () => toggleMenu( true ) } open={ isMenuOpen } >
        <MenuContainer>
          <MenuTitleContainer>
            <HeaderTitle>Quran</HeaderTitle>
          </MenuTitleContainer>
          <MenuNavigationTabContainer>
            <StyledLink to="/" onClick={ () => toggleMenu( false ) }>
              <MenuTabContainer className={ location.pathname === "/" ? "nav-tab--selected" : "" }>Browse Fonts</MenuTabContainer>
            </StyledLink>
            <StyledLink to="/about" onClick={ () => toggleMenu( false ) }>
              <MenuTabContainer className={ location.pathname === "/about" ? "nav-tab--selected" : "" }>About</MenuTabContainer>
            </StyledLink>
          </MenuNavigationTabContainer>
        </MenuContainer>
      </SwipeableDrawer>
    </React.Fragment>
  )
}