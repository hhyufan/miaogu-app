import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Demo from "@/components/Demo.jsx";
import {useState} from "react";
import AuthForm from "@/pages/AuthForm.jsx";
import {Box, Center} from "@chakra-ui/react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogin = () => {
        // localStorage.setItem('authToken', token);
        setIsLoggedIn(true);
    };
  return (
      <Center minH="100vh" p={4}>
          <Box
              aspectRatio={9 / 16}
              maxW="400px"
              w="100%"
              bg="#fff"
              borderRadius="lg"
              boxShadow="md"
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
