"use client";
import { useRef, useState } from "react";
import classes from "./image-picker.module.css";
import Image from "next/image";

export default function ImagePicker({ label, name }) {
  const [pickImage, setPickImage] = useState(null);
  const imageInput = useRef();
  const handleClick = () => {
    imageInput.current?.click();
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return setPickImage(null);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      setPickImage(fileReader.result);
    };
  };
  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickImage && <p>No Image picked yet.</p>}
          {pickImage && <Image src={pickImage} alt="picked image" fill />}
        </div>
        <input
          ref={imageInput}
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg"
          name={name}
          onChange={handleImageChange}
          required
        />
        <button onClick={handleClick} className={classes.button} type="button">
          Pick an image
        </button>
      </div>
    </div>
  );
}
