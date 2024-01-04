import { Alert, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, IconButton, Snackbar, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { useState, useRef, Fragment, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CloseIcon from '@mui/icons-material/Close';

export default function Main() {
  const theme = useOutletContext();
  const videoRef = useRef();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [haveRequest, setHaveRequest] = useState(false);
  const [response, setResponse] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState({state: false, type: "error", message: ""});

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

  const imageEvaluateBtnClick = () => {
    if(!haveRequest){
      setHaveRequest(true);
      setResponse(null);
      var formData = new FormData();
      formData.append('file', selectedImage);
      fetch('http://localhost:8080/image', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setResponse(data);
        setHaveRequest(false)
      })
      .catch(error => {
        console.error('Error: ' + error);
      });
    }
    else{
      setOpenSnackBar({state: true, type: "error", message: "Please wait til the previous request is finished!"})
    }
  }

  const videoEvaluateBtnClick = () => {
    if(!haveRequest){
      setHaveRequest(true);
      setResponse(null);
      var formData = new FormData();
      formData.append('file', selectedVideo);
      fetch('http://localhost:8080/video', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setResponse(data);
        setHaveRequest(false)
      })
      .catch(error => {
        console.error('Error: ' + error);
      });
    }
    else{
      setOpenSnackBar({state: true, type: "error", message: "Please wait til the previous request is finished!"})
    }
  }

  const handleCloseSnackBar = (event, reason) => {
    if(reason === "clickaway"){
      return
    }
    setOpenSnackBar({...openSnackBar, state: false});
  }

  useEffect(() => {    
    videoRef.current?.load();
  }, [selectedVideo]);

  const handleMoreDetailButtonClick = (link) => {
    console.log(link)
    if(link != null){
      window.open(link, '_blank', 'noopener,noreferrer');
    }
    else{
      setOpenSnackBar({state: true, type: "info", message: "This member hasn't added a link to personal page yet!"})
    }
  }

  const card = (name, mssv, img, description, personalLink) => {
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
          <Typography variant="h5" component="div" sx={{marginTop: 1}}>
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
          <Button size="small" onClick={() => handleMoreDetailButtonClick(personalLink)}>More detail?</Button>
        </CardActions>
      </Fragment>
    )
  };

  const evaluation = (score) => {
    if(score <= 0.2){
      return "Very good score, most likely to be a REAL picture/video"
    }
    else if(score <= 0.4){
      return "Good score overall, likely to be a REAL picture/video"
    }
    else if(score <= 0.6){
      return "Bad score, cannot decide between REAL and FAKE"
    }
    else if(score <= 0.8){
      return "Good score, likely to be a FAKE picture/video"
    }
    else{
      return "Very good score, most likely to be a FAKE picture/video"
    }
  }

  return (
    <div className="flex flex-col flex-grow items-center border rounded-[1rem] mx-auto my-10 px-5 transition-all z-10" style={{background: theme.palette.background.secondary}}>
      <p id="about" className="text-center text-[3rem] font-semibold">About</p>
      <div className="w-[60rem] m-5 p-5 border rounded-[1rem] shadow-lg">
        <p className="text-[1.1rem]"><span className="m-5"></span>In the last few years, several techniques for facial manipulation in videos have been successfully developed and made available to the masses (i.e., FaceSwap, deepfake, etc.). These methods enable anyone to easily edit faces in video sequences with incredibly realistic results and a very little effort. Despite the usefulness of these tools in many fields, if used maliciously, they can have a significantly bad impact on society(e.g., fake news spreading, cyber bullying through fake revengeporn). The ability of objectively detecting whether a face has been manipulated in a video sequence is then a task of utmost importance. Here, we present a way to detect those image or videos that has been tampered!</p>
        <p className="text-[1.1rem] mt-3">We adopt and modified existing project of pioneer on this specific topic. We try to strive for knowledge regarding Artificial Intelligence in general; Machine Learning, Deep Learning in particular. In this demo, we illustrate the result of our research, detecting both images and videos that may have been modified by Deepfake Technology!</p>
        <div className="text-[1.1rem] mt-3">
          We are group 11, consiting of 3 members
          <div className="flex mt-3">
            <Card variant="outlined" sx={{marginRight: 2}}>{card("Nguyễn Đình Út Biu", "20215317", "img", "Member 1!", null)}</Card>
            <Card variant="outlined" sx={{marginRight: 2}}>{card("Trần Trọng Khiêm", "20215402", "img", "Member 2!", null)}</Card>
            <Card variant="outlined" sx={{marginRight: 2}}>{card("Nguyễn Trung Hiển", "20215364", "img", "Member 3!", null)}</Card>
          </div>
        </div>
      </div>
      <p id="demo" className="text-center text-[3rem] font-semibold">Demo</p>
      <div className="w-[60rem] m-5 p-5 border rounded-[1rem] opacity-90 shadow-lg">
        <Tabs sx={{marginBottom: 3}} value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)}>
          <Tab label="Image"></Tab>
          <Tab label="Video"></Tab>
        </Tabs>
        <div hidden={selectedTab !== 0} style={{minHeight: "30rem"}} onPaste={handlePaste}>
          <p className="text-[1.2rem] mb-3">Choose an image to evaluate!</p>
          <input type="file" accept="image/*" onChange={handleImageChange}/>
          {selectedImage && (
            <div className="flex flex-col justify-center">
              <p className="mt-5 text-[1.2rem] font-semibold">Selected Image:</p>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                style={{ maxWidth: '100%'}}
              />
              <Button className="self-center" variant="outlined" sx={{width: 200, marginY: 3, borderRadius: 5, backgroundColor: theme.palette.background.button}} onClick={imageEvaluateBtnClick}>Evaluate image</Button>
              {haveRequest &&
                <div className="flex flex-col justify-center items-center">
                  <CircularProgress/>
                  <p>Please wait ...</p>
                </div>
              }
              {response &&
                <div>
                  <div className="flex items-center">
                    <p>Score</p>
                    <Tooltip title="A score close to 0 predicts REAL. A score close to 1 predicts FAKE.">
                      <IconButton>
                        <QuestionMarkIcon sx={{fontSize: 15}}/>
                      </IconButton>
                    </Tooltip>
                    <p>: {response.score}</p>
                  </div>
                  <p>{evaluation(parseFloat(response.score))}</p>
                </div>
              }
            </div>
          )}
        </div>
        <div hidden={selectedTab !== 1} style={{minHeight: "30rem"}}>
          <p className="text-[1.2rem] mb-3">Choose an video to evaluate!</p>
          <input type="file" accept="video/mp4" onChange={handleVideoChange}/>
          {selectedVideo && (
            <div className="flex flex-col">
              <p>Selected Video:</p>
              <video
                ref={videoRef}
                controls
              >
                <source src={URL.createObjectURL(selectedVideo)} type="video/mp4"></source>
              </video>
              <Button className="self-center" variant="outlined" sx={{width: 200, marginY: 3, borderRadius: 5, backgroundColor: theme.palette.background.button}} onClick={videoEvaluateBtnClick}>Evaluate Video</Button>
              {haveRequest &&
                <div className="flex flex-col justify-center items-center">
                  <CircularProgress/>
                  <p>Please wait ...</p>
                </div>
              }
              {response &&
                <div>
                  <div className="flex items-center">
                    <p>Score</p>
                    <Tooltip title="A score close to 0 predicts REAL. A score close to 1 predicts FAKE.">
                      <IconButton>
                        <QuestionMarkIcon sx={{fontSize: 15}}/>
                      </IconButton>
                    </Tooltip>
                    <p>: {response.score}</p>
                  </div>
                  <p>{evaluation(parseFloat(response.score))}</p>
                </div>
              }
            </div>
          )}
        </div>
      </div>
      <p id="references" className="text-center text-[3rem] font-semibold">References</p>
      <div className="w-[60rem] m-5 p-5 border rounded-[1rem] opacity-90 shadow-lg">
        <a className="text-blue-500" href="https://paperswithcode.com/paper/video-face-manipulation-detection-through#code">Video Face Manipulation Detection Through Ensemble of CNNs</a>
      </div>
      <Snackbar
        open={openSnackBar.state}
        autoHideDuration={3000}
        onClose={handleCloseSnackBar}
        action={<Fragment><IconButton><CloseIcon fontSize="small" /></IconButton></Fragment>}
      >
        {openSnackBar.type === "error" ? <Alert sx={{border: 1, boxShadow: 10}} severity="error" onClose={handleCloseSnackBar}>{openSnackBar.message}</Alert> : openSnackBar.type === "info" && <Alert sx={{border: 1, boxShadow: 10}} severity="info" onClose={handleCloseSnackBar}>{openSnackBar.message}</Alert>}
      </Snackbar>
    </div>
  );
}