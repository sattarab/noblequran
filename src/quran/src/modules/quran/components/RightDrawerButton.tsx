import IconButton from "@material-ui/core/IconButton"
import clsx from "clsx"
import React, { memo, useCallback, useState } from "react"
import styled from "styled-components"

import { AddTaskIcon } from "../../../components/Icon"
import { BLUE_COLOR, BLUE_COLOR_WITH_OPACITY, DEFAULT_TEXT_COLOR } from "../../../components/Styles"
import { QPopper } from "./Popper"
import { useQuranState } from "./QuranContext"

const RightDrawerButtonContainer = styled.div`
  align-items: center;
  display: flex;
  position: relative;
`

const RightDrawerIndicator = styled.div`
  border-radius: 50%;
  background: #d93025;
  height: 6px;
  position: absolute;
  right: 4px;
  top: 10px;
  width: 6px;
`

const RightDrawerButton = styled( IconButton )`
  &.active {
    background: ${ BLUE_COLOR_WITH_OPACITY };
  }
`

const StyledTaskIcon = styled( AddTaskIcon )`
  fill: ${ DEFAULT_TEXT_COLOR };

  &.active {
    fill: ${ BLUE_COLOR };
  }
`

const QRightDrawerButtonFunction: React.FunctionComponent = () => {
  const { isMobileDevice, isRightDrawerOpen, selectedAyahs, setIsRightDrawerOpen } = useQuranState()
  const [ displayPopover, setDisplayPopover ] = useState<Element | null>( null )

  const closePopover = () => {
    setDisplayPopover( null )
  }

  const openPopover = ( event: React.MouseEvent<HTMLSpanElement> ) => {
    setDisplayPopover( event.currentTarget )
  }

  const toggleRightMenu = useCallback( ( open: boolean ) => {
    setIsRightDrawerOpen( open )
  }, [] )

  return (
    <RightDrawerButtonContainer>
      <RightDrawerButton
        onClick={ () => toggleRightMenu( ! isRightDrawerOpen ) }
        onMouseOut={ () => closePopover() }
        onMouseOver={ ( event ) => openPopover( event ) }
        className={ clsx( { "active": isRightDrawerOpen } ) }
      >
        <StyledTaskIcon className={ clsx( { "active": isRightDrawerOpen } ) } />
      </RightDrawerButton>
      {
        ( ! isMobileDevice || ! isRightDrawerOpen ) && (
          <QPopper
            anchorEl={ displayPopover }
            open={ Boolean( displayPopover ) }
            text="View your select ayahs"
          />
        )
      }
      {
        Object.keys( selectedAyahs ).length !== 0 && (
          <RightDrawerIndicator />
        )
      }
    </RightDrawerButtonContainer>
  )
}

export const QRightDrawerButton = memo( QRightDrawerButtonFunction )
