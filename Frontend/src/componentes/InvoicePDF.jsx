import React, { useState } from 'react';
// import { Button } from '@progress/kendo-react-buttons';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        padding: 20,
    },
    line: {
        display: 'flex',
        gap: '1rem',
        width: '100%',
        border: '2px solid black',
        // height: '100rem'

    },
    section: {
        flexGrow: 1,
    },
    companyDetails: {
        marginBottom: 20,
        textAlign: 'center'
    },
    invoiceDetails: {
        display: 'flex',
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        textAlign: 'start',
        width: '100%'
        // fontSize: 'small'
    },
    part2: {
        alignItems: 'center'
    },
    heading: {
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: "center",
        fontSize: 16,
        marginBottom: 10,
        textDecoration: 'underline',
        textAlign: 'center'
    },
    table: {
        display: 'table',
        width: '100%',
        borderStyle: 'solid',
        margin: 10,
        // borderWidth: 1,
    },
    tableRow: {
        // margin: 9,
        flexDirection: 'row',
    },
    tableCellHeader: {
        padding: 0,
        borderStyle: 'solid',
        // borderWidth: 1,
        borderBottom: 1,
        // margin: 8,
        width: "100%",
        // borderLeftWidth: 0,
        // borderTopWidth: 0,
        // fontWeight: 'bold',
    },
    tableCell: {
        padding: 2,
        // margin: 28,
        width: "100%",
        borderBottom: 1,
        // fontSize: "100%",
        // borderStyle: 'solid',
        // borderWidth: 1,
        // borderLeftWidth: 1,
        // borderTopWidth: 0,
    },
    amount:{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        textAlign: 'center',
        // padding: '1rem'
    }
});

// Main App component
const InvoicePDF = () => {
    const [companyData, setCompanyData] = useState('')

    const [orderData, setOrderData] = useState({})
    const [products, setProduct] = useState([])

    // ------------------------ SHOWING THE COMPANY DETAILS HERE ---------------------

    const showCompanyDate = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/company/get', {
                method: "GET",
            })
            const result = await response.json()
            setCompanyData(result)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        showCompanyDate()
    }, [])

    // ---------------------- FETCHING ORDER BY ID ---------------
    const { id } = useParams()

    const showOrder = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/order/getbyid/${id}`, {
                method: "GET"
            })
            const result = await response.json()
            setOrderData(result)
            setProduct(result.products);
        } catch (error) {
            showOrder
        }
    }

    useEffect(() => {
        showOrder()
    }, [id])

    const TotalPrice = products.reduce((total, product) => total + (product.price * product.quantity), 0)
    const TotalAmount = products.reduce((total, product) => total + (product.price * product.quantity - product.discount), 0);
    const TotalDiscount = products.reduce((total, product) => total + (product.discount), 0)

    const FormattedDate = new Date(orderData.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    //   console.log(FormattedDate);


    // ---------- THE PDF GENERATOR ---------------------------------
    function generateInvoice() {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <View style={styles.companyDetails}>
                            <Text style={styles.heading}>Company Details</Text>
                            {companyData.length > 0 && (
                                <>
                                    <Text> {companyData[0].companyName} </Text>
                                    <Text>{companyData[0].Address}</Text>
                                    <Text>Phone No: {companyData[0].phone}</Text>
                                </>
                            )}
                            <Text style={styles.line}></Text>
                        </View>
                        <View style={styles.invoiceDetails}>
                            <Text style={styles.heading}>Customer Details:</Text>
                            <Text>Customer Name: {orderData.customer ? orderData.customer.name : ''}</Text>
                            <Text>Status: {orderData.paid ? "Paid" : "Unpaid"}</Text>
                            <Text>Date: {FormattedDate}</Text>
                            <Text>Address: Batkhela</Text>
                            <Text>Phone: </Text>
                            <Text style={styles.line}></Text>
                            <view style={styles.part2}>
                                <Text>Invoice: 1</Text>
                                <Text>Date: 16/23/24</Text>
                                <Text>Price: 22 </Text>
                            </view>

                            <Text style={styles.heading}>Invoice Details: Products Details</Text>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCellHeader}>Product Name</Text>
                                    <Text style={styles.tableCellHeader}>Quantity</Text>
                                    <Text style={styles.tableCellHeader}>Price</Text>
                                    <Text style={styles.tableCellHeader}>Discount</Text>
                                    <Text style={styles.tableCellHeader}>Total</Text>
                                </View>
                                {products.map((prod, index) => ( // Rename the variable used in map function
                                    <View style={styles.tableRow} key={index}>
                                        <Text style={styles.tableCell}>{prod.name}</Text>
                                        <Text style={styles.tableCell}>{prod.quantity}</Text>
                                        <Text style={styles.tableCell}>${prod.price}</Text>
                                        <Text style={styles.tableCell}>${prod.discount}</Text>
                                        <Text style={styles.tableCell}>${prod.price * prod.quantity - prod.discount}</Text>
                                    </View>
                                ))}
                            </View  >
                            <View style={styles.amount}>
                                <Text  >Total Price: ${TotalPrice}</Text>
                                <Text id='disconunt'>Discount: ${TotalDiscount}</Text>
                                <Text>Total Cost: ${TotalAmount} </Text>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        );
    }

    return (
        <>
            <PDFViewer style={{ width: '90vw', height: '90vh', backgroundColor: "black" }}>
                {generateInvoice()}
            </PDFViewer>
        </>
    );
};

export default InvoicePDF;
