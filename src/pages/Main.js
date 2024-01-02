import { Button, Card, CardActions, CardContent, CardMedia, Tab, Tabs, Typography } from "@mui/material";
import { useState, useRef, Fragment, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export default function Main() {
  const theme = useOutletContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef();

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // You can perform additional checks or validations here
      // For example, check if the selected file is an image
      // You may also want to check the file size, type, etc.

      setSelectedImage(file);

      // If you want to preview the selected image, you can use FileReader
      // const reader = new FileReader();
      // reader.onload = () => {
      //   // Use reader.result to display the image preview
      // };
      // reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === 'video/mp4') {
      // Update the state with the selected video file
      setSelectedVideo(file);
    } else {
      // Handle invalid file type or no file selected
      setSelectedVideo(null);
    }
  };

  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();

        // You can perform additional checks or validations here
        // For example, check the file size, type, etc.

        setSelectedImage(file);

        // If you want to preview the pasted image, you can use FileReader
        // const reader = new FileReader();
        // reader.onload = () => {
        //   // Use reader.result to display the image preview
        // };
        // reader.readAsDataURL(file);

        // Prevent default paste behavior
        event.preventDefault();
        break;
      }
    }
  };

  useEffect(() => {    
    videoRef.current?.load();
  }, [selectedVideo]);

  const card = (name, mssv, img, description) => {
    return (
      <Fragment>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Member
          </Typography>
          <CardMedia
            component="img"
            image="https://i0.wp.com/www.crowsworldofanime.com/wp-content/uploads/2021/01/reZERO_Season_2_Part_2_Episode_41_Figure01.jpg?fit=1918%2C1080&ssl=1"
            alt="Pfp"
          />
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {mssv}
          </Typography>
          <Typography variant="body2">
            {description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Fragment>
    )
  };

  return (
    <div className="flex flex-col flex-grow items-center border rounded-[1rem] mx-auto my-10 px-5 transition-all z-10" style={{background: theme.palette.background.secondary}}>
      <p className="text-center text-[3rem] font-semibold">About</p>
      <div className="w-[60rem] m-5 p-5 border rounded-[1rem] shadow-lg">
        <p>
          Project: Deepfake Detection Technology
        </p>
        <p>
          This project try to detect images and videos that may have been tampered by Deepfake Technology
        </p>
        <div>
          Made by group 11
          <div className="flex mt-3">
            <Card variant="outlined" sx={{marginRight: 2}}>{card("Nguyễn Đình Út Biu", "20215317", "img", "Member 1!")}</Card>
            <Card variant="outlined" sx={{marginRight: 2}}>{card("Trần Trọng Khiêm", "20215317", "img", "Member 2!")}</Card>
            <Card variant="outlined" sx={{marginRight: 2}}>{card("Nguyễn Trung Hiển", "20215317", "img", "Member 3!")}</Card>
          </div>
        </div>
      </div>
      <p className="text-center text-[3rem] font-semibold">Demo</p>
      <div className="w-[60rem] m-5 p-5 border rounded-[1rem] opacity-90 shadow-lg">
        <Tabs sx={{marginBottom: 3}} value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
          <Tab label="Image"></Tab>
          <Tab label="Video"></Tab>
        </Tabs>
        <div hidden={selectedTab !== 0} style={{minHeight: "30rem"}} onPaste={handlePaste}>
          <input type="file" accept="image/*" onChange={handleImageChange}/>
          {selectedImage && (
            <div>
              <p>Selected Image:</p>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                style={{ maxWidth: '100%'}}
              />
            </div>
          )}
        </div>
        <div hidden={selectedTab !== 1} style={{minHeight: "30rem"}}>
        <input type="file" accept="video/mp4" onChange={handleVideoChange}/>
          {selectedVideo && (
            <div>
              <p>Selected Video:</p>
              <video
                ref={videoRef}
                controls
              >
                <source src={URL.createObjectURL(selectedVideo)} type="video/mp4"></source>
              </video>
            </div>
          )}
        </div>
      </div>
      <p className="text-center text-[3rem] font-semibold">References</p>
      <div className="w-[60rem] m-5 p-5 border rounded-[1rem] opacity-90 shadow-lg">
        <a href="https://paperswithcode.com/paper/video-face-manipulation-detection-through#code">Link to paper!</a>
      </div>
    </div>
  );
}