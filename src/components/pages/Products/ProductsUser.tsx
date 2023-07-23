import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Grid, InputLabel, MenuItem, Pagination, Select, SelectChangeEvent, Typography } from "@mui/material"
import { productService, shoppingCartService } from "../../../config/service-config";
import { useEffect, useMemo, useRef, useState } from "react";
import Product from "../../../model/Product";
import { useSelectorAuth } from "../../../redux/store";
import { useDispatchCode } from "../../../hooks/hooks";

const MAX_LENGTH = 100;

const ProductsUser: React.FC = () => {

    const dispatchResultCode = useDispatchCode();

    const userData = useSelectorAuth();

    const [products, setProducts] = useState<Product[]>([]);

    const [productsPerPage, setProductsPerPage] = useState<number>(10);
    const [pagesCount, setPagesCount] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [categories, setCategories] = useState<string[]>([]);
    const [categoryCurrent, setCategoryCurrent] = useState<string>("");

    const productsFiltered = useMemo<Product[]>(() => categoryCurrent === "" ? products : products.filter(prod => prod.category === categoryCurrent), [products, categoryCurrent]);
    const productsToShow = useMemo<Product[]>(() => getProductsToShow(), [productsFiltered, currentPage, productsPerPage]);

    useEffect(() => {
        productService.getAllProducts()
        .then(data => {
            setProducts(data);
            const categs = data.map(prod => prod.category).filter((v, i, a) => a.indexOf(v) === i);
            setCategories(categs);
        })
        .catch(error => dispatchResultCode(error as string, ""));
    }, []);

    useEffect(() => {
        const prodCount = productsFiltered.length;
        const pageCnt = Math.trunc(prodCount / productsPerPage) + (prodCount % productsPerPage === 0 ? 0 : 1);
        console.log(`prodCount % productsPerPage = ${prodCount % productsPerPage}`);
        
        // + prodCount % productsPerPage === 0 ? 0 : 1
        console.log(`prodCount = ${prodCount}, productsPerPage = ${productsPerPage} => pageCnt = ${pageCnt} `);
        setPagesCount(pageCnt);
    }, [productsFiltered, productsPerPage]);

    useEffect(() => setCurrentPage(1), [pagesCount]);

    function getProductsToShow(): Product[] {
        const countProds = productsFiltered.length;
        const startProdIndex = productsPerPage * (currentPage - 1);
        const endProdIndex = startProdIndex + productsPerPage;
        console.log(`countProds = ${countProds}, productsPerPage = ${productsPerPage}, currentPage = ${currentPage}, startProdIndex = ${startProdIndex}, endProdIndex = ${endProdIndex}`);
        
        return productsFiltered.slice(startProdIndex, endProdIndex);
    }
    
    return <Box>
        <Box>
            <Grid container alignItems="center">
                <Grid item>
            {categories.map(category => 
                <Button variant={categoryCurrent === category ? "outlined" : "text"} 
                    onClick={() => setCategoryCurrent(categoryCurrent === category ? "" : category)} key={category}>{category}</Button>)}
                </Grid>
                <Grid item>
            <InputLabel id="demo-simple-select-label">Products per page</InputLabel>
            </Grid>
            <Grid>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={productsPerPage.toString()}
                label="Age"
                onChange={(event: SelectChangeEvent) => setProductsPerPage(+event.target.value)}
            >
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
            </Select>
            </Grid>
            <Grid item></Grid>
            </Grid>
        </Box>
        <Box>
            {pagesCount > 1 && <Pagination count={pagesCount} page={currentPage} onChange={(event: any, value: number) => setCurrentPage(value)}/>}
        </Box>
        <Grid container justifyContent={"center"} spacing={"10px"}>
            {productsToShow.map(product => <Grid item key={product.id}>
                
                <Card sx={{width: "300px", minHeight: "250px", padding: "10px"}}>
                    <Box>
                        <CardMedia component="img" height="100px" width="100px" image={product.imageUrl} title={product.description}/>
                        <CardContent sx={{height: "250px"}}>
                            <Typography gutterBottom variant="h6" component="div">{product.name}</Typography>
                            <Typography>${product.price} / {product.unit}</Typography>
                            <Typography variant="body2" color="text.secondary">{product.description.length > MAX_LENGTH ? product.description.substring(0, MAX_LENGTH) + "..." : product.description}</Typography>
                        </CardContent>
                    </Box>
                    <Box>
                        {userData && <Button onClick={() => shoppingCartService.addToCart(userData.uid, product.id)}>Add to cart</Button>}
                    </Box>
                </Card>
            </Grid>)}
        </Grid>
    </Box>;
}
export default ProductsUser;