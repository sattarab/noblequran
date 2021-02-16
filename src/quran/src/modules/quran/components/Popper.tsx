import Popper from "@material-ui/core/Popper"
import { makeStyles } from "@material-ui/core/styles"
import React, { memo } from "react"

import { DEFAULT_TEXT_COLOR } from "../../../components/Styles"

interface QPopperProps {
  anchorEl: Element | null
  id?: string
  open: boolean
  text: string
}

const useStyles = makeStyles( () => ( {
  paper: {
    background: `${ DEFAULT_TEXT_COLOR }`,
    borderRadius: "5px",
    color: "#ffffff",
    fontSize: "14px",
    padding: "8px",
  },
} ) )

const QPopperFunction: React.FunctionComponent<QPopperProps> = ( { anchorEl, id, open, text }: QPopperProps ) => {
  const classes = useStyles()

  return (
    <Popper
      anchorEl={ anchorEl }
      id={ id }
      open={ open }
    >
      <div className={ classes.paper }>{ text }</div>
    </Popper>
  )
}

export const QPopper = memo( QPopperFunction )
