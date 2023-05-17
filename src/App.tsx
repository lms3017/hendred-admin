import React from 'react';
import Login from '@components/Login';
import { AuthContext } from '@context/authContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '@config/firebase';
import PortfolioManager from '@pages/portfolioManager';
import MainPageManager from '@pages/mainPageManager';
import NodeManager from '@pages/nodeManager';
import ContentManager from '@pages/contentManager';
import NotFound from '@pages/notFound';

function App() {
  const userInfo = React.useContext(AuthContext);

  if (!userInfo) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      <div>사이드바</div>
      <Button variant="contained" onClick={() => signOut(auth)}>
        임시 로그아웃
      </Button>
      <Routes>
        <Route path="/" element={<PortfolioManager />} />
        <Route path="/PortfolioManager" element={<PortfolioManager />} />
        <Route path="/MainPageManager" element={<MainPageManager />} />
        <Route path="/NodeManager" element={<NodeManager />} />
        <Route path="/ContentManager" element={<ContentManager />} />
        <Route path="/NotFound" element={<NotFound />} />
        <Route
          path="/login"
          element={<Navigate replace to="/PortfolioManager" />}
        />
        <Route path="*" element={<Navigate replace to="/NotFound" />} />
      </Routes>
    </>
  );
}

export default App;
