import React,{useState,useEffect,useRef} from 'react'
import axios from "axios";
import {useReactToPrint} from "react-to-print"; //useReactToPrint used to print out the contents
import Navbar from './Navbar';
import './Supplier.css';


function Sup_details() {
  const[render]=useState(false);
  const [suppliers,setSuppliers]=useState([]);
  const [value, setValue] = useState("");


useEffect(()=>{
     const getAllData=async()=>{
           const res=await axios.get("http://localhost:8070/api/v1/sup");
           setSuppliers(res.data);
     };
     getAllData();
            },[render]);

        const handleSearch = async (e) => {
              e.preventDefault();
              try {
                const res = await axios.get(`http://localhost:8070/api/v1/sup/search?F_name=${value}`);
                setSuppliers(res.data);
                setValue("");
              } catch (error) {
                console.log(error);
              }
            };

            const componentPDF=useRef();
            const generatePDF=useReactToPrint({
                content: ()=>componentPDF.current,
                documentTitle:"supplier Data",
                //onAfterPrint:()=>alert("Data saved in PDF")
            });
            
            const CompanyLogo = () => {
              return (

                <div className='header'>
                  <img src =  './Icon.jpeg' alt="icon" style={{ maxWidth: '00%', height: 'auto' }} />
                   <p>SAI PHOTOGRAPHY<br></br>
                   Malabe,<br></br>
                   Colombo
                  </p>
                </div>
              );
            };
           
  return (
    <div>
        <Navbar/>
          <div className='container' >
            
         
    <form class="d-flex" role="search"   onSubmit={handleSearch}>
      <input class="form-control me-2"
       type="search"
        placeholder="Suplier Name" 
        aria-label="Search"
        value={value}
        onChange={(e)=>setValue(e.target.value)}/>
      <button class="btn btn-outline-success" type="submit">SEARCH</button>
    </form>
    
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <button class="btn btn-primary" style={{ backgroundColor: '#130518', color: 'white' }}onClick={generatePDF}>PRINT REPORT</button>
    </div>
    
<div ref={componentPDF} style={{width:'100%'}}>
  <CompanyLogo/>
  
<br></br>
            
<h2 class="text-center"><b>ALL SUPPLIERS DETAILS</b></h2>
<br></br>
<br></br>
              <table class="table">
                  <thead>
                      <tr style={{ backgroundColor:'#053F5C' , color:'white'  }}>
                          <th scope="col">ID</th>
                            <th scope="col">FIRSTNAME</th>
                            <th scope="col">LASTNAME</th>
                            <th scope="col">EMAIL</th>
                            <th scope="col">PHONE</th>
                            <th scope="col">ADDRESS</th>
                            <th scope="col">PRODUCTS</th>
                            
                            
                      </tr>
                  </thead>
                  <tbody>
                     {suppliers && suppliers.map((supplier,index)=>{
                      return (
                        <tr key={supplier._id}>
                        <td>{index + 1}</td>
                          <td>{supplier.F_name}</td>
                          <td>{supplier.L_name}</td>
                          <td>{supplier.Email}</td>
                          <td>{supplier.Phone}</td>
                          <td>{supplier.Address}</td>
                          <td>{supplier.Products}</td>
                          
                          
                      </tr>
                      )
                     })}
                      
                  </tbody>
              </table>
          </div>
          </div> 
          </div>     
  )
}

export default Sup_details