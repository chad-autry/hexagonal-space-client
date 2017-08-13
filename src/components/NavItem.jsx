import { Link, Route } from 'react-router-dom';
import React from 'react';

const NavItem  = ({ to, ...rest }) => (
    <Route path={to} children={({ match }) => (
        <li className={match ? 'active' : ''}>
            <Link to={to} children={rest.children}/>
        </li>
    )}/>
);

export default NavItem;