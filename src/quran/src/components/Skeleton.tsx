import styled from "@emotion/styled"
import PropTypes from "prop-types"
import React, { memo } from "react"

const SkeletonPulse = styled.div`
  animation: pulse 1.2s ease-in-out infinite;
  background: linear-gradient( -90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100% );
  background-size: 400% 400%;
  display: inline-block;
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

interface QSkeletonProps {
  style: React.CSSProperties
}

const QSkeletonFunction: React.FunctionComponent<QSkeletonProps> = ( { style } ) => {
  return <SkeletonPulse style={ style } />
}

QSkeletonFunction.propTypes = {
  style: PropTypes.objectOf( PropTypes.string ).isRequired,
}

export const QSkeleton = memo( QSkeletonFunction )
