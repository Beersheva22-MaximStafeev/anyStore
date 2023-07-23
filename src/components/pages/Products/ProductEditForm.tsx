import { Autocomplete, Box, Button, Grid, ImageList, ImageListItem, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import InputResult from "../../../model/InputResult"
import Product from "../../../model/Product"
import { ChangeEvent, useState } from "react"
import appConfig from "./../../../config/app-config.json";
import { useDispatchCode } from "../../../hooks/hooks";
import { productService } from "../../../config/service-config";

type Props = {
    callbackFn: (product: Product, process: boolean) => Promise<InputResult>,
    productUpdated?: Product
}
const initialProduct: Product = {
    category: "",
    imageUrl: "",
    name: "",
    description: "",
    price: 0,
    unit: appConfig.units[0]
}


export const ProductEditForm: React.FC<Props> = ({ callbackFn, productUpdated }) => {
    const dispatchResultCode = useDispatchCode();
    const [product, setProduct] = useState<Product>(productUpdated || initialProduct);
    const [errorMessage, setErrorMessage] = useState('');
    const [file, setFile] = useState<File>();
    async function onSubmitFn(event: any) {
        event.preventDefault();
        const res =  await callbackFn(product, true);
        res.status == "success" && event.target.reset();
    }
    function onResetFn(event: any) {
        setProduct(productUpdated || initialProduct);
    }
    function handlerProductName(event: any) {
        const currentValue = event.target.value;
        const productCopy: Product = {...product};
        productCopy.name = currentValue;
        setProduct(productCopy);
    }
    function handlerProductDescription(event: any) {
        const currentValue = event.target.value;
        const productCopy: Product = {...product};
        productCopy.description = currentValue;
        setProduct(productCopy);
    }
    function handlerProductCategory(event: any) {
        const currentValue = event.target.value;
        const productCopy: Product = {...product};
        productCopy.category = currentValue;
        setProduct(productCopy);
    }
    function handlerProductPrice(event: any) {
        const currentValue = +event.target.value;
        const productCopy: Product = {...product};
        productCopy.price = currentValue;
        setProduct(productCopy);
    }
    function handlerProductUnit(event: any) {
        const currentValue = event.target.value;
        const productCopy: Product = {...product};
        productCopy.unit = currentValue;
        setProduct(productCopy);
    }
    function handlerFilePickedProductImage(event: any) {
        if (event.target.files) {
            const curFile = event.target.files[0];
            if (curFile) {
                setFile(curFile);
                console.log(curFile);
                if (curFile!.type != "image/jpeg") {
                    dispatchResultCode("File type must be image/jpeg", "");
                    console.log("error type file");
                    setFile(undefined);
                }
            }
        }
    }
    async function handlerButtonUploadProductImage(event: any) {
        if (!file) {
            dispatchResultCode("", "Choose image/jpeg");
            return;
        }
        if (file.type != "image/jpeg") {
            dispatchResultCode("File type must be image/jpeg", "");
            setFile(undefined);
        }
        try {
            const fileUrl = await productService.uploadImg(file, file.name);
            console.log(`File uploaded succesfully`);
            console.log(fileUrl);
            const productCopy: Product = {...product};
            productCopy.imageUrl = fileUrl;
            setProduct(productCopy);
            dispatchResultCode("", "File uploaded succeffully");
        } catch (error) {
            dispatchResultCode("Error uploading file: " + error, "");
        }
    }
    console.log(`image: ${product.imageUrl}`);
    return <Box>
        <form onSubmit={onSubmitFn} onReset={onResetFn}>
            <Grid container justifyContent={"center"}>
                <Grid item>
                    <TextField type="text" required fullWidth label="Product name" 
                        helperText="Enter product name" onChange={handlerProductName} value={product.name}/> 
                </Grid>
                <Grid item>
                        <TextField type="text" required label="Product category"
                        helperText="Enter product category" onChange={handlerProductCategory} value={product.category}/>
                </Grid>
                <Grid item>
                    <TextField type="number" required label="Product price"
                        helperText="Enter product price" onChange={handlerProductPrice} value={product.price}/>
                </Grid>
                <Grid item>
                    <InputLabel id="select-unit-id"></InputLabel>
                    <Select labelId="select-unit-id" label="Unit" onChange={handlerProductUnit} value={product.unit}>
                        <MenuItem value="">None</MenuItem>
                        {appConfig.units.map(unit => <MenuItem value={unit} key={unit}>{unit}</MenuItem>)}
                    </Select>
                </Grid>
            </Grid>
            <TextField type="text" multiline required fullWidth label="Product description" 
                        helperText="Enter product description" onChange={handlerProductDescription} value={product.description}/> 
            <Box>
                <img width={"100px"} height={"100px"} src={product.imageUrl}/>
                <TextField type="file" required onChange={handlerFilePickedProductImage}
                    helperText="Upload picture to the product"/>
                <Button onClick={handlerButtonUploadProductImage}>Upload image</Button>
            </Box>
            <Box>
                <Button type="submit">Submit</Button>
                <Button type="reset">Reset</Button>
                <Button onClick={() => callbackFn(product, false)}>Cancel editing</Button>
            </Box>
        </form>
    </Box>
}