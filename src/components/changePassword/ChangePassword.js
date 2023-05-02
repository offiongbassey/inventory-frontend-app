import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { selectIsLoading } from '../../redux/features/product/productSlice';
import { changePassword } from '../../services/authService';
import Card from '../card/Card';
import Loader, { SpinerImg } from '../loader/Loader';
import "./ChangePassword.css";

const initialState = {
 oldPassword: "",
 password: "",
 password2: ""       
};
const ChangePassword = () => {
  const [formData, setformData] = useState(initialState);
  const { oldPassword, password, password2 } = formData;
  const [isLoading, setIsLoading ] = useState(false);
  
    
  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setformData({ ...formData, [name]: value});

  }
  const changePass = async(e) => {
      e.preventDefault();
      setIsLoading(true);
      

      if(password !== password2){
           toast.error("New Passwords do not match");
          return setIsLoading(false);
      }
      const formData = {
          oldPassword,
          password
      }
      const data = await changePassword(formData);
      toast.success(data);
      setIsLoading(false);
      
  }
  return (
    <div className='change-password'>
        {isLoading && <Loader />}
        <Card cardClass={"password-card"}>
            <h3>Change Password</h3>
            <form onSubmit={changePass} className="--form-control">
                <input type="password" name='oldPassword' value={oldPassword} onChange={handleInputChange} placeholder="Old Password" />
                <input type="password" name='password' value={password} onChange={handleInputChange} placeholder="New Password" />
                <input type="password" name='password2' value={password2} onChange={handleInputChange} placeholder="Confirm New Password" />

                <button className='--btn --btn-primary' type='submit'>Change Password</button>

            </form>
        </Card>
      
    </div>
  )
}

export default ChangePassword

