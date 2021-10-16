import React, {useState, useEffect, useRef} from "react"

const MemeGenerator = ((props)=>{
    const topInputRef = useRef()
    const imgRef = useRef()
    const linkRef = useRef()
    const bottomInputRef = useRef()
    const canvasRef = useRef()
    const [noOfClick, setNoOfClick] = useState(0)
    const [topText, settopText] = useState("")
    const [bottomText, setbottomText] = useState("")
    const [randomImg, setrandomImg] = useState("http://i.imgflip.com/1bij.jpg")
    const [altText, setaltText] = useState("Soon...")
    const [allMemeImgs, setallMemeImgs] = useState([])
    const [topChecked, settopChecked] = useState(true)
    const [bottomChecked, setbottomChecked] = useState(true)
  
    // function to wrap text in the canvas 
    function getLines(ctx, text, maxWidth) {
        var words = text.split(" ")
        // checking if the sentence is a single word
        if (words.length < 2) {
            words = text.split("");
            var single = true
        }
        var lines = [];
        var currentLine = words[0];

        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                if (single) {
                    currentLine += word;
                }
                else {
                    currentLine += " " + word;
                }
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    const handleGen=((e)=>{
        e.preventDefault()
        const randNum = Math.floor(Math.random() * allMemeImgs.length)
        setrandomImg(allMemeImgs[randNum].url )
        setaltText( allMemeImgs[randNum].name )
        setNoOfClick(0)
    })

    // function to check if the checkboxes to disable the text columns are checked
    const handleChange=((e)=>{
        if(e.target.name==="topChecked"){
            settopChecked(e.target.checked)
            topInputRef.current.disabled = !topInputRef.current.disabled
            settopText("") 
        }

        if (e.target.name === "bottomChecked") {
            setbottomChecked(e.target.checked)
            bottomInputRef.current.disabled = !bottomInputRef.current.disabled
            setbottomText("")
        }
    })

    //function to generate the download button    
    const handleGenDownload = ((e) =>{
        e.preventDefault()
        var canvas = canvasRef.current
        var img = new Image()
        img.src = randomImg
        img.crossOrigin = "anonymous"
        canvas.height = img.height
        canvas.width = img.width
        console.log(canvas)
        var context = canvas.getContext("2d")
        context.drawImage(img, 0, 0);
        context.font = "25px VT323";
        context.fillStyle = 'white'; 
        context.textAlign = 'center';

        if (topText !== "") {
            const upLines = getLines(context, topText, img.width)
            for (var i = 0; i < upLines.length; i++) {
                context.fillText(upLines[i], img.width / 2, (i + 1) * 24)
            }
        }

        if (bottomText !== "") {
            const downLines = getLines(context, bottomText, img.width)
            for (i = 0; i < downLines.length; i++) {
                context.fillText(downLines[i], img.width / 2, ((img.height - 50) + ((i + 1) * 24)))
            }
        }
        const image = canvas.toDataURL("image/png")

        
        const link = linkRef.current
        link.href = image
        link.download = altText
        setNoOfClick(noOfClick => noOfClick + 1)
        while (!(canvasRef.current !== undefined && canvasRef.current.height !== 0 && noOfClick >= 1)) {
            link.click()
        }

    })
   
    //function when the download button shows and is clicked 
    const handleDownload = ((e)=>{
        e.preventDefault()
        const link = linkRef.current
        link.click()
       
    })
   
    useEffect(() => {
        
    },[randomImg, altText, topText, bottomText])


    useEffect(()=>{
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(res => setallMemeImgs(res.data.memes))
    },[])
    const hasMemes=allMemeImgs.length>0
    return(<div>
            {hasMemes ?
             <div>    
                <form className="meme-form">
                    <input
                        ref={topInputRef}
                        type="text"
                        name="topText"
                        placeholder="Top Text"
                        value={topText}
                    onChange={e => settopText(e.target.value)} />
                    <input
                        ref={bottomInputRef}
                        type="text"
                        name="bottomText"
                        placeholder="Bottom Text"
                        value={bottomText}
                    onChange={e => setbottomText(e.target.value)} />
                    <button onClick={handleGen}>Gen</button>
                </form>
                <div className="meme">
                    <div>
                        <img ref = {imgRef}
                        src = {randomImg} 
                        alt = {altText} 
                        height = {640}
                        width = {640}/>
                        <h2 className="top">{topText}</h2>
                        <h2 className="bottom">{bottomText}</h2>
                    </div>
                    <div>
                        <input
                            type="checkbox"
                            name="topChecked"
                            checked={topChecked}
                            onChange={handleChange}
                        /><label>Upper Text?</label>   
                        <input
                            type="checkbox"
                            name="bottomChecked"
                            checked={bottomChecked}
                            onChange={handleChange}
                        /><label>Lower Text?</label>
                    </div>
                    <div>
                        <button onClick={handleGenDownload}>Gen Image</button>
                         {canvasRef.current !== undefined  && canvasRef.current.height !==0  && noOfClick >= 1? <button onClick={handleDownload}>Download</button>:<h5>Please Click again</h5>}
                    </div>
                </div>
                <div className="dowaload-div"> 
                    <canvas ref={canvasRef}
                    ></canvas>
                    <a ref={linkRef} href="none">{}</a>
                </div>
        </div> :"Loading..."} </div>)
})

export default MemeGenerator