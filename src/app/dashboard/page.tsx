"use client";

import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    MenuItem,
    Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { CalendarProps } from "react-calendar";
import moment from "moment-hijri";
import "react-calendar/dist/Calendar.css";
import { ZakatYear } from "../../../types/years";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useUserContext } from "../../../context/UserContext";
import { ZakatService } from "../services/zakat";
import { GoldService } from "../services/gold";
import { Zakat } from "../../../types/zakat";
import { AccountBalance } from "../../../types/accountBalance";

const steps = ["Enter Assets", "Enter Liabilities", "Zakat Results"];

export default function Dashboard() {
    const [date, setDate] = useState<Date>(new Date());
    const { user } = useUserContext();
    const [zakatThisYear, setZakatThisYear] = useState<ZakatYear | undefined>(undefined);

    const [balanceRows, setBalanceRows] = useState<AccountBalance[]>([]);
    const [newBalanceRow, setNewBalanceRow] = useState({ name: "", type: "", balance: 0 });
    const [debtRows, setDebtRows] = useState<AccountBalance[]>([]);
    const [newDebtRow, setNewDebtRow] = useState({ name: "", type: "", balance: 0 });
    const handleAddRow = () => {
        if (newBalanceRow.name && newBalanceRow.type) {
            const id = Date.now();
            setBalanceRows([...balanceRows, { id, ...newBalanceRow }]);
            setNewBalanceRow({ name: "", type: "", balance: 0 });
        }
    };
    const handleAddDebtRow = () => {
        if (newDebtRow.name && newDebtRow.type) {
            const id = Date.now();
            setDebtRows([...debtRows, { id, ...newDebtRow }]);
            setNewDebtRow({ name: "", type: "", balance: 0 });
        }
    };

    const handleDeleteDebtRow = (id: number) => {
        setDebtRows(debtRows.filter((debtRow) => debtRow.id !== id));
    };

    const handleDeleteRow = (id: number) => {
        setBalanceRows(balanceRows.filter((balanceRow) => balanceRow.id !== id));
    };
    moment.locale("en");
    const handleChange: CalendarProps["onChange"] = (value) => {
        // value can be null, Date, or [Date, Date]
        if (value instanceof Date) {
            setDate(value);
        } else if (Array.isArray(value) && value[0] instanceof Date) {
            setDate(value[0]); // use the first date in the range
        }
    };

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());

    const isStepOptional = (step: number) => {
        return false;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        const assetSum = balanceRows.reduce((accumulator, currentValue) => accumulator + currentValue.balance, 0);
        const debtSum = debtRows.reduce((accumulator, currentValue) => accumulator + currentValue.balance, 0);

        setZakatThisYear({
            ...(zakatThisYear as ZakatYear),
            accountBalances: balanceRows,
            debtsOwed: debtRows,
            totalAssetValue: assetSum,
            totalDebtValue: debtSum,
            zakatDueOn: assetSum - debtSum,
        });
        var indexOfZakatThisYear = user?.years.findIndex((obj) => obj.year === zakatThisYear?.year);
        if (indexOfZakatThisYear && indexOfZakatThisYear < 0) {
            user?.years.push(zakatThisYear as ZakatYear);
        } else if (indexOfZakatThisYear) {
            if (user) user.years[indexOfZakatThisYear] = zakatThisYear as ZakatYear;
        }

        ZakatService.updateUserZakat(user ? user : {}).then((result: Zakat) => {});
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

        if (activeStep + 1 === 2) {
            if (assetSum)
                if (getLastYear && assetSum - debtSum >= getLastYear.zakatDueOn) {
                    setCurrentZakat(getLastYear.zakatDueOn * 0.025);
                } else if (zakatThisYear) {
                    setCurrentZakat(zakatThisYear.zakatDueOn * 0.025);
                }
        }
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    // Example data: you can later replace this with dynamic data or API calls
    const currentYear = new Date().getFullYear().toString();
    const [currentZakat, setCurrentZakat] = useState(650);
    const lastYear = (parseInt(currentYear) - 1).toString();
    const getLastYear = user?.years.find((obj) => obj.year === lastYear);

    const handleAddZakat = () => {
        // Placeholder for your add/update logic
        alert("Add or update today's Zakat record!");
    };

    const [accordionData, setAccordionData] = React.useState([] as ZakatYear[]);
    const [goldPerGram, setGoldPerGram] = React.useState(0);
    const [nisab, setNisab] = React.useState(0);
    React.useEffect(() => {
        if (user) {
            const zakat = user.years.find((year) => year.year === currentYear);
            setZakatThisYear(zakatThisYear);

            GoldService.getGoldInfo().then((result: any) => {
                setGoldPerGram(result.price_gram_24k);
                setNisab(result.price_gram_24k * 87.48);
            });
            // var tempYears = user.years;
            // tempYears.sort((a, b) => b.year.localeCompare(a.year));
            // var tempAccordionData = [] as Year[];
            // for (var i = 0; i < tempYears.length; i++) {
            //     if (tempYears[i].year != moment().year.toString()) {
            //         var tempAccordion = {
            //             year: tempYears[i].year,
            //             accountBalances: tempYears[i].accountBalances,
            //             totalAssetValue: tempYears[i].totalAssetValue,
            //             totalDebtValue: tempYears[i].totalDebtValue,
            //             zakatDueOn: tempYears[i].zakatDueOn,
            //         };
            //         tempAccordionData[i] = tempAccordion;
            //     }
            // }
            // setAccordionData(tempAccordionData);
        }
    }, []);

    const handleBeginClick = () => {
        setZakatThisYear({
            year: currentYear,
            accountBalances: [],
            status: "IN_PROGRESS",
            totalAssetValue: 0,
            totalDebtValue: 0,
            zakatDueOn: 0,
        });
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to ZakatKeeper
            </Typography>
            {zakatThisYear ? (
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Box sx={{ width: "100%" }}>
                            <Stepper activeStep={activeStep}>
                                {steps.map((label, index) => {
                                    const stepProps: { completed?: boolean } = {};
                                    const labelProps: {
                                        optional?: React.ReactNode;
                                    } = {};
                                    if (isStepOptional(index)) {
                                        labelProps.optional = <Typography variant="caption">Optional</Typography>;
                                    }
                                    if (isStepSkipped(index)) {
                                        stepProps.completed = false;
                                    }
                                    return (
                                        <Step key={label} {...stepProps}>
                                            <StepLabel {...labelProps}>{label}</StepLabel>
                                        </Step>
                                    );
                                })}
                            </Stepper>
                            {activeStep === 0 && (
                                <React.Fragment>
                                    <Typography sx={{ mt: 2, mb: 1 }}>Add a row for each of your accounts</Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Type</TableCell>
                                                    <TableCell>Balance</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {balanceRows.map((row) => (
                                                    <TableRow key={row.id}>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.type}</TableCell>
                                                        <TableCell>${row.balance}</TableCell>
                                                        <TableCell align="right">
                                                            <Button color="error" onClick={() => handleDeleteRow(row.id)}>
                                                                Delete
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            required
                                                            placeholder="Name"
                                                            value={newBalanceRow.name}
                                                            onChange={(e) => setNewBalanceRow({ ...newBalanceRow, name: e.target.value })}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={newBalanceRow.type}
                                                            label="Type"
                                                            onChange={(e) => setNewBalanceRow({ ...newBalanceRow, type: e.target.value })}
                                                            style={{ minWidth: "200px", height: "40px" }}
                                                        >
                                                            <MenuItem value={"Bank Account"}>Bank Account</MenuItem>
                                                            <MenuItem value={"Brokerage Account"}>Brokerage Account</MenuItem>
                                                            <MenuItem value={"Retirement Account"}>Retirement Account</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            required
                                                            placeholder="Balance"
                                                            label="$"
                                                            value={newBalanceRow.balance}
                                                            onChange={(e) =>
                                                                setNewBalanceRow({
                                                                    ...newBalanceRow,
                                                                    balance: e.target.value ? parseFloat(e.target.value) : 0,
                                                                })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button variant="contained" onClick={handleAddRow}>
                                                            Add
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                        <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                                            Back
                                        </Button>
                                        <Box sx={{ flex: "1 1 auto" }} />
                                        {isStepOptional(activeStep) && (
                                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                                Skip
                                            </Button>
                                        )}
                                        <Button onClick={handleNext}>{activeStep === steps.length - 1 ? "Finish" : "Next"}</Button>
                                    </Box>
                                </React.Fragment>
                            )}
                            {activeStep === 1 && (
                                <React.Fragment>
                                    <Typography sx={{ mt: 2, mb: 1 }}>Add a row for each of your debts/liabilities</Typography>
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Type</TableCell>
                                                    <TableCell>Balance</TableCell>
                                                    <TableCell align="right">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {debtRows.map((row) => (
                                                    <TableRow key={row.id}>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.type}</TableCell>
                                                        <TableCell>${row.balance}</TableCell>
                                                        <TableCell align="right">
                                                            <Button color="error" onClick={() => handleDeleteDebtRow(row.id)}>
                                                                Delete
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            required
                                                            placeholder="Name"
                                                            value={newDebtRow.name}
                                                            onChange={(e) => setNewDebtRow({ ...newDebtRow, name: e.target.value })}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={newDebtRow.type}
                                                            label="Type"
                                                            onChange={(e) => setNewDebtRow({ ...newDebtRow, type: e.target.value })}
                                                            style={{ minWidth: "200px", height: "40px" }}
                                                        >
                                                            <MenuItem value={"Bank Account"}>Bank Account</MenuItem>
                                                            <MenuItem value={"Brokerage Account"}>Brokerage Account</MenuItem>
                                                            <MenuItem value={"Retirement Account"}>Retirement Account</MenuItem>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            required
                                                            placeholder="Balance"
                                                            label="$"
                                                            value={newDebtRow.balance}
                                                            onChange={(e) =>
                                                                setNewDebtRow({
                                                                    ...newDebtRow,
                                                                    balance: e.target.value ? parseFloat(e.target.value) : 0,
                                                                })
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button variant="contained" onClick={handleAddDebtRow}>
                                                            Add
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                        <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                                            Back
                                        </Button>
                                        <Box sx={{ flex: "1 1 auto" }} />
                                        {isStepOptional(activeStep) && (
                                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                                Skip
                                            </Button>
                                        )}
                                        <Button onClick={handleNext}>{activeStep === steps.length - 1 ? "Finish" : "Next"}</Button>
                                    </Box>
                                </React.Fragment>
                            )}
                            {activeStep === steps.length && (
                                <React.Fragment>
                                    <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
                                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                        <Box sx={{ flex: "1 1 auto" }} />
                                        <Button onClick={handleReset}>Reset</Button>
                                    </Box>
                                </React.Fragment>
                            )}
                            {activeStep === steps.length - 1 && (
                                <React.Fragment>
                                    <Typography variant="h6">Last year net assets were: ${getLastYear?.zakatDueOn}</Typography>
                                    <Typography variant="h6">This year net assets are: ${zakatThisYear.zakatDueOn}</Typography>
                                    {getLastYear && getLastYear.zakatDueOn && zakatThisYear.zakatDueOn >= getLastYear?.zakatDueOn && (
                                        <Typography>
                                            Because your net assets this year are higher or equal to net assets last year, zakat is 2.5% of
                                            last year's net assets
                                        </Typography>
                                    )}
                                    {getLastYear && getLastYear.zakatDueOn && zakatThisYear.zakatDueOn < getLastYear?.zakatDueOn && (
                                        <Typography>
                                            Because your net assets this year are lower than net assets last year, zakat is 2.5% of this
                                            year's net assets
                                        </Typography>
                                    )}
                                    <Typography variant="h6">Zakat Due for {currentYear}:</Typography>

                                    <Typography variant="h4" color="primary">
                                        ${currentZakat}
                                    </Typography>

                                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                        <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                                            Back
                                        </Button>
                                        <Box sx={{ flex: "1 1 auto" }} />
                                        {isStepOptional(activeStep) && (
                                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                                Skip
                                            </Button>
                                        )}
                                        <Button onClick={handleNext}>{activeStep === steps.length - 1 ? "Finish" : "Next"}</Button>
                                    </Box>
                                </React.Fragment>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Button variant="contained" onClick={handleBeginClick}>
                    Calculate your {currentYear} Zakat
                </Button>
            )}

            <>
                {accordionData.map((item, index) => (
                    <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>
                                {item.year} - Net Assets: ${item.zakatDueOn?.toString()}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TableContainer>
                                <Table aria-label="users table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Balance</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {item.accountBalances.map((account, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{account.name}</TableCell>
                                                <TableCell>${account.balance.toString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </>
            {/* TODO - Move this somewhere else Select Zakat Due Date
            <Calendar onChange={handleChange} value={date} />
            <div style={{ marginTop: "1rem" }}>
                <strong>Gregorian:</strong> {moment(date).format("DD of MMMM")}
                <br />
                <strong>Hijri:</strong> {moment(date).format("iDD of iMMMM")}
            </div> */}
        </Container>
    );
}
