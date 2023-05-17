import React from 'react';
import Login from '@components/Login';
import { AuthContext } from '@context/authContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '@config/firebase';
import { menus } from '@config/routes';
import SideBar from '@components/SideBar';
import NotFound from '@pages/notFound';

function App() {
  const userInfo = React.useContext(AuthContext);
  const menuList = Object.values(menus);

  if (!userInfo) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Button variant="contained" onClick={() => signOut(auth)}>
          임시 로그아웃
        </Button>
        <Routes>
          {menuList.map((menu, index) => (
            <Route key={index} path={menu.path} element={<menu.component />} />
          ))}
          <Route path="/notFound" element={<NotFound />} />
          <Route
            path="/login"
            element={<Navigate replace to={menuList[0].path} />}
          />
          <Route path="*" element={<Navigate replace to="/notFound" />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
