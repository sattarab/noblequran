import React from "react"
import styled from "styled-components"

const BookmarksPageHeader = styled.h1`
`

const BookmarksPageContainer = styled.div`
`

export const BookmarksPage: React.FunctionComponent = () => {
  return (
    <BookmarksPageContainer>
      <BookmarksPageHeader></BookmarksPageHeader>
    </BookmarksPageContainer>
  )
}
