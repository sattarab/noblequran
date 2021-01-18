import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import { withStyles } from "@material-ui/core/styles"
import MenuItem from "@material-ui/core/MenuItem"
import Select, { SelectProps } from "@material-ui/core/Select"
import TextField from "@material-ui/core/TextField"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import React, { useState } from "react"
import styled from "styled-components"

import { ArrowDownIcon, ArrowRightIcon, FavoriteIcon, GridIcon, ListIcon } from "../../../components/Icon"
import { BACKGROUND_COLOR, BORDER_COLOR, DEFAULT_TEXT_COLOR, DISABLED_TEXT_COLOR } from "../../../components/Styles"
import { escapeRegex } from "../../../helpers/utility"
import { getSurahs } from "../services/surah"
import { Option } from "../../../types/option"
import { Surah } from "../../../types/surah"

const HomePageClearFiltersButton = styled.button`
  background: ${ BORDER_COLOR };
  border: 2px solid ${ BORDER_COLOR };
  border-radius: 20px;
  color: ${ DISABLED_TEXT_COLOR };
  cursor: pointer;
  height: 32px;
  font-size: 14px;
  padding: 0 15px;
`

const HomePageContainer = styled.div`
`

const HomePageContentAdditionalOptionsContainer = styled.div`
  align-items: center;
  border-bottom: 1px solid ${ BORDER_COLOR };
  display: flex;
  height: 100px;
  justify-content: space-between;
  padding: 0 30px;
`

const HomePageContentOptionContainer = styled.div`
  height: 64px;
`

const HomePageContentOptionLabel = styled.div`
  font-family: "GothamRounded";
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 10px;
`

const HomePageContentSelectContainer = styled.div`
`

const HomePageContentSortOptionContainer = styled.div`
  width: 200px;
`

const HomePageContentViewOptionsContainer = styled.div`
  align-items: center;
  display: flex;
`

const HomePageContentViewOptionContainer = styled.div`
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 15px;

  & + & {
    margin-left: 20px;
  }
`

const HomePageContentViewOptionContainerLabel = styled.div`
  margin-left: 5px;
`

const HomePageContentContainer = styled.div`
  background: ${ BACKGROUND_COLOR };
  flex: 1;
`

const HomePageContentHeaderContainer = styled.div`
  align-items: center;
  border-bottom: 1px solid ${ BORDER_COLOR };
  display: flex;
  height: 60px;
  justify-content: space-between;
  padding: 0 30px;
`

const HomePageContentHeaderSelectionContainer = styled.div`
  display: flex;
  flex: 0 1 auto;
`

const HomePageContentHeaderSelectOption = styled.div`
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 15px;

  & + & {
    margin-left: 20px;
  }
`

const HomePageFilterClearButtonContainer = styled.div`
  align-items: center;
  border-bottom: 1px solid ${ BORDER_COLOR };
  display: flex;
  height: 60px;
  justify-content: center;
`

const HomePageFilterContainer = styled.div.attrs( props => ( {
  className: props.className,
} ) )`
  border-bottom: 1px solid ${ BORDER_COLOR };
  padding: 10px 30px;

  &.filter--closed:hover {
    background-color: #f1f1f1;
  }
`

const HomePageFilterLabel = styled.div`
  flex: 1 0 auto;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
`

const HomePageFilterLabelContainer = styled.div`
  align-items: center;
  color: #333333;
  cursor: pointer;
  display: flex;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
`

const HomePageFilterLabelIcon = styled.div`
  fill: #666666;
`

const HomePageFilterOptionsContainer = styled.div`
`

const HomePageSideContainer = styled.div`
  width: 340px;
`

const HomePageMainContainer = styled.div`
  border-top: 1px solid ${ BORDER_COLOR };
  display: flex;
  min-height: 100%;
  width: 100%;
  max-width: 100%;
`

const HomePageSearchFieldContainer = styled.div`
  margin: 10px 0;
`

const HomePageSurahsContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 15px 0 15px 15px;
`

const HomePageSurahGridContainer = styled.div`
  box-sizing: border-box;
  flex: 0 1 33%;
  height: 338px;
  padding: 15px;
`

const HomePageSurahGridInnerContainer = styled.div`
  border: 1px solid ${ BORDER_COLOR };
  border-radius: 8px;
  cursor: pointer;
  height: 100%;

  &:hover {
    border: 1px solid ${ DEFAULT_TEXT_COLOR };
  }
`

const HomePageSurahGridTitleContainer = styled.div`
  align-items: center;
  background: #ffffff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 150px;
  justify-content: center;
`

const HomePageSurahGridTitleText = styled.div`
  font-family: "QuranKarim";
  font-size: 110px;
`

const HomePageSurahGridDetailsContainer = styled.div`
  border-bottom: 1px solid ${ BORDER_COLOR };
  display: flex;
  padding: 15px;
  flex-direction: column;
`

const HomePageSurahGridFooterContainer = styled.div`
  align-items: flex-end;
  box-sizing: border-box;
  display: flex;
  height: 85px;
  justify-content: space-between;
  padding: 15px;
`

const HomePageSurahGridDetailsText = styled.div`
  font-size: 14px;
  font-weight: 500;
  padding-top: 5px;
`

const HomePageSurahFavoriteContainer = styled.div`
`

const HomePageSurahGridReadSurahButton = styled.button`
  background: ${ BACKGROUND_COLOR };
  border: 2px solid ${ DEFAULT_TEXT_COLOR };
  border-radius: 25px;
  color: ${ DEFAULT_TEXT_COLOR };
  cursor: pointer;
  height: 32px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px;

  &:hover {
    background: ${ DEFAULT_TEXT_COLOR };
    border-bottom: 1px solid ${ BORDER_COLOR };
    color: #ffffff;
  }
`

const HomePageSurahGridTranslatedText = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-top: -30px;
`

const HomePageSurahGridTransliteratedText = styled.div`
  font-size: 16px;
  font-weight: 700;
`

const HomePageToggleFiltersButton = styled.button`
  background: ${ BACKGROUND_COLOR };
  border: 2px solid ${ DEFAULT_TEXT_COLOR };
  border-radius: 25px;
  color: ${ DEFAULT_TEXT_COLOR };
  cursor: pointer;
  height: 32px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px;

  &:hover {
    background: ${ DEFAULT_TEXT_COLOR };
    border-bottom: 1px solid ${ BORDER_COLOR };
    color: #ffffff;
  }
`

const StyledFormControlLabel = withStyles( {
  label: {
    fontSize: "13px",
    fontWeight: 400,
  },
} )( FormControlLabel )

const StyledMenuItem = withStyles( {
  root: {
    fontSize: "14px",
  },
} )( MenuItem )

// eslint-disable-next-line space-in-parens
const StyledSelect = styled(Select)`
  .MuiSelect-outlined.MuiSelect-outlined {
    font-size: 14px;
    padding: 10px;
  }
`

// eslint-disable-next-line space-in-parens
const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    font-size: 14px;
  }

  .MuiInputLabel-outlined {
    transform: translate( 6px, 14px ) scale( 1 );
  }

  .MuiOutlinedInput-input {
    padding: 12px;
  }

  .MuiInputLabel-root {
    font-size: 14px;

    &.Mui-focused {
      font-size: 16px;
      font-weight: 500;
    }
  }
`

enum RevelationType {
  JUZ = "juz",
  SURAH = "surah"
}

enum ViewType {
  GRID = "grid",
  LIST = "list",
}

export const Home: React.FunctionComponent = () => {
  const [ filterToggleMap, setFilterToggleMap ] = useState<{ [ key: string ]: boolean }>( { "favorites": true, "revelationType": true } )
  const [ displayFilterSection, setDisplayFilterSection ] = useState<boolean>( true )
  const [ selectedRevelationType, setSelectedRevelationType ] = useState<RevelationType>( RevelationType.SURAH )
  const [ selectViewType, setSelectedViewType ] = useState<ViewType>( ViewType.GRID )
  const [ surahs, setSurahs ] = useState<Surah[]>( getSurahs() )

  const sortOptions: Array<Option<string>> = [
    {
      label: "Book Order",
      value: "book",
    },
    {
      label: "Revelation Order",
      value: "revelation",
    },
    {
      label: "Alphabetically",
      value: "alphabetically",
    },
  ]

  let regex: RegExp | null

  const filterSurahs = () => {
    console.log( "regex", regex )
    if( ! regex ) {
      setSurahs( getSurahs() )
      return
    }

    const filteredSurahs: Surah[] = []

    for( const surah of getSurahs() ) {
      if( regex ) {
        for( const queryIndex of surah.query_indexes ) {
          if( regex.test( queryIndex ) ) {
            filteredSurahs.push( surah )
            break
          }
        }
      }
    }

    setSurahs( filteredSurahs )
  }

  const getSelectedRevelationTypeStyles = ( type: string ): React.CSSProperties => {
    if( type !== selectedRevelationType ) {
      return {}
    }

    return {
      background: BORDER_COLOR,
      fontWeight: 700,
    }
  }

  const getSelectedViewTypeStyles = ( type: string ): React.CSSProperties => {
    if( type !== selectViewType ) {
      return {}
    }

    return {
      background: BORDER_COLOR,
      fontWeight: 700,
    }
  }

  const onSearch = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    console.log( "event.target.value", event.target.value )
    regex = event.target.value ? new RegExp( escapeRegex( event.target.value ), "i" ) : null
    filterSurahs()
  }

  const onSort = ( event: React.ChangeEvent<SelectProps> ) => {
    switch( event.target.value ) {
    }
  }

  const toggleDisplayFilterOptions = ( key: string ) => {
    const updatedFilterToggleMap = {
      ...filterToggleMap,
    }
    updatedFilterToggleMap[ key ] = ! filterToggleMap[ key ]
    setFilterToggleMap( updatedFilterToggleMap )
  }

  const toggleDisplayFilterSection = () => {
    setDisplayFilterSection( ! displayFilterSection )
  }

  return (
    <HomePageContainer>
      <HomePageMainContainer>
        {
          displayFilterSection && (
            <HomePageSideContainer>
              <HomePageFilterClearButtonContainer>
                <HomePageClearFiltersButton>Clear Filters</HomePageClearFiltersButton>
              </HomePageFilterClearButtonContainer>
              <HomePageFilterContainer>
                <HomePageSearchFieldContainer>
                  <StyledTextField fullWidth label="Search" variant="outlined" onChange={ onSearch } />
                </HomePageSearchFieldContainer>
              </HomePageFilterContainer>
              <HomePageFilterContainer className={ ! filterToggleMap[ "favorites" ] ? "filter--closed": "" }>
                <HomePageFilterLabelContainer onClick={ () => toggleDisplayFilterOptions( "favorites" ) }>
                  <HomePageFilterLabel>Favorites</HomePageFilterLabel>
                  <HomePageFilterLabelIcon>
                    {
                      filterToggleMap[ "favorites" ]
                      ? <ArrowDownIcon />
                      : <ArrowRightIcon />
                    }
                  </HomePageFilterLabelIcon>
                </HomePageFilterLabelContainer>
                {
                  filterToggleMap[ "favorites" ] && (
                    <StyledFormControlLabel control={ <Checkbox name="favorites" /> } label="My favorites" />
                  )
                }
              </HomePageFilterContainer>
              <HomePageFilterContainer className={ ! filterToggleMap[ "revelationType" ] ? "filter--closed": "" }>
                <HomePageFilterLabelContainer onClick={ () => toggleDisplayFilterOptions( "revelationType" ) }>
                  <HomePageFilterLabel>Revelation Type</HomePageFilterLabel>
                  <HomePageFilterLabelIcon>
                    {
                      filterToggleMap[ "revelationType" ]
                      ? <ArrowDownIcon />
                      : <ArrowRightIcon />
                    }
                  </HomePageFilterLabelIcon>
                </HomePageFilterLabelContainer>
                {
                  filterToggleMap[ "revelationType" ] && (
                    <HomePageFilterOptionsContainer>
                      <RadioGroup aria-label="type" name="type" >
                        <StyledFormControlLabel control={<Radio size="small" />} label="All" value="all" />
                        <StyledFormControlLabel control={<Radio size="small" />} label="Meccan" value="meccan" />
                        <StyledFormControlLabel control={<Radio size="small" />} label="Medinan" value="medinan" />
                      </RadioGroup>
                    </HomePageFilterOptionsContainer>
                  )
                }
              </HomePageFilterContainer>
            </HomePageSideContainer>
          )
        }
        <HomePageContentContainer>
          <HomePageContentHeaderContainer>
            <HomePageToggleFiltersButton onClick={ toggleDisplayFilterSection }>{ displayFilterSection ? "Hide" : "Show" } Filters</HomePageToggleFiltersButton>
            <HomePageContentHeaderSelectionContainer>
              <HomePageContentHeaderSelectOption onClick={ () => setSelectedRevelationType( RevelationType.SURAH ) } style={ getSelectedRevelationTypeStyles( RevelationType.SURAH ) }>Surah</HomePageContentHeaderSelectOption>
              <HomePageContentHeaderSelectOption onClick={ () => setSelectedRevelationType( RevelationType.JUZ ) } style={ getSelectedRevelationTypeStyles( RevelationType.JUZ ) }>Juz</HomePageContentHeaderSelectOption>
            </HomePageContentHeaderSelectionContainer>
          </HomePageContentHeaderContainer>
          <HomePageContentAdditionalOptionsContainer>
            <HomePageContentOptionContainer>
              <HomePageContentOptionLabel>View</HomePageContentOptionLabel>
              <HomePageContentViewOptionsContainer>
                <HomePageContentViewOptionContainer onClick={ () => setSelectedViewType( ViewType.GRID ) } style={ getSelectedViewTypeStyles( ViewType.GRID ) }>
                  <GridIcon />
                  <HomePageContentViewOptionContainerLabel>Grid</HomePageContentViewOptionContainerLabel>
                </HomePageContentViewOptionContainer>
                <HomePageContentViewOptionContainer onClick={ () => setSelectedViewType( ViewType.LIST ) } style={ getSelectedViewTypeStyles( ViewType.LIST ) }>
                  <ListIcon />
                  <HomePageContentViewOptionContainerLabel>List</HomePageContentViewOptionContainerLabel>
                </HomePageContentViewOptionContainer>
              </HomePageContentViewOptionsContainer>
            </HomePageContentOptionContainer>
            <HomePageContentSortOptionContainer>
              <HomePageContentOptionLabel>Sort</HomePageContentOptionLabel>
              <HomePageContentSelectContainer>
                <StyledSelect defaultValue="book" fullWidth variant="outlined" onChange={ onSort }>
                  {
                    sortOptions.map( ( sortOption ) => (
                      <StyledMenuItem key={ sortOption.value } value={ sortOption.value }>{ sortOption.label }</StyledMenuItem>
                    ) )
                  }
                </StyledSelect>
              </HomePageContentSelectContainer>
            </HomePageContentSortOptionContainer>
          </HomePageContentAdditionalOptionsContainer>
          <HomePageSurahsContentContainer>
            {
              selectViewType === ViewType.GRID
              ? (
                surahs.map( ( surah ) => (
                  <HomePageSurahGridContainer key={ surah.id }>
                    <HomePageSurahGridInnerContainer>
                      <HomePageSurahGridTitleContainer>
                        <HomePageSurahGridTitleText dangerouslySetInnerHTML={ { __html: surah.unicode || surah.name } } />
                        <HomePageSurahGridTranslatedText>{ surah.translations[ 0 ].text }</HomePageSurahGridTranslatedText>
                      </HomePageSurahGridTitleContainer>
                      <HomePageSurahGridDetailsContainer>
                        <HomePageSurahGridTransliteratedText>{ surah.number } &#8226; { surah.transliterations[ 0 ].text }</HomePageSurahGridTransliteratedText>
                        <HomePageSurahGridDetailsText>{ surah.number_of_ayahs } verses &#8226; { surah.revelation.place }</HomePageSurahGridDetailsText>
                      </HomePageSurahGridDetailsContainer>
                      <HomePageSurahGridFooterContainer>
                        <HomePageSurahFavoriteContainer>
                          <FavoriteIcon />
                        </HomePageSurahFavoriteContainer>
                        <HomePageSurahGridReadSurahButton>Read</HomePageSurahGridReadSurahButton>
                      </HomePageSurahGridFooterContainer>
                    </HomePageSurahGridInnerContainer>
                  </HomePageSurahGridContainer>
                ) )
              ) : (
                <div>List</div>
              )
            }
          </HomePageSurahsContentContainer>
        </HomePageContentContainer>
      </HomePageMainContainer>
    </HomePageContainer>
  )
}