import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
//import { useContext } from 'react'
import { Authcontext } from '../../context/Authcontext'


const ProfilePage = () => {

  const { authUser, updateProfile } = useContext(Authcontext)

  const [selectedImage, setSelectedImage] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || "")
  const [bio, setBio] = useState(authUser?.bio || "")

  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || "");
      setBio(authUser.bio || "");
    }
  }, [authUser]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      const res = await updateProfile({ fullName: name, bio });
      if (res?.success) {
        navigate('/');
      }

      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate('/');
    }

  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>


          <h3 className='text-lg'>Profile details</h3>

          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImage && 'rounded-full'}`} />
            <input onChange={(e) => setSelectedImage(e.target.files[0])} type="file" name="" id="avatar" accept='.png .jpg .jpeg' hidden />
            Upload file image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name}
            type="text" required placeholder='Your name' className=' p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-violet-500' name="" id="" />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio}
            placeholder='Write profile bio' required className='p-2 border border-gray-500 rounded-md focus:ring-2 focus:ring-violet-500 focus:outline-none' rows={4}></textarea>

          <button type="submit" className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>Save</button>
        </form>
        <img src={authUser?.profilePic ||assets.logo_icon} className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage && 'rounded-full'}`} alt="" />
      </div>

    </div>
  )
}

export default ProfilePage
