import { Text, Center, HStack } from "@chakra-ui/react"
import {useSelector} from "react-redux";
import styled from "styled-components";
const Container = styled.div`
    user-select: none;
`;
const Demo = () => {
    const username = useSelector(state => state.user.username);
    return (
        <Container>
            <Center flexDir="column" gap="8" minH="dvh">
                <HStack>
                    <Text color="black"> Hello, {username}</Text>
                </HStack>
            </Center>
        </Container>
    )
}

export default Demo
