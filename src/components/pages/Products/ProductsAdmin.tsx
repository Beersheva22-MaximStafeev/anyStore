import { Box, Button, Card, Grid, Modal, TextField, Typography } from "@mui/material"
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Product from "../../../model/Product";
import { Subscription } from "rxjs";
import { productService } from "../../../config/service-config";
import { useDispatchCode } from "../../../hooks/hooks";
import { Delete, Edit, FileUpload } from "@mui/icons-material";
import { ProductEditForm } from "./ProductEditForm";
import InputResult from "../../../model/InputResult";
import { Confirmation } from "../../common/Confirmation";


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

const ProductsAdmin: React.FC = () => {
    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            align: "center",
            headerAlign: "center"
        },
        {
            field: "name"
        },
        {
            field: "category"
        },
        {
            field: "imageUrl"
        },
        {
            field: "price",
            type: "number"
        },
        {
            field: "unit"
        },
        {
            field: "actions", type: "actions", getActions: (params) => {
                return [
                    <GridActionsCellItem label="remove" icon={<Delete/>}
                        onClick={() => buttonClickRemoveProduct(params)} />,
                    <GridActionsCellItem label="update" icon={<Edit/>}
                        onClick={() => buttonClickUpdateProduct(params)} />
                ]
            }
        }
    ];
    const title = useRef<string>("");
    const content = useRef<string>("");
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const confirmHandlingFn = useRef<any>(null);

    const [file, setFile] = useState<File>();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const curFile = e.target.files[0];
        setFile(curFile);
        console.log(curFile);
        if (curFile!.type != "application/json") {
            dispatchResultCode("File type must be application/json", "");
            console.log("error type file");
            setFile(undefined);
        }
        
      }
    };
    async function handleButtonFileUpload (event: any) {
        if (!file) {
            dispatchResultCode("", "Choose json-file");
            return;
        }
        if (file.type != "application/json") {
            dispatchResultCode("File type must be application/json", "");
            setFile(undefined);
        }
        const json = await file.text();
        const res = await productService.uploadFirst(json);
        if (res.status === "success") {
            dispatchResultCode("", "Error uploading file " + res.message);
        } else {
            dispatchResultCode("File uploaded succesfully", "");
        }
    }    
    const product = useRef<Product | undefined>(undefined);
    const [openEditProduct, setOpenEditProduct] = useState<boolean>(false);
    const handlerAddProduct = () => {
        product.current = undefined;
        setOpenEditProduct(true);
    }

    const dispatchResultCode = useDispatchCode();
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        const subscription: Subscription = productService.subscrbeProducts().subscribe({
            next(products: Product[] | string) {
                let errorMessage: string = "";
                if (typeof products === "string") {
                    errorMessage = products;
                } else {
                    setProducts(products);
                }
                dispatchResultCode(errorMessage, "");
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    return <Box sx={{display: "flex", justifyContent: "center", alignContent: "center"}}>
        <Box sx={{height: "80vh", width: "90vw"}}>
            <Button onClick={handlerAddProduct}>Add Product</Button>
            <DataGrid columns={columns} rows={products}/>
            {(!products || products.length ===0) && <Box>
                <Typography>Placeholder for uploading file</Typography>
                <TextField type="file" required onChange={handleFileChange}  />
                <Button onClick={handleButtonFileUpload}>Upload init data</Button>
            </Box> }
        </Box>
        <Confirmation confirmFn={confirmHandlingFn.current} open={openConfirm}
            title={title.current} content={content.current}></Confirmation>
        <Modal open={openEditProduct} onClose={() => setOpenEditProduct(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
            <Box sx={style}>
                <ProductEditForm callbackFn={callbackUpdateProduct} productUpdated={product.current}/>
            </Box>
        </Modal>
    </Box>

    function buttonClickRemoveProduct(params: GridRowParams) {
        // console.log("removeProduct");
        // console.log(params);
        title.current = "Confirm remove product!";
        content.current = `Do you realy want to delete product ${params.row.name} (id: ${params.id})?`;
        confirmHandlingFn.current = async (result: boolean) => {
            if (result) {
                try {
                    await productService.deleteProduct(params.id as string);
                } catch (error: any) {
                    dispatchResultCode(error, "");
                }
            }
            setOpenConfirm(false);
        }
        setOpenConfirm(true);
    }
    function buttonClickUpdateProduct(params: GridRowParams) {
        // console.log("updateProduct");
        // console.log(params);
        product.current = params.row;
        setOpenEditProduct(true);
    }
    async function callbackUpdateProduct(productNew: Product, process: boolean): Promise<InputResult> {
        if (process) {
            try {
                if (product.current) {
                    await productService.updateProduct(productNew);
                } else {
                    await productService.addProduct(productNew);
                }
                setOpenEditProduct(false);
            } catch (error) {
                return {status: "error", message: `Error updating product ${error}`};
            }
        } else {
            setOpenEditProduct(false);
        }
        return {status: "success", message: ""};
    }

}
export default ProductsAdmin;