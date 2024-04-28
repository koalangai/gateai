import React, {useEffect, useState} from "react";
import Sheet from "@mui/joy/Sheet";
import IconButton, {iconButtonClasses} from "@mui/joy/IconButton";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Table from "@mui/joy/Table";
import Link from "@mui/joy/Link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Typography from "@mui/joy/Typography";

import Button from "@mui/joy/Button";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {
    BackendType,
    DriverInfo,
    ProviderInfo,
    ServiceInfo,
    UsageChatRecord
} from "../../generated-api";
import dayjs from 'dayjs';
import Chip from "@mui/joy/Chip";
import {ColorPaletteProp} from "@mui/joy/styles";
import {Card, Drawer, Tooltip} from "@mui/joy";
import api from "../../consts/api.ts";
import Filter from "../../components/filters/Filter.tsx";
import SyntaxHighlighter from 'react-syntax-highlighter';
import {darcula} from "react-syntax-highlighter/dist/cjs/styles/hljs";


const renderFilters = (type: BackendType, start: Date, end: Date, onSelected: (key: string, values: string | string[] | null) => void) => (
    <React.Fragment>
        <FormControl size="sm">
            <FormLabel>Status</FormLabel>
            <Select
                size="sm"
                placeholder="Status"
                slotProps={{button: {sx: {whiteSpace: 'nowrap'}}}}
            >
                <Option value="success">Success</Option>
                <Option value="failed">Failed</Option>
            </Select>
        </FormControl>
        <Filter title={"Application"}
                onSelected={(v) => onSelected("app", v)}
                getItems={async () => {
                    return (await api.getApplicationsUsageApplicationsTypeGet({
                        type: type,
                        start: start,
                        end: end
                    })).map((item) => {
                        return {id: item, title: item};
                    });
                }}/>
        <Filter title={"Service"}
                onSelected={(v) => onSelected("service", v)}
                getItems={async () => {
                    return (await api.getServicesUsageServicesTypeGet({
                        type: type,
                        start: start,
                        end: end
                    })).map((item) => {
                        return {id: item, title: item};
                    });
                }}/>
        <Filter title={"Category"}
                onSelected={(v) => onSelected("category", v)}
                getItems={async () => {
                    return (await api.getCategoriesUsageCategoriesTypeGet({
                        type: type,
                        start: start,
                        end: end
                    })).map((item) => {
                        return {id: item, title: item};
                    });
                }}/>
    </React.Fragment>
);

function descendingComparator(a: Date, b: Date) {
    if (b < a) {
        return -1;
    }
    if (b > a) {
        return 1;
    }
    return 0;
}

function getComparator(
    order: Order,
): (
    a: UsageChatRecord,
    b: UsageChatRecord,
) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a.start, b.start)
        : (a, b) => -descendingComparator(a.start, b.start);
}

type Order = 'asc' | 'desc';

export function Application() {
    const [type, setType] = React.useState(BackendType.Chat);
    const [start, setStart] = React.useState(dayjs().subtract(1, "day").toDate());
    const [end, setEnd] = React.useState(dayjs().toDate());


    const [currentRecord, setCurrentRecord] = React.useState<UsageChatRecord | null>(null);
    const [order, setOrder] = React.useState<Order>('desc');
    const [rows, setRows] = useState<UsageChatRecord[]>([]);
    const [drivers, setDrivers] = useState<Map<string, DriverInfo>>(new Map());
    const [providers, setProviders] = useState<Map<string, ProviderInfo>>(new Map());
    const [services, setServices] = useState<Map<string, ServiceInfo>>(new Map());

    const filters = new Map<string, string[] | string | null>();

    useEffect(() => {
        const sync = async () => {
            setDrivers(new Map((await api.getDriversBackendDriversGet()).map((item) => [item.name, item])));
            setProviders(new Map((await api.getProvidersBackendProviderGet()).map((item) => [item.id, item])));
            setServices(new Map((await api.getServicesBackendServicesGet()).map((item) => [item.id, item])));
            setRows(await api.usageUsageTypeGet({
                type: BackendType.Chat,
                start: dayjs().subtract(30, 'day').toDate(),
                end: dayjs().toDate(),
            }));
        };
        sync();
    }, []);

    return (<React.Fragment>
        <Box
            className="SearchAndFilters-tabletUp"
            sx={{
                borderRadius: 'sm',
                py: 2,
                display: {xs: 'none', sm: 'flex'},
                flexWrap: 'wrap',
                gap: 1.5,
                '& > *': {
                    minWidth: {xs: '120px', md: '160px'},
                },
            }}
        >
            {/*<FormControl sx={{flex: 1}} size="sm">*/}
            {/*    <FormLabel>Search for order</FormLabel>*/}
            {/*    <Input size="sm" placeholder="Search" startDecorator={<SearchIcon/>}/>*/}
            {/*</FormControl>*/}
            {renderFilters(type, start, end, (k, vs) => {
                filters.set(k, vs);
                let query = "";
                filters.forEach((v, k) => {
                    console.log(k, v);
                    if (typeof v === "string") {
                        query += k + " = " + v + " and";
                    } else if (Array.isArray(v)) {
                        query += k + " in [" + v.join(", ") + "] and"
                    }
                });
                if (query.endsWith(" and")) {
                    query = query.substring(0, query.length - 4);
                }
                const refresh = async () => {
                    setRows(await api.usageUsageTypeGet({
                        type: BackendType.Chat,
                        start: dayjs().subtract(30, 'day').toDate(),
                        end: dayjs().toDate(),
                        query: query
                    }));
                }
                refresh();
            })}
        </Box>
        <Sheet
            className="OrderTableContainer"
            variant="outlined"
            sx={{
                display: {xs: 'none', sm: 'initial'},
                width: '100%',
                borderRadius: 'sm',
                flexShrink: 1,
                overflow: 'auto',
                minHeight: 0,
            }}
        >
            <Table
                aria-labelledby="tableTitle"
                stickyHeader
                hoverRow
                sx={{
                    '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                    '--Table-headerUnderlineThickness': '1px',
                    '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                    '--TableCell-paddingY': '4px',
                    '--TableCell-paddingX': '8px',
                }}
            >
                <thead>
                <tr>
                    <th style={{width: 80, padding: '12px 12px'}}>Status</th>
                    <th style={{width: 110, padding: '12px 6px'}}>Endpoint</th>
                    <th style={{width: 70, padding: '12px 6px'}}>Provider</th>
                    <th style={{width: 70, padding: '12px 6px'}}>Driver</th>
                    <th style={{width: 180, padding: '12px 6px'}}>Model</th>
                    <th style={{width: 140, padding: '12px 6px'}}>Message</th>
                    <th style={{width: 140, padding: '12px 6px'}}>Choices</th>
                    <th style={{width: 60, padding: '12px 6px'}}>Tokens</th>
                    <th style={{width: 90, padding: '12px 6px'}}>
                        <Link
                            underline="none"
                            color="primary"
                            component="button"
                            onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                            fontWeight="lg"
                            endDecorator={<ArrowDropDownIcon/>}
                            sx={{
                                '& svg': {
                                    transition: '0.2s',
                                    transform:
                                        order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                                },
                            }}
                        >
                            Start
                        </Link>
                    </th>
                    <th style={{width: 80, padding: '12px 6px'}}>Duration</th>
                    <th style={{width: 140, padding: '12px 6px'}}>Exception</th>
                </tr>
                </thead>
                <tbody>
                {rows.sort(getComparator(order)).map((row, idx) => (
                    <tr key={idx} onClick={() => setCurrentRecord(row)}>
                        {/*<td style={{textAlign: 'center', width: 120}}>*/}
                        {/*    <Checkbox*/}
                        {/*        size="sm"*/}
                        {/*        checked={selected.includes(row.id)}*/}
                        {/*        color={selected.includes(row.id) ? 'primary' : undefined}*/}
                        {/*        onChange={(event) => {*/}
                        {/*            setSelected((ids) =>*/}
                        {/*                event.target.checked*/}
                        {/*                    ? ids.concat(row.id)*/}
                        {/*                    : ids.filter((itemId) => itemId !== row.id),*/}
                        {/*            );*/}
                        {/*        }}*/}
                        {/*        slotProps={{checkbox: {sx: {textAlign: 'left'}}}}*/}
                        {/*        sx={{verticalAlign: 'text-bottom'}}*/}
                        {/*    />*/}
                        {/*</td>*/}
                        <td>
                            <Chip
                                variant="soft"
                                size="sm"
                                color={
                                    {
                                        1: 'success',
                                        0: 'danger',
                                    }[row.success == true ? 1 : 0] as ColorPaletteProp
                                }
                            >
                                {row.success == true ? "Success" : "Failed"}
                            </Chip>
                        </td>
                        <td align={"center"}>
                            {
                                row.endpointId ?
                                    <Typography level="body-xs">{services.get(row.endpointId)?.name}</Typography>
                                    : <Chip>null</Chip>
                            }
                        </td>
                        <td>
                            <Typography level="body-xs">
                                {
                                    row.providerId ?
                                        <Typography level="body-xs">{providers.get(row.providerId)?.name}</Typography>
                                        : <Chip>null</Chip>
                                }
                            </Typography>
                        </td>
                        <td>
                            <Typography level="body-xs">
                                {
                                    row.providerType ?
                                        <Typography level="body-xs">{drivers.get(row.providerType)?.name}</Typography>
                                        : <Chip>null</Chip>
                                }
                            </Typography>
                        </td>
                        <td>
                            <Typography level="body-xs">{row.model}</Typography>
                        </td>
                        <td>
                            <Tooltip title={
                                function () {
                                    const msgs = JSON.parse(row.message ?? "");
                                    return msgs[msgs.length - 1]['content'];
                                }()} style={{maxWidth: '500px'}}>

                                <Typography level="body-xs" sx={{
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 1,
                                }}>{
                                    function () {
                                        const msgs = JSON.parse(row.message ?? "");
                                        return msgs[msgs.length - 1]['content'];
                                    }()
                                }</Typography>
                            </Tooltip>
                        </td>
                        <td>
                            <Tooltip title={
                                function () {
                                    if (row.choices == null) {
                                        return <Chip>null</Chip>;
                                    }
                                    const msgs = JSON.parse(row.choices ?? "");
                                    return msgs[msgs.length - 1]['message']['content'];
                                }()} style={{maxWidth: '500px'}}>

                                <Typography level="body-xs" sx={{
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 1,
                                }}>{
                                    function () {
                                        if (row.choices == null) {
                                            return <Chip>null</Chip>;
                                        }
                                        const msgs = JSON.parse(row.choices ?? "");
                                        return msgs[msgs.length - 1]['message']['content'];
                                    }()
                                }</Typography>
                            </Tooltip>
                        </td>
                        <td>
                            <Typography level="body-xs">{row.prompt}/{row.completion}</Typography>
                        </td>
                        <td>
                            <Typography level="body-xs">{dayjs(row.start).format('HH:mm:ss')}</Typography>
                        </td>
                        <td>
                            <Typography level="body-xs">{dayjs(row.end).diff(dayjs(row.start))}</Typography>
                        </td>
                        <td>
                            <Tooltip title={row.exception} style={{maxWidth: '500px'}}>
                                <Typography level="body-xs" sx={{
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 1,
                                }}>{row.exception}</Typography>
                            </Tooltip>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Sheet>
        <Box
            className="Pagination-laptopUp"
            sx={{
                pt: 2,
                gap: 1,
                [`& .${iconButtonClasses.root}`]: {borderRadius: '50%'},
                display: {
                    xs: 'none',
                    md: 'flex',
                },
            }}
        >
            <Button
                size="sm"
                variant="outlined"
                color="neutral"
                startDecorator={<KeyboardArrowLeftIcon/>}
            >
                Previous
            </Button>

            <Box sx={{flex: 1}}/>
            {['1', '2', '3', '…', '8', '9', '10'].map((page) => (
                <IconButton
                    key={page}
                    size="sm"
                    variant={Number(page) ? 'outlined' : 'plain'}
                    color="neutral"
                >
                    {page}
                </IconButton>
            ))}
            <Box sx={{flex: 1}}/>

            <Button
                size="sm"
                variant="outlined"
                color="neutral"
                endDecorator={<KeyboardArrowRightIcon/>}
            >
                Next
            </Button>
        </Box>
        <Drawer open={currentRecord != null} anchor={"right"} size={"md"} onClose={() => setCurrentRecord(null)}>
            <Card size={"sm"} style={{margin: "10px"}} variant="outlined">
                <Typography level="title-lg">Status</Typography>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography level={"title-sm"} minWidth={100}>Application</Typography>
                        <div style={{height: 8}}></div>
                        <Chip color={currentRecord?.success == true ? "success" : "danger"} variant="soft">
                            {currentRecord?.success == true ? "Success" : "Failed"}
                        </Chip>
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography level={"title-sm"} minWidth={100}>Prompt Tks</Typography>
                        <div style={{height: 8}}></div>
                        <Typography level={"body-sm"}>{currentRecord?.prompt ?? ""}</Typography>
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography level={"title-sm"} minWidth={100}>Completion</Typography>
                        <div style={{height: 8}}></div>
                        <Typography level={"body-sm"}>{currentRecord?.completion ?? ""}</Typography>
                    </div>
                </div>
                <div style={{height: 8}}></div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography level={"title-sm"} minWidth={100}>Endpoint</Typography>
                        <div style={{height: 8}}></div>
                        <Chip color={"neutral"} variant="soft">
                            {function () {
                                if (currentRecord?.endpointId) {
                                    const service = services.get(currentRecord!.endpointId);
                                    if (service) {
                                        return service.name;
                                    }
                                }
                                return "";
                            }()}
                        </Chip>
                    </div>

                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography level={"title-sm"} minWidth={100}>Provider</Typography>
                        <div style={{height: 8}}></div>
                        <Chip color={"neutral"} variant="soft">
                            {function () {
                                if (currentRecord?.providerId) {
                                    const provider = providers.get(currentRecord!.providerId);
                                    if (provider) {
                                        return provider.name;
                                    }
                                }
                                return "";
                            }()}
                        </Chip>
                    </div>

                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography level={"title-sm"} minWidth={100}>Driver</Typography>
                        <div style={{height: 8}}></div>
                        <Chip color={"neutral"} variant="soft">
                            {function () {
                                if (currentRecord?.providerType) {
                                    const driver = drivers.get(currentRecord!.providerType);
                                    if (driver) {
                                        return driver.name;
                                    }
                                }
                                return "";
                            }()}
                        </Chip>
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography level={"title-sm"} minWidth={100}>Model</Typography>
                        <div style={{height: 8}}></div>
                        <Chip color={"neutral"} variant="soft">
                            {function () {
                                if (currentRecord?.endpointId) {
                                    const service = services.get(currentRecord!.endpointId);
                                    if (service) {
                                        return service.model;
                                    }
                                }
                                return currentRecord?.model;
                            }()}
                        </Chip>
                    </div>
                </div>

                <div style={{height: 8}}></div>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography level={"title-sm"} minWidth={100}>Temperature</Typography>
                        <div style={{height: 8}}></div>
                        <Typography level={"body-sm"}>
                            {currentRecord?.temperature ?? ""}
                        </Typography>
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography level={"title-sm"} minWidth={100}>Format</Typography>
                        <div style={{height: 8}}></div>
                        <Typography level={"body-sm"}>
                            {currentRecord?.responseFormat ?? ""}
                        </Typography>
                    </div>
                </div>
            </Card>
            <Card size={"sm"} style={{margin: "10px"}} variant="outlined">
                <Typography level="title-lg">Application Information</Typography>
                <div style={{height: '4px'}}/>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <Typography level={"title-sm"} minWidth={90}>Application</Typography>
                        <Chip>{currentRecord?.app ?? ""}</Chip>
                    </div>
                    <div style={{height: '8px'}}/>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <Typography level={"title-sm"} minWidth={90}>Service</Typography>
                        <Chip>{currentRecord?.service ?? ""}</Chip>
                    </div>
                    <div style={{height: '8px'}}/>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <Typography level={"title-sm"} minWidth={90}>Category</Typography>
                        <Chip>{currentRecord?.category ?? ""}</Chip>
                    </div>
                    <div style={{height: '8px'}}/>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <Typography level={"title-sm"} minWidth={90}>User</Typography>
                        <Chip>{currentRecord?.user ?? ""}</Chip>
                    </div>
                    <div style={{height: '8px'}}/>
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                        <Typography level={"title-sm"} minWidth={90}>BatchID</Typography>
                        <Chip >{currentRecord?.batch ?? ""}</Chip>
                    </div>
                </div>
            </Card>
            <Card style={{margin: '10px'}}>
                <Typography level="title-lg">Chat Information</Typography>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "start"}}>
                        <Typography level={"title-sm"} minWidth={90}>Request</Typography>
                        <div style={{maxWidth: 500}}>
                            <SyntaxHighlighter language={"json"} style={darcula} showLineNumbers={false}
                                               wrapLines={true}
                                               lineProps={{
                                                   style: {
                                                       wordBreak: 'break-all',
                                                       whiteSpace: 'pre-wrap',
                                                       fontSize: 'var(--Typography-fontSize, var(--joy-fontSize-sm, 0.875rem))',
                                                       color: 'var(--joy-palette-text-tertiary, var(--joy-palette-neutral-600, #555E68))'
                                                   }
                                               }}
                            >
                                {function () {
                                    if (currentRecord?.message) {
                                        return JSON.stringify(JSON.parse(currentRecord.message), null, 2);
                                    } else {
                                        return "";
                                    }
                                }()}
                            </SyntaxHighlighter>
                        </div>

                        <Typography level={"title-sm"} minWidth={90}>Response</Typography>
                        <div style={{maxWidth: 500}}>
                            <SyntaxHighlighter language={"json"} style={darcula} showLineNumbers={false}
                                               wrapLines={true}
                                               lineProps={{
                                                   style: {
                                                       wordBreak: 'break-all',
                                                       whiteSpace: 'pre-wrap',
                                                       fontSize: 'var(--Typography-fontSize, var(--joy-fontSize-sm, 0.875rem))',
                                                       color: 'var(--joy-palette-text-tertiary, var(--joy-palette-neutral-600, #555E68))'
                                                   }
                                               }}
                            >
                                {function () {
                                    if (currentRecord?.choices) {
                                        return JSON.stringify(JSON.parse(currentRecord.choices), null, 2);
                                    } else {
                                        return "";
                                    }
                                }()}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </div>
            </Card>
        </Drawer>
    </React.Fragment>);
}