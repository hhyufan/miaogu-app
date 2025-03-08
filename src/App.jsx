import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { useState, useEffect } from "react";
import AuthForm from "@/pages/AuthForm.jsx";
import { Box, Center, useBreakpointValue } from "@chakra-ui/react";
import ChatLayout from "@/pages/ChatLayout.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setIsLoggedIn} from "@/store/store.js";
import {initEdgeConfig} from "@/api/index.js";

// 设备检测函数
const isDesktopDevice = () => {
    if (typeof window === 'undefined') return false; // SSR处理

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
    const isDesktop = /(macintosh|macintel|macppc|mac68k|windows|win32|win64|linux)/i.test(userAgent);

    // 当在桌面环境且不是移动设备模拟时返回true
    return isDesktop && !isMobile;
};


function App() {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };
        initEdgeConfig().catch(

        )
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn); // 从 Redux store 获取登录状态
    const dispatch = useDispatch(); // 获取 dispatch 函数
    // 调试模式判断（开发环境 + 桌面设备）
    const isDebugMode = isDesktopDevice();

    // 响应式配置
    const containerStyles = useBreakpointValue({
        base: { // 移动端实际运行样式
            w: "100%",
            h: windowHeight,
        },
        md: isDebugMode ? { // 仅在PC调试时应用的样式
            w: "375px",
            h: "667px",
            my: 8,
            boxShadow: "xl",
            borderRadius: "20px",
        } : { // 非调试模式保持移动样式
            w: "100%",
            h: windowHeight
        }
    });

    const handleLogin = () => {
        dispatch(setIsLoggedIn(true))
    };

    // 调试模式热键监听
    useEffect(() => {
        if (!isDebugMode) return;

        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.key === 'd') {
                document.documentElement.classList.toggle('debug-outline');
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [isDebugMode]);

    return (
        <Center
            minH={windowHeight}
            p={0}
            bg={isDebugMode ? "gray.50" : "white"}
            _before={isDebugMode ? {
                content: '"Mobile Preview (Debug Mode)"',
                position: "fixed",
                top: 2,
                left: "50%",
                transform: "translateX(-50%)",
                color: "gray.400",
                fontSize: "sm",
                zIndex: 9999
            } : undefined}
        >
            <Box
                {...containerStyles}
                position="relative"
                overflow="hidden"
                bg="white"
                transition="all 0.2s"
            >
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isLoggedIn ? (
                                    <ChatLayout />
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
