import styled from "@emotion/styled"
import React, { memo } from "react"

const SkeletonPulse = styled.div`
  animation: pulse 1.2s ease-in-out infinite;
  background: linear-gradient( -90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100% );
  background-size: 400% 400%;
  display: inline-block;
  height: 10px;
  width: 100%;

  @keyframes pulse {
    0% {
      background-position: 0% 0%;
    }
    100% {
      background-position: -135% 0%;
    }
  }
`


const QSkeletonFunction: React.FunctionComponent = () => {
  return <SkeletonPulse />
}

export const QSkeleton = memo( QSkeletonFunction )
