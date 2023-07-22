import { Box, Button, Collapse, List, ListItemButton, ListItemText, ListSubheader, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { OrderDetail } from "../../../model/OrderDetail";
import { ordersService } from "../../../config/service-config";
import { useSelectorAuth } from "../../../redux/store";
import { useDispatchCode } from "../../../hooks/hooks";
import { getDateIsoString } from "../../../util/date-functions";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Delete, CalendarToday, TextFields, Visibility } from "@mui/icons-material";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const OrdersAdmin: React.FC = () => {
    const columns: GridColDef[] = [
        {field: "id", flex: 0.3},
        {field: "uid", flex: 0.7},
        {field: "creationDate", flex: 1, type: "dateTime"},
        {field: "status", flex: 0.3},
        {field: "deliveryDate", flex: 1},
        {field: "sum", type: "number", flex: 0.5},
        {field: "deliveryAddress", flex: 1, renderCell: params => {
            return params.row.deliveryAddress ?? "";
        }},
        {field: "actions", type: "actions", flex: 0.3, getActions: (params) => {
            return [
                <GridActionsCellItem label="Update delivery Date" icon={<CalendarToday/>}
                    onClick={() => {
                        setDatetimeDelivery(params.row.deliveryDate ? getDateIsoString(params.row.deliveryDate).substring(0, 16) : "");
                        currentOrderId.current = params.row.id;
                        setPicDataDelivery(true);
                    }} />,
                    <GridActionsCellItem label="Show order details" icon={<Visibility/>}
                    onClick={() => {
                        currentOrder.current = params.row;
                        setShowDetail(true);
                    }} />
            ]
        }}
    ];
    const userData = useSelectorAuth();
    const dispatchResultCode = useDispatchCode();
    const [ordersAll, setOrdersAll] = useState<OrderDetail[]>([]);
    const [picDataDelivery, setPicDataDelivery] = useState<boolean>(false);
    const [datetimeDelivery, setDatetimeDelivery] = useState("");
    const currentOrderId = useRef<string>("");
    const currentOrder = useRef<OrderDetail>();
    const [showDetail, setShowDetail] = useState<boolean>(false);
    useEffect(() => {
        ordersService.getAllOrders()
            .then(data => setOrdersAll(data))
            .catch(error => dispatchResultCode(error as string, ""));
    }, []);
    
    async function updateDate(event: any) {
        event.preventDefault();
        // console.log(datetimeDelivery);
        // console.log(typeof datetimeDelivery);
        // console.log(new Date(datetimeDelivery));
        const newDate = new Date(datetimeDelivery);
        setPicDataDelivery(false);
        ordersService.updateOrderDeliveryDatetimeAndStatus(currentOrderId.current, newDate)
            .catch(error => dispatchResultCode(error, ""));
    }

    return <Box>
        <DataGrid columns={columns} rows={ordersAll}/>
        <Modal open={picDataDelivery} onClose={() => setPicDataDelivery(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"><Box sx={style}>
                <form onSubmit={updateDate}>
                <TextField type="datetime-local" required
                    helperText="Pick delivery date and time" value={datetimeDelivery} onChange={event => setDatetimeDelivery(event.target.value)}/>
                <Button type="submit">Update order</Button>
                <Button onClick={() => setPicDataDelivery(false)}>Close</Button>
                </form>
            </Box></Modal>
            <Modal open={showDetail} onClose={() => setShowDetail(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"><Box sx={style}>
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
                        {currentOrder.current && currentOrder.current!.prodicts.map(product => <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.count}</TableCell>
                            <TableCell>{product.sum}</TableCell>
                        </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
            </Box></Modal>
    </Box>
}
export default OrdersAdmin;
