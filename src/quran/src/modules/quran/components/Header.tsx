import { withStyles } from "@material-ui/core"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import React, { memo, useCallback, useState } from "react"
import { Link, useHistory, useLocation } from "react-router-dom"
import styled from "styled-components"

import { AddTaskIcon, MenuIcon } from "../../../components/Icon"
import { BLUE_COLOR, BLUE_COLOR_WITH_OPACITY, BORDER_COLOR, DARK_BLUE_COLOR, DEFAULT_TEXT_COLOR, WHITE_SMOKE_COLOR } from "../../../components/Styles"
import { LARGE_SCREEN_MEDIA_QUERY } from "../../../helpers/responsive"
import { QPopper } from "./Popper"
import { useQuranState } from "./QuranContext"

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

const StyledTaskIcon = styled( AddTaskIcon )`
  fill: ${ DEFAULT_TEXT_COLOR };
`

const HeaderActionIconContainer = styled.div`
  align-items: center;
  display: flex;
  margin-left: 30px;
  position: relative;
`

const HeaderActionIconIndicator = styled.div`
  border-radius: 50%;
  background: #d93025;
  height: 6px;
  position: absolute;
  right: 4px;
  top: 10px;
  width: 6px;
`

const HeaderContainer = styled.div`
  align-items: center;
  border-bottom: 1px solid ${ BORDER_COLOR };
  display: flex;
  height: 63px;
  justify-content: space-between;
  padding: 0 30px;
  z-index: 100;

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

const QHeaderFunction: React.FunctionComponent = () => {
  const history = useHistory()
  const location = useLocation()
  const { isMobileDevice, selectedAyahs } = useQuranState()
  const [ isLeftMenuOpen, setIsLeftMenuOpen ] = useState<boolean>( false )
  const [ isRightMenuOpen, setIsRightMenuOpen ] = useState<boolean>( false )
  const [ popoverMap, setPopoverMap ] = useState<{ [ key: string ]: Element | null }>( {} )

  const closePopover = ( key: string ) => {
    setPopoverMap(  { ...popoverMap, ...{ [ key ]: null } } )
  }

  const openPopover = ( key: string, event: React.MouseEvent<HTMLSpanElement> ) => {
    setPopoverMap(  { ...popoverMap, ...{ [ key ]: event.currentTarget } } )
  }

  const toggleLeftMenu = useCallback( ( open: boolean ) => {
    setIsLeftMenuOpen( open )
  }, [] )

  const toggleRightMenu = useCallback( ( open: boolean ) => {
    setIsRightMenuOpen( open )
  }, [] )

  return (
    <React.Fragment>
      <HeaderContainer>
        <HeaderTitleContainer>
          {
            isMobileDevice && (
              <div onClick={ () => toggleLeftMenu( ! isLeftMenuOpen ) }><StyledMenuIcon/></div>
            )
          }
          <HeaderTitle onClick={ () => history.push( "/" ) }>Quran</HeaderTitle>
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
          <IconButton
            onClick={ () => toggleRightMenu( ! isRightMenuOpen ) }
            onMouseOut={ () => closePopover( "selectedAyahs" ) }
            onMouseOver={ ( event ) => openPopover( "selectedAyahs", event ) }
          >
            <StyledTaskIcon />
          </IconButton>
          {
            <QPopper
              anchorEl={ popoverMap[ "selectedAyahs" ] }
              open={ Boolean( popoverMap[ "selectedAyahs" ] ) }
              text="View your select ayahs"
            />
          }
          {
            Object.keys( selectedAyahs ).length !== 0 && (
              <HeaderActionIconIndicator />
            )
          }
        </HeaderActionIconContainer>
      </HeaderContainer>
      <SwipeableDrawer onClose={ () => toggleLeftMenu( false ) } onOpen={ () => toggleLeftMenu( true ) } open={ isLeftMenuOpen } >
        <MenuContainer>
          <MenuTitleContainer>
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
      </SwipeableDrawer>
    </React.Fragment>
  )
}

export const QHeader = memo( QHeaderFunction )
