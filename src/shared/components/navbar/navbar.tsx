import React from 'react'
import { NavbarContainer, NavbarInner, Links, NavItem, Brand } from './styles'
import { Link } from 'react-router-dom'
import { Button } from '@app/shared/components/button'
import { colors } from '@app/styles/styles'
const Navbar = () => {
  return (
    <NavbarContainer>
      <NavbarInner>
        <Brand>Zesti</Brand>
        <Links>
          <NavItem>
            <Link to="/">Mission</Link>
          </NavItem>
          <NavItem>
            <Link to="/">App</Link>
          </NavItem>
          <Link to="/">
            <Button
              padding="9px 37px 9px 37px"
              backgroundColor={colors.PRIMARY}
              borderRadius="30px"
              color="#fefefe"
              margin="0px 0px 0px 20px"
              fontSize="1.1rem !important"
            >
              Join Waitlist
            </Button>
          </Link>
        </Links>
      </NavbarInner>
    </NavbarContainer>
  )
}

export default Navbar
