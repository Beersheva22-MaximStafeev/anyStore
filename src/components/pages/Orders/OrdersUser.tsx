import { Box, Collapse, List, ListItemButton, ListItemText, ListSubheader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { OrderDetail } from "../../../model/OrderDetail";
import { ordersService } from "../../../config/service-config";
import { useSelectorAuth } from "../../../redux/store";
import { useDispatchCode } from "../../../hooks/hooks";
import { getDateIsoString } from "../../../util/date-functions";

const OrdersUser: React.FC = () => {
    const userData = useSelectorAuth();
    const dispatchResultCode = useDispatchCode();
    const [ordersAll, setOrdersAll] = useState<OrderDetail[]>([]);
    useEffect(() => {
        ordersService.getOrders(userData?.uid)
            .then(data => setOrdersAll(data))
            .catch(error => dispatchResultCode(error as string, ""));
    }, []);
    return <Box>
        <TableContainer component={Paper}>
            {ordersAll.map(order => 
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Order:</TableCell>
                            <TableCell align="left">{getDateIsoString(order.creationDate)}</TableCell>
                            <TableCell align="right">Status:</TableCell>
                            <TableCell align="left">{order.status}</TableCell>
                            <TableCell align="right">Sum:</TableCell>
                            <TableCell align="left">{order.sum}</TableCell>
                            <TableCell align="right">Address</TableCell>
                            <TableCell align="left">{order.deliveryAddress}</TableCell>
                            <TableCell align="right">{order.deliveryDate ? "Delivery date" : ""}</TableCell>
                            <TableCell align="left">{order.deliveryDate ? getDateIsoString(order.deliveryDate) : ""}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody><TableRow><TableCell colSpan={10}>                        
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Count</TableCell>
                                        <TableCell>Sum</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.prodicts.map(product => <TableRow>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.count}</TableCell>
                                        <TableCell>{product.sum}</TableCell>
                                    </TableRow>)}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TableCell></TableRow></TableBody>
                </Table>
            )}
        </TableContainer>
    </Box>
    return <Box>
            {ordersAll.map(order => {
                const caption = `Order ${getDateIsoString(order.creationDate)}, Status: ${order.status}, Sum: ${order.sum}, Address: ${order.deliveryAddress}` 
                    // + (order.deliveryDate != null ? ", DeliverDate: " + getDateIsoString(order.deliveryDate) : "");
                return <Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="right">Order:</TableCell>
                                    <TableCell align="left">{getDateIsoString(order.creationDate)}</TableCell>
                                    <TableCell align="right">Status:</TableCell>
                                    <TableCell align="left">{order.status}</TableCell>
                                    <TableCell align="right">Sum:</TableCell>
                                    <TableCell align="left">{order.sum}</TableCell>
                                    <TableCell align="right">Address</TableCell>
                                    <TableCell align="left">{order.deliveryAddress}</TableCell>
                                    <TableCell align="right">Delivery date</TableCell>
                                    <TableCell align="left">{order.deliveryDate ? getDateIsoString(order.deliveryDate) : ""}</TableCell>
                                </TableRow>
                            </TableHead>

                        </Table>
                    </TableContainer>
                </Box>
            }

            )}
    </Box>
}
export default OrdersUser;