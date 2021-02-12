import React, { memo } from "react"
import styled from "styled-components"

const LoaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;

  > div {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    margin: 10px;
    background-image: linear-gradient( 145deg, rgba( 255, 255, 255, 0.5 ) 0%, rgba( 0, 0 ,0 ,0 ) 100% );
  }
`

const LoaderYellowDot = styled.div`
  animation: bounce 1.5s 0s linear infinite;
  background: #feb60a;
`

const LoaderRedDot = styled.div`
  animation: bounce 1.5s 0.1s linear infinite;
  background: #ff0062;
`

const LoaderBlueDot = styled.div`
  animation: bounce 1.5s 0.2s linear infinite;
  background-color: #00dbf9;
`

const LoaderVioletDot = styled.div`
  animation: bounce 1.5s 0.3s linear infinite;
  background: #da00f7;
`

const QLoaderFunction: React.FunctionComponent = () => {
  return (
    <LoaderContainer>
      <LoaderYellowDot />
      <LoaderRedDot />
      <LoaderBlueDot />
      <LoaderVioletDot />
    </LoaderContainer>
  )
}

export const QLoader = memo( QLoaderFunction )
