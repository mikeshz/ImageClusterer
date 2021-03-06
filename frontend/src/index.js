import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from 'react-grid-gallery';

function Recluster(props) {
    return (
        <button onClick={props.onClick}>
            Recluster Images
        </button>
    );
}

function Movement(props) {
    return (
        <button onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class ImageClusterer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            images: [],
            selectAllChecked: false
        };
        this.onSelectImage = this.onSelectImage.bind(this);
        this.getSelectedImages = this.getSelectedImages.bind(this);
    }

    componentDidMount() {
        fetch('//localhost:3001/api/getimages', {headers: {"Content-Type": "application/json"}})
            .then(results => {
                return results.json();
            }).then(data => {
                var imagesArray = {"images": [data["images"].length]};
                for (var i = 0; i < data["images"].length; i++) {
                    imagesArray["images"][i] = {
                        "src": "data:image/png;base64," + data["images"][i]["src"],
                        "thumbnail": "data:image/png;base64," + data["images"][i]["thumbnail"],
                        "thumbnailWidth": 300,
                        "thumbnailHeight": 170
                    }
                }
                this.setState(imagesArray);
            })
    }

    renderReclusterBtn() {
        return (
            <Recluster
                onClick={() => this.handleClick("recluster")}
            />
        );
    }

    renderMovementBtn(moveType) {
        return (
            <Movement
                value={moveType}
                onClick={() => this.handleClick(moveType)}
            />
        );
    }

    handleClick(buttonClicked) {
        console.log(buttonClicked);
        var apiRoute = '//localhost:3001/api/';
        var requestDict;
        if (buttonClicked === "recluster") {
            console.log("selected: " + this.getSelectedImages().toString());
            apiRoute += "recluster";
            requestDict = {selectedImages: this.getSelectedImages().toString()}
        } else {
            apiRoute += "moveview";
            requestDict = {movement: buttonClicked}
        }
        fetch(apiRoute, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestDict)
        }).then(results => {
            return results.json();
        }).then(data => {
            var imagesArray = {"images": [data["images"].length]};
            for (var i = 0; i < data["images"].length; i++) {
                imagesArray["images"][i] = {
                    "src": "data:image/png;base64," + data["images"][i]["src"],
                    "thumbnail": "data:image/png;base64," + data["images"][i]["thumbnail"],
                    "thumbnailWidth": 300,
                    "thumbnailHeight": 170
                }
            }
            this.setState(imagesArray);
        })
    }

    allImagesSelected (images){
        var f = images.filter(
            function (img) {
                return img.isSelected == true;
            }
        );
        return f.length == images.length;
    }

    onSelectImage (index, image) {
        var images = this.state.images.slice();
        var img = images[index];
        if(img.hasOwnProperty("isSelected"))
            img.isSelected = !img.isSelected;
        else
            img.isSelected = true;

        this.setState({
            images: images
        });

        if(this.allImagesSelected(images)){
            this.setState({
                selectAllChecked: true
            });
        }
        else {
            this.setState({
                selectAllChecked: false
            });
        }
    }

    getSelectedImages () {
        var selected = [];
        for(var i = 0; i < this.state.images.length; i++)
            if(this.state.images[i].isSelected == true)
                selected.push(i);
        return selected;
    }

    render () {
        return (
            <div>
                <div style={{
                    padding: "2px",
                    color: "#666"
                }}>Selected images: {this.getSelectedImages().toString()}</div>
            <div>
                {this.renderReclusterBtn()}
            </div>
            <div>
                {this.renderMovementBtn("Left")}
                {this.renderMovementBtn("Right")}
                {this.renderMovementBtn("Up")}
                {this.renderMovementBtn("Down")}
                {this.renderMovementBtn("In")}
                {this.renderMovementBtn("Out")}
            </div>
            <div style={{
                display: "block",
                minHeight: "1px",
                width: "1500px",
                border: "1px solid #ddd",
                overflow: "none"}}>
                <Gallery
                    images={this.state.images}
                    onSelectImage={this.onSelectImage}
                    showLightboxThumbnails={true}/>
            </div>
        </div>
        );
    }
}

ReactDOM.render(<ImageClusterer />, document.getElementById('root'));
