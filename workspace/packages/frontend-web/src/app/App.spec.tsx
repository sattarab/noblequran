import { render } from "@testing-library/react"
import React from "react"

import App from "./App"

describe( "App", () => {
  it( "should render successfully", () => {
    const { baseElement } = render( <App /> )

    expect( baseElement ).toBeTruthy()
  } )

  it( "should have a greeting as the title", () => {
    const { getByText } = render( <App /> )

    expect( getByText( /The Noble Quran | القرآن الكريم/gi ) ).toBeTruthy()
  } )
} )
