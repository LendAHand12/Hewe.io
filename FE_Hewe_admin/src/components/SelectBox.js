import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Select from 'react-select'
import Creatable from 'react-select/creatable'
import InputsLabel from './InputsLabel'

const Wrapper = styled.div`
  margin-bottom: 14px;
  width: 100%;
  .css-1hwfws3 {
    padding: 6px 8px !important;
  }
  .css-4ljt47-MenuList {
    > div {
      padding: 12px !important;
    }
  }
`

function SelectBox({ label, creatable, wrapperStyle, ...props }) {
  const themeContext = useContext(ThemeContext)
  return (
    <Wrapper css={wrapperStyle}>
      <InputsLabel label={label} />
      {creatable ? (
        <Creatable
          theme={theme => {
            return {
              ...theme,
              borderRadius: 5,
              colors: {
                ...theme.colors,
                primary25: '#ddd',
                primary: themeContext.primary
              }
            }
          }}
          {...props}
        />
      ) : (
        <Select
          theme={theme => {
            return {
              ...theme,
              borderRadius: 5,
              colors: {
                ...theme.colors,
                primary25: '#ddd',
                // primary: themeContext.primary
              }
            }
          }}
          {...props}
        />
      )}
    </Wrapper>
  )
}

export default SelectBox
