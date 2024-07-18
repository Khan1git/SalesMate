import React, { useState, useEffect } from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        padding: 20,
        fontSize: '10px'
    },
    line: {
        display: 'flex',
        gap: '1rem',
        width: '100%',
        border: '1px solid grey',
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
        textAlign: 'start',
        width: '100%',
    },
    part2: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    heading: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
        // fontSize: 16,
        marginBottom: 10,
        textDecoration: 'underline',
        textAlign: 'center',
        fontSize: '10px'
    },
    table: {
        display: 'table',
        width: '100%',
        // borderStyle: 'solid',
        border: 1,
        margin: 10,
    },
    tableRow: {
        flexDirection: 'row',
        // border: .3,

    },
    tableCellHeader: {
        padding: 7,
        // borderStyle: 'solid',
        // borderLeft: 1,
        borderRight: 1,
        // borderTop: 1,
        // borderWidth: '1px solid black',
        textAlign: 'center',
        fontSize: '12px',
        // borderBottom: 1,
        width: "100%",
    },
    tableCell: {
        padding: 5,
        width: "100%",
        fontSize: '10px',
        textAlign: 'center',
        borderRight: 1,
        borderTop: 1,
        // borderWidth: '1px solid grey',

    },
    amount: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingRight: '10%',
        // textAlign: 'center',
        // gap: '90px'
        marginTop: '-8px',
        // margin: '1px'
    },
    total_amount: {
        display: 'flex',
        flexDirection: 'row',
        // alignItems: 'center',
    },
    price: {
        border: 1,
        // fontWeight: 'bold',
        width: '22.4%',
        backgroundColor: '#edece8',
        marginLeft: '2%',
        marginRight: '-13%',
        textAlign: 'center',
        padding: '4px',
        // margin: "1px"
    },
    words: {
        // marginTop: '40px',
        // textDecoration: 'underline',
        fontSize: '12px',
        margin: '3px',
        borderStyle: 'solid'
    },
    cash:{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingRight: '10%',
        // textAlign: 'center',
        // gap: '90px'
        marginTop: '1px',
        // margin: "1rem"
    }
});

const numberToWords = (num) => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const belowTwenty = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    if (num < 10) return ones[num];
    if (num < 20) return belowTwenty[num - 10];
    if (num < 100) return teens[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' hundred ' + (num % 100 !== 0 ? numberToWords(num % 100) : '');

    return numberToWords(Math.floor(num / 1000)) + ' thousand ' + (num % 1000 !== 0 ? numberToWords(num % 1000) : '');
};


function TempInvoicePage() {
    const [companyData, setCompanyData] = useState('');
    const [orderData, setOrderData] = useState({});
    const [products, setProduct] = useState([]);
    const [customerId, setId] = useState('')
    const [customerDetails, setCustomerDetails] = useState([])
 

    // -------------------- SHOWING THE COMPANY DATA

    const showCompanyDate = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/company/get', { method: "GET" });
            const result = await response.json();
            setCompanyData(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        showCompanyDate();
    }, []);

    const { id } = useParams();
    const showOrder = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/order/getby-id/${id}`, { method: "GET" });
            const result = await response.json();
            setOrderData(result);
            setProduct(result.products);
            setId(result.customer.customerId)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        showOrder();
    }, [id]);




    const TotalPrice = products.reduce((total, product) => total + (product.price * product.quantity), 0);
    const TotalAmount = products.reduce((total, product) => total + (product.price * product.quantity - product.discount), 0);
    const TotalDiscount = products.reduce((total, product) => total + (product.discount), 0);

    const FormattedDate = new Date(orderData.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    function generateInvoice() {
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <View style={styles.companyDetails}>
                            <Text style={styles.heading}>Company Details</Text>
                            {companyData.length > 0 && (
                                <>
                                    <Text>{companyData[0].companyName}</Text>
                                    <Text>{companyData[0].Address}</Text>
                                    <Text>Phone No: {companyData[0].phone}</Text>
                                </>
                            )}
                        </View>
                        <View style={styles.invoiceDetails}>
                            <View style={styles.part2}>
                                <Text>Invoice No:  {orderData ? orderData.InvNo : ''}</Text>
                                <Text style={{ ...styles.text, textDecoration: 'underline' }}>Invoice</Text>
                                <Text>Date: {orderData.date ? format(new Date(orderData.date), 'dd-MMMM-yyyy') : ''}</Text>
                            </View>
                            <Text>Customer Name: {orderData ? orderData.name : ''}</Text>
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableCellHeader}>Item</Text>
                                    <Text style={styles.tableCellHeader}>Quantity (in Units)</Text>
                                    <Text style={styles.tableCellHeader}>Unit</Text>
                                    <Text style={styles.tableCellHeader}>Rate/Unit</Text>
                                    {/* <Text style={styles.tableCellHeader}>Discount/item</Text> */}
                                    <Text style={styles.tableCellHeader}>Amount</Text>
                                </View>
                                {products.map((prod, index) => (
                                    <View style={styles.tableRow} key={index}>
                                        <Text style={styles.tableCell}>{prod.name}</Text>
                                        <Text style={styles.tableCell}>{prod.quantity}.00</Text>
                                        <Text style={styles.tableCell}>{prod.unit ? prod.unit : "other"}</Text>
                                        <Text style={styles.tableCell}>{prod.price}.00</Text>
                                        {/* <Text style={styles.tableCell}>{prod.discount}.00</Text> */}
                                        {/* <Text style={styles.tableCell}>{prod.price * prod.quantity - prod.discount}.00</Text> */}
                                        <Text style={styles.tableCell}>{prod.price * prod.quantity}.00</Text>
                                    </View>
                                ))}
                            </View>
                            {/* <View style={styles.amount}>
                                <Text style={styles.total_amount}>Total Discount (in ):</Text>
                                <Text style={styles.price}>{TotalDiscount}.00</Text>
                            </View> */}
                            <View style={styles.amount}>
                                <Text style={styles.total_amount}>Total Payable (in ):</Text>
                                <Text style={styles.price}>{TotalAmount}.00</Text>
                            </View>
                            <View style={styles.cash}>
                                <Text style={styles.total_amount}>Payment Method:</Text>
                                <Text style={styles.price}>cash</Text>
                            </View>
                            <View style={styles.words}>
                                <Text>Amount In Words:{numberToWords(TotalAmount)}only</Text>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        );
    }

    return (
        <>
            <PDFViewer style={{ width: '90vw', height: '100vh', backgroundColor: "black" }}>
                {generateInvoice()}
            </PDFViewer>
        </>
    );
}


export default TempInvoicePage
