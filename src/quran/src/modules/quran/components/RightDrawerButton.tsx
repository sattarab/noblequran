import styled from "@emotion/styled"
import IconButton from "@material-ui/core/IconButton"
import clsx from "clsx"
import React, { memo, useCallback, useState } from "react"

import { AddTaskIcon } from "../../../components/Icon"
import { BLUE_COLOR_WITH_OPACITY } from "../../../components/Styles"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { toggleIsRightDrawerOpen } from "../state/quran"
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

const QRightDrawerButtonFunction: React.FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const isRightDrawerOpen = useAppSelector( ( state ) => state.quran.isRightDrawerOpen )
  const selectedAyahs = useAppSelector( ( state ) => state.quran.selectedAyahs )

  const { baseClasses, isMobileDevice } = useQuranState()
  const [ displayPopover, setDisplayPopover ] = useState<Element | null>( null )

  const closePopover = () => {
    setDisplayPopover( null )
  }

  const openPopover = ( event: React.MouseEvent<HTMLSpanElement> ) => {
    setDisplayPopover( event.currentTarget )
  }

  const toggleRightMenu = useCallback( () => {
    dispatch( toggleIsRightDrawerOpen() )
  }, [ dispatch ] )

  return (
    <RightDrawerButtonContainer>
      <RightDrawerButton
        onClick={ toggleRightMenu }
        onMouseOut={ closePopover }
        onMouseOver={ openPopover }
        className={ clsx( { "active": isRightDrawerOpen } ) }
      >
        <AddTaskIcon className={ clsx( baseClasses.svgIcon, { [ baseClasses.svgIconActive ]: isRightDrawerOpen } ) } />
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
