import styled from "@emotion/styled"
import Fab from "@material-ui/core/Fab"
import React, { memo, useCallback } from "react"

import { ScrollArrowUpIcon } from "../../../components/Icon"
import { WHITE_SMOKE_COLOR } from "../../../components/Styles"
import { MEDIUM_SCREEN_MEDIA_QUERY } from "../../../helpers/responsive"
import { useQuranState } from "./QuranContext"

const FabButton = styled( Fab )`
  bottom: 15px;
  height: 56px;
  position: fixed;
  right: 15px;
  width: 56px;

  &.MuiFab-root {
    background: ${ WHITE_SMOKE_COLOR };
  }

  @media ${ MEDIUM_SCREEN_MEDIA_QUERY } {
    bottom: 40px;
    right: 40px;
  }
`

const ScrollUpButtonFunction: React.FunctionComponent = () => {
  const { baseClasses } = useQuranState()

  const scrollUp = useCallback( () => {
    window.scrollTo( 0, 0 )
  }, [] )

  return (
    <FabButton onClick={ scrollUp }>
      <ScrollArrowUpIcon className={ baseClasses.svgIcon } />
    </FabButton>
  )
}

export const ScrollUpButton = memo( ScrollUpButtonFunction )
