import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Demo from "@/components/Demo.jsx";
import {useState} from "react";
import AuthForm from "@/pages/AuthForm.jsx";
import { Box, Center } from "@chakra-ui/react";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <Center minH="100vh" p={0} bg="gray.100">
            <Box
                w="100%"
                maxW={{ base: "100%", md: "400px" }}
                minH="100vh"
                height="1px" // 用于触发高度继承
                bg="#fff"
                position="relative"
                overflowY="auto"
                css={{
                    "@media (orientation: landscape)": {
                        maxWidth: "100%",
                        minHeight: "auto"
                    }
                }}
            >
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isLoggedIn ? (
                                    <Demo />
                                ) : (
                                    <AuthForm onLogin={handleLogin} />
                                )
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </Box>
        </Center>
    )
}

export default App
