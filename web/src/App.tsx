import 'react';
import {CssVarsProvider} from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';

import Sidebar from './components/Sidebar';
import OrderTable from './components/OrderTable';
import Header from './components/Header';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Application} from "./pages/usage/Application.tsx";

export default function App() {
    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline/>
            <BrowserRouter basename={"/static"}>
                <Box sx={{display: 'flex', minHeight: '100dvh'}}>
                    <Header/>
                    <Sidebar/>
                    <Box
                        component="main"
                        className="MainContent"
                        sx={{
                            px: {xs: 2, md: 6},
                            pt: {
                                xs: 'calc(12px + var(--Header-height))',
                                sm: 'calc(12px + var(--Header-height))',
                                md: 3,
                            },
                            pb: {xs: 2, sm: 2, md: 3},
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            minWidth: 0,
                            height: '100dvh',
                            gap: 1,
                        }}
                    >
                        <Routes>
                            <Route path='/' element={<OrderTable/>}/>
                            <Route path='/usage/application' element={<Application/>}/>
                        </Routes>


                    </Box>
                </Box>
            </BrowserRouter>
        </CssVarsProvider>
    );
}