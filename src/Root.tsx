import {
    Box,
    Paragraph
} from "grommet";

function Root() {
    return (
        <Box background="background-back" fill pad="medium" gap="medium">
            <Box width="medium" background="background-front" round='small'>
                <Box pad="medium">
                    <Paragraph>Ambire AdEx staging test</Paragraph>
                </Box>

            </Box>
        </Box>
    );
}

export default Root;
