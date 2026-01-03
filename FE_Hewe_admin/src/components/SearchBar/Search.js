import React from 'react'
import { FaSearch } from 'react-icons/fa';
import { SearchContainer, SearchBar, SearchIcon, SearchInput } from './SearchElements'
// import IconSearch from '../SvgElements'

export default function Search(props) {
    // const {error,type} = props;
    // const [showPassword,setShowPassword] = useState(false)
    return (
        <>
            <SearchContainer>
                <SearchBar>
                    <SearchIcon>
                        <FaSearch style={{color:"#666666"}}/>
                        {/*<SearchIconn color="#000000" style={{fontWeight:"200"}}/>*/}
                       {/*<IconSearch/>*/}
                    </SearchIcon>
                    <SearchInput type="text" placeholder="Search">
                    </SearchInput>
                </SearchBar>
            </SearchContainer>
        </>
    );
}

//         <div className="Search">
//             <span className="SearchSpan">
//                 <FaSearch />
//             </span>
//             <input
//                 className="SearchInput"
//                 type="text"
//                 // onChange={onChange}
//                 placeholder="Search"
//             />
// </div>