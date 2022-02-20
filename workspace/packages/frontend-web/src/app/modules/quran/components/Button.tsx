import styled from "@emotion/styled"
import Button from "@material-ui/core/Button"
import clsx from "clsx"
import PropTypes from "prop-types"
import React from "react"

import { BLUE_COLOR, BLUE_COLOR_WITH_OPACITY, DEFAULT_TEXT_COLOR, DEFAULT_TEXT_COLOR_WITH_OPACITY, WHITE_SMOKE_COLOR } from "../../../components/Styles"

const ButtonContainer = styled( Button )`
  border-radius: 5px;
  cursor: pointer;
  font: 500 15px/15px "HarmoniaSansPro";
  padding: 10px 15px;
  text-align: left;
  text-transform: none;

  .MuiButton-label {
    color: ${ DEFAULT_TEXT_COLOR };
  }

  &:hover {
    background-color: ${ WHITE_SMOKE_COLOR };
  }

  &.active,
  &.secondary {
    .MuiButton-label {
      color: ${ BLUE_COLOR };
    }

    &:hover {
      background: ${ BLUE_COLOR_WITH_OPACITY };
    }
  }

  &:disabled {
    .MuiButton-label {
      color: ${ DEFAULT_TEXT_COLOR_WITH_OPACITY };
    }
  }
`

export interface QButtonProps {
  className?: string
  isActive?: boolean
  isDisabled?: boolean
  label: string
  style?: React.CSSProperties

  onClick?( event: React.MouseEvent<HTMLButtonElement, MouseEvent> ): void
}

export const QButton: React.FunctionComponent<QButtonProps> = ( { className, isActive, isDisabled, label, onClick, style } ) => {
  const onClickHandler = ( event: React.MouseEvent<HTMLButtonElement, MouseEvent> ): void => {
    if( onClick ) {
      return onClick( event )
    }
  }
  return (
    <ButtonContainer
      className={ clsx( className, { "active": isActive } ) }
      disabled={ isDisabled }
      onClick={ onClickHandler }
      style={ style }
    >
      { label }
    </ButtonContainer>
  )
}

QButton.propTypes = {
  className: PropTypes.string,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.objectOf( PropTypes.string ),
}
