import Breadcrumbs from "@mui/joy/Breadcrumbs";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import "react";
import Typography from "@mui/joy/Typography";

interface BreadcrumbProps {
    paths: string[][];
    current: string;
}

export default function Breadcrumb(props: BreadcrumbProps) {
    const paths = props.paths;
    const current = props.current;
    return <Breadcrumbs
        size="sm"
        aria-label="breadcrumbs"
        separator={<ChevronRightRoundedIcon fontSize="small"/>}
        sx={{pl: 0}}
    >
        <Link
            underline="none"
            color="neutral"
            href="/"
            aria-label="Home"
        >
            <HomeRoundedIcon/>
        </Link>
        {paths.map((value) => {
            return <Link
                underline="hover"
                color="neutral"
                href={value[1]}
                fontSize={12}
                fontWeight={500}
            >
                {value[0]}
            </Link>
        })}
        <Typography color="primary" fontWeight={500} fontSize={12}>
            {current}
        </Typography>
        {/*<Link*/}
        {/*    underline="hover"*/}
        {/*    color="neutral"*/}
        {/*    href="#some-link"*/}
        {/*    fontSize={12}*/}
        {/*    fontWeight={500}*/}
        {/*>*/}
        {/*    Dashboard*/}
        {/*</Link>*/}
        {/*<Typography color="primary" fontWeight={500} fontSize={12}>*/}
        {/*    Orders*/}
        {/*</Typography>*/}
    </Breadcrumbs>
}