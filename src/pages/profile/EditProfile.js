import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/card/Card';
import ChangePassword from '../../components/changePassword/ChangePassword';
import Loader from '../../components/loader/Loader';
import { selectUser } from '../../redux/features/auth/authSlice';
import { updateUser } from '../../services/authService';
import "./Profile.css";


const EditProfile = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector(selectUser);
    const {email} = user;


    useEffect(() => {
        if(!email){
            navigate("/profile");
        }
    }, [email, navigate]);
    

    const initialState = {
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        bio: user?.bio,
        photo: user?.photo,
    }
    const [profile, setProfile] = useState(initialState);
    const [profileImage, setProfileImage] = useState("");

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setProfile({ ...profile, [name]: value});
    };

    const handleImageChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const saveProfile = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            //Handle image upload to cloudinary
            let imageURL; 
            if(profileImage && 
                (
                    profileImage.type === "image/jpeg" ||
                    profileImage.type === "image/jpg" ||
                    profileImage.type === "image/png"
                )
                ){
                    const image = new FormData()
                    image.append("file", profileImage)
                    image.append("cloud_name", "dfhabqprq")
                    image.append("upload_preset", "h9jikgqi")

                    //first save image to cloudinary
                    const response = await fetch(
                        "https://api.cloudinary.com/v1_1/dfhabqprq/image/upload",
                        {method: "post", body: image}
                        );
                        const imgData = await response.json();
                        imageURL = imgData.url.toString();
                        
                        
                }
                //save profile
                const formData = {
                    name: profile.name,
                    phone: profile.phone,
                    bio: profile.bio,
                    photo: profileImage ? imageURL : profile.photo,
                }
                const data = await updateUser(formData);
                console.log(data);
                toast.success("User Updated");
                navigate("/profile");
                setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            toast.error(error.message);
        }
    };
    


  return (
    <div className='profile --my2'>
      {isLoading && <Loader />}
      <Card cardClass={"card --flex-direction-column"}>
                <span className='profile-photo'>
                    <img src={user?.photo} alt='profile pic' />
                </span>
                <form className='--form-control --m' onSubmit={saveProfile}>
                <span className='profile-data'>
                    <p>
                        <label>Name:</label>
                        <input type="text" name="name" value={profile?.name} onChange={handleInputChange}/>
                    </p>
                    <p>
                    <label>Email:</label>
                        <input type="text" readOnly name="email" value={profile?.email} />
                        <br />
                        <code>Email cannot be changed.</code>
                    </p>
                    <p>
                    <label>Phone:</label>
                        <input type="text" name="phone" value={profile?.phone} onChange={handleInputChange} />
                    </p>
                    <p>
                    <label>Bio:</label>
                       <textarea onChange={handleInputChange} name='bio' cols="30" rows="10" value={profile?.bio}></textarea>
                    </p>
                    <p>
                    <label>Photo:</label>
                        <input type="file" name="image" onChange={handleImageChange} />
                    </p>
                    <div>
                            <button type='submit' className='--btn --btn-primary'>Save Changes</button>
                    </div>

                </span>
                </form>
            </Card>
            <br />
            <ChangePassword />
    </div>
  )
}

export default EditProfile
