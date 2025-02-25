import { AspectRatio, Box, Flex, Image, Field, Input, Text, Button } from "@chakra-ui/react";
import image1Src from '@/assets/01.jpg';
import image2Src from '@/assets/02.jpg';
import styled from 'styled-components';
import { PasswordInput } from "@/components/ui/password-input.jsx";

const Container = styled.div`
    background-color: #fff;
    padding: 60px;
    position: relative; /* 设置容器为相对定位 */
    height: 100vh; /* 设置容器高度为视口高度 */
`;

const StyledInput = styled(Input)`
    border: none;
    background-color: #fafafa;
    color: #3f3f46;

    &:hover {
        border: none;
    }

    &:focus {
        border: none;
    }
`;

const StyledPasswordInput = styled(PasswordInput)`
    border: none;
    background-color: #fafafa;
    color: #3f3f46;

    &:hover {
        border: none;
    }

    &:focus {
        border: none;
    }
`;

const FieldLabel = styled(Field.Label)`
    color: #71717a;
`

const LinkTip = styled(Text)`
    text-align: center;
    color: #71717a;
    font-size: 12px;
`

const AuthFrom = ({onLogin}) => {
    const handleClick = () => {
        onLogin()
    };
    const authModel = 0;
    const imageSrc = authModel ? image1Src : image2Src;

    return (
        <Container>
            <Flex gap="3" direction="column">
                <Box>
                    <AspectRatio ratio={1}>
                        <Image src={imageSrc} alt="naruto" objectFit="cover" />
                    </AspectRatio>
                </Box>
                <Box mt="40px">
                    <Field.Root gap="20px">
                        <FieldLabel> 用户名 / 邮箱 </FieldLabel>
                        <StyledInput placeholder="hhyufan | hhyufan@gmail.com" />
                        <FieldLabel> 密码 </FieldLabel>
                        <StyledPasswordInput placeholder="••••••" />
                    </Field.Root>
                </Box>
                <Box mt="40px">
                    <LinkTip>
                        没有账号？去注册
                    </LinkTip>
                    <Button
                        onClick={handleClick}
                        mt="10px"
                        size="sm" // 设置按钮大小
                        rounded="lg"
                        color="#fff"
                        backgroundColor="#ffb600" // 设置背景颜色
                        width="100%" // 按钮宽度填满父容器
                    >
                        登录
                    </Button>
                </Box>
            </Flex>
        </Container>
    );
}

export default AuthFrom
