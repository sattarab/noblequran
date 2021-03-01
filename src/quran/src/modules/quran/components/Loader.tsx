import React from "react"
import styled from "styled-components"

import { BLUE_COLOR } from "../../../components/Styles"

const LoaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;

  > div {
    border-radius: 100%;
    height: 20px;
    margin: 10px;
    width: 20px;
  }

  @keyframes bounce {
    0%, 50%, 100% {
      transform: scale( 1 ) ;
    }
    25% {
      transform: scale( 0.6 );
    }
    75% {
      transform: scale( 1.4 );
    }
  }
`

const LoaderFirstDot = styled.div`
  animation: bounce 1.5s 0s linear infinite;
  background: ${ BLUE_COLOR };
`

const LoaderSecondDot = styled.div`
  animation: bounce 1.5s 0.1s linear infinite;
  background: ${ BLUE_COLOR };
`

const LoaderThirdDot = styled.div`
  animation: bounce 1.5s 0.2s linear infinite;
  background: ${ BLUE_COLOR };
`

const LoaderFourthDot = styled.div`
  animation: bounce 1.5s 0.3s linear infinite;
  background: ${ BLUE_COLOR };
`

export const QLoader: React.FunctionComponent = () => {
  return (
    <LoaderContainer>
      <LoaderFirstDot />
      <LoaderSecondDot />
      <LoaderThirdDot />
      <LoaderFourthDot />
    </LoaderContainer>
  )
}
