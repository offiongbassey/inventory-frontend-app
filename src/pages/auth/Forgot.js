import React, { useState } from 'react'
import styles from "./auth.module.css";
import { AiOutlineMail} from "react-icons/ai";
import Card from '../../components/card/Card';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword, validateEmail } from '../../services/authService';
import Loader from '../../components/loader/Loader';

const initialState = {
  email: ""
}

const Forgot = () => {
  const [isLoading, setisLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const {email} = formData;

  const handleInputChange = (e) => {
    const {name, value } = e.target;
    setformData({...formData, [name]: value});

  }

  const forgot = async(e) => {
    e.preventDefault();
    if(!email){
      return toast.error("All fileds required");
    }
    if(!validateEmail(email)){
      return toast.error("Please enter a valid email");
    }
    const userData = {
      email
    }
    setisLoading(true);
         const data = await forgotPassword(userData);
      setisLoading(false);
   
  }




  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader/>}
      <Card>
        <div className={styles.form}>
            <div className='--flex-center'>
              <AiOutlineMail size={35} color="#999" />
            </div>
            <h2>Forgot Password</h2>
            <form onSubmit={forgot}>
              <input type="email" placeholder='Email' 
              required name="email" value={email} onChange={handleInputChange} />
              <button type="submit" className='--btn --btn-primary --btn-block'>Get Reset Email</button>
              <div className={styles.links}>
              <p>
              <Link to="/">-Home</Link>
              </p>
              <p>
              <Link to="/login">-Login</Link>
              </p>
            </div>
            </form>
           

        </div>
      </Card>
      
    </div>
  )
}

export default Forgot
