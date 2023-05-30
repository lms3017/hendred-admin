import React from 'react';
import {
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { menus } from '@config/routes';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@config/firebase';

function SideBar() {
  const theme = useTheme();
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
        <Stack sx={{ mt: 6 }} height="100%" justifyContent="space-between">
          <List>
            {menuList.map((menu, index) => (
              <NavLink
                key={index}
                to={menu.path}
                style={({ isActive }) => ({
                  display: 'block',
                  color: theme.palette.text.primary,
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
          <Button variant="contained" sx={{ m: 4 }} onClick={() => signOut(auth)}>
            로그아웃
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}

export default SideBar;
