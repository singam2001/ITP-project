import React,{useState,useEffect, Suspense}from 'react';
import axios from "axios";
import Navbar from './Navbar';
import './Supplier.css';




function Home() {
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
    return (
       
      <div>
        <Navbar/>
      <div className='container'>
            
      <form class="d-flex" role="search"   onSubmit={handleSearch}>
        <input class="form-control me-2"
         type="search"
          placeholder="Suplier's Name" 
          aria-label="Search"
          value={value}
          onChange={(e)=>setValue(e.target.value)}/>
        <button class="btn btn-outline-success" type="submit">SEARCH</button>
      </form>
      
      <h2 class="text-center"><b> SUPPLIERS DETAILS</b></h2>
         <br></br>   
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
                       {suppliers&& suppliers.map((supplier,index)=>{
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
    )
}

export default Home