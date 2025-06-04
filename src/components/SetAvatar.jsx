import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import staticAvatar from "../assets/logo.svg"; // ✅ Import your PNG image

export default function SetAvatar() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
  }, []);

  const setProfilePicture = async () => {
    const user = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );

    try {
      // Convert image to base64
      const image = await toBase64(staticAvatar);

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image,
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    } catch (error) {
      toast.error("Failed to set avatar. Please try again.", toastOptions);
    }
  };

  const toBase64 = (imgPath) => {
    return new Promise((resolve, reject) => {
      fetch(imgPath)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result.split(",")[1];
            resolve(base64data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  return (
    <Container>
      <div className="title-container">
        <h1>Set Your Profile Picture</h1>
      </div>
      <div className="avatar">
        <img src={staticAvatar} alt="avatar" />
      </div>
      <button onClick={setProfilePicture} className="submit-btn">
        Set as Profile Picture
      </button>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      height: 6rem;
      border: 0.4rem solid #4e0eff;
      border-radius: 5rem;
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
