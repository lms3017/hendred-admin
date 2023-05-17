import React from 'react';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { menus } from '@config/routes';
import { NavLink } from 'react-router-dom';

function SideBar() {
  const menuList = Object.values(menus);
  const sideBarWidth = '240px';

  return (
    <>
      <Drawer
        sx={{
          width: sideBarWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sideBarWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {menuList.map((menu, index) => (
            <NavLink
              key={index}
              to={menu.path}
              style={({ isActive }) => ({
                display: 'block',
                color: '#2b2b2b',
                textDecoration: 'none',
                background: isActive ? '#f1f1f1' : '',
              })}
            >
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <menu.menuIcon />
                  </ListItemIcon>
                  <ListItemText primary={menu.menuName} />
                </ListItemButton>
              </ListItem>
            </NavLink>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default SideBar;
