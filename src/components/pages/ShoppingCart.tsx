import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelectorAuth } from "../../redux/store";
import { ordersService, productService, shoppingCartService } from "../../config/service-config";
import { useDispatchCode } from "../../hooks/hooks";
import { ProductAdd, ShoppingCardDetails } from "../../model/ShoppingCartDetails";
import Product from "../../model/Product";
import { PlusOne, Add, Delete, Remove } from "@mui/icons-material";
import { getAllSum } from "../../util/number-functions";

const ShoppingCart: React.FC = () => {
    const dispatchResultCode = useDispatchCode();
    const userData = useSelectorAuth();
    const [allProducts, setAllProducts] = useState<ProductAdd[]>([]);
    const [needUpdate, setNeedUpdate] = useState<boolean>(false);
    const allSum = useRef<number>(0);
    const [deliveryAddress, setDeliveryAddress] = useState<string>("");
    // const allProducts = useMemo<ProductAdd[]>(() => getAllProducts(), [shoppingCartData]);


    useEffect(() => {
        console.log("running");
        shoppingCartService.getCartWithDetails(userData?.uid)
            .then(data => {
                setAllProducts(data);
                allSum.current = getAllSum(data.map(el => ({sum: el.sum}))); //Math.trunc(data.reduce((sum, cur) => sum + cur.sum!, 0) * 100) / 100;
            })
            .catch(error => dispatchResultCode(error as string, ""));
    }, [needUpdate]);

    async function onSubmitFn(event: any) {
        event.preventDefault();
        console.log("Saving shopping cart", allProducts);
        const res = await ordersService
            .submitShoppingCart(userData?.uid, allProducts, deliveryAddress)
            .then(res => {
                // shoppingCartService.clearShoppingCart(userData?.uid);
                dispatchResultCode("", res.message ? res.message : "Order successfully added");
            })
            .catch(error => dispatchResultCode(error, ""));

    }

    return <Box>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Count</TableCell>
                <TableCell align="right">Sum</TableCell>
                <TableCell align="right">&nbsp;</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {allProducts.map((row, index) => {
                return (
                    <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                        <TableCell align="right">{row.count}</TableCell>
                        <TableCell align="right">{row.sum}</TableCell>
                        <TableCell align="right">
                            <Button onClick={async () => {
                                await shoppingCartService.setProductCount(userData?.uid, row.id, row.count - 1);
                                setNeedUpdate(!needUpdate);
                            }}><Remove /></Button>
                            <Button onClick={async () => {
                                await shoppingCartService.setProductCount(userData?.uid, row.id, row.count + 1);
                                setNeedUpdate(!needUpdate);
                            }}><Add /></Button>
                            <Button onClick={async () => {
                                await shoppingCartService.setProductCount(userData?.uid, row.id, 0);
                                setNeedUpdate(!needUpdate);
                            }}><Delete/></Button>
                        </TableCell>
                    </TableRow>
                );
            })}
                    <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row"></TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right">Sum:</TableCell>
                        <TableCell align="right">{allSum.current}</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
            </TableBody>
        </Table>
        </TableContainer>
        <form onSubmit={onSubmitFn}>
            <TextField type="text" required label="Delivery address" helperText="Enter delivery address" 
                onChange={(event: any) => setDeliveryAddress(event.target.value)}/>
            <Button type="submit">Submit order</Button>
        </form>

    </Box>
}
export default ShoppingCart;