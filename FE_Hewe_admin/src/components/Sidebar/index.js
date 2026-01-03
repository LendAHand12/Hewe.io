import React from 'react'
import { SidebarContainer, Icon, CloseIcon, SidebarWrapper, SidebarMenu, SidebarLink, SideBtnWrap, SidebarRoute } from './SidebarElements'


const Sidebar = ({isOpen, toggle}) => {
    return (
        <SidebarContainer isOpen={isOpen} onClick={toggle}>
            <Icon onClick={toggle}>
                <CloseIcon/>
            </Icon>
            <SidebarWrapper>
                <SidebarMenu>
                    <SidebarLink to="products">
                        Products
                    </SidebarLink>
                    <SidebarLink to="add_a_restaurant">
                        Add a Restaurant
                    </SidebarLink>
                    <SidebarLink to="contact">
                        Contact Us
                    </SidebarLink>
                </SidebarMenu>
                <SideBtnWrap>
                    <SidebarRoute primary="true" to="/signin">
                        Login
                    </SidebarRoute>
                    <SidebarRoute to="/signin">
                        Create Account
                    </SidebarRoute>
                </SideBtnWrap>
            </SidebarWrapper>
        </SidebarContainer>
    )
}

export default Sidebar
